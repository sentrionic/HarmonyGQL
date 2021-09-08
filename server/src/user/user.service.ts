import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileUpload } from 'graphql-upload';
import * as argon2 from 'argon2';
import e from 'express';
import { v4 } from 'uuid';
import md5 from 'md5';
import { getConnection, getRepository, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ChangePasswordInput, ResetPasswordInput, UserInput, UsernamePasswordInput, UserResponse } from './user.input';
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from '../config/constants';
import { redis } from '../config/redis';
import { sendEmail } from '../utils/sendEmail';
import { ChangePasswordSchema, RegisterSchema, ResetPasswordSchema, UserSchema } from '../schemas/user.schema';
import { serializeValidationError } from '../utils/serializeValidationError';
import { uploadProfileImageToS3 } from '../utils/fileUtils';
import { Follower } from '../entities/follower.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
  }

  async register(
    options: UsernamePasswordInput,
    req: e.Request,
  ): Promise<UserResponse> {
    try {
      await RegisterSchema.validate(options, { abortEarly: false });
    } catch (err) {
      return {
        errors: serializeValidationError(err),
      };
    }

    const hashedPassword = await argon2.hash(options.password);

    try {
      const user = await this.userRepository.save({
        username: options.username,
        email: options.email,
        displayName: options.username,
        image: `https://gravatar.com/avatar/${ md5(options.email) }?d=identicon`,
        password: hashedPassword,
      });
      req!.session!.userId = user.id;
      return { user };
    } catch (err) {
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already taken',
            },
          ],
        };
      }
    }

    return {
      errors: [
        {
          field: 'server',
          message: 'Something went wrong',
        },
      ],
    };
  }

  async login(
    usernameOrEmail: string,
    password: string,
    req: e.Request,
  ): Promise<UserResponse> {
    const identifier = usernameOrEmail.includes('@')
      ? { where: { email: usernameOrEmail } }
      : { where: { username: usernameOrEmail } };

    const user = await this.userRepository.findOne(identifier);
    if (!user) {
      return {
        errors: [
          {
            field: 'usernameOrEmail',
            message: 'An account with that username or email does not exist.',
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Incorrect Password',
          },
        ],
      };
    }

    req!.session!.userId = user.id;

    return {
      user,
    };
  }

  async logout(req: e.Request, res: any): Promise<boolean> {
    return new Promise((resolve) =>
      req!.session!.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      }),
    );
  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      // the email is not in the db
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3,
    ); // 3 days

    await sendEmail(
      email,
      `<a href="${ process.env.CORS_ORIGIN }/reset-password/${ token }">Reset Password</a>`,
    );

    return true;
  }

  async resetPassword(
    input: ResetPasswordInput,
    req: e.Request,
  ): Promise<UserResponse> {
    try {
      await ResetPasswordSchema.validate(input, { abortEarly: false });
    } catch (err) {
      return {
        errors: serializeValidationError(err),
      };
    }

    const { newPassword, token } = input;

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'token expired',
          },
        ],
      };
    }

    const user = await this.userRepository.findOne({ id: parseInt(userId) });

    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'user no longer exists',
          },
        ],
      };
    }

    await this.userRepository.update(
      { id: parseInt(userId) },
      { password: await argon2.hash(newPassword) },
    );

    await redis.del(key);

    // log in user after change password
    req!.session!.userId = user.id;

    return { user };
  }

  async changePassword(
    input: ChangePasswordInput,
    userId: number,
  ): Promise<UserResponse> {
    try {
      await ChangePasswordSchema.validate(input, { abortEarly: false });
    } catch (err) {
      return {
        errors: serializeValidationError(err),
      };
    }

    const { newPassword, currentPassword } = input;

    const user = await this.userRepository.findOne({ id: userId });

    if (!user) {
      return {
        errors: [
          {
            field: 'account',
            message: 'Account not found.',
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, currentPassword);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Incorrect Password',
          },
        ],
      };
    }

    await this.userRepository.update(
      { id: userId },
      { password: await argon2.hash(newPassword) },
    );

    return { user };
  }

  async getUser(id: number): Promise<User | undefined> {
    return await this.userRepository.findOne(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { username } });
  }

  async getUsers(name: string): Promise<User[]> {
    return await getRepository(User)
      .createQueryBuilder('user')
      .where('"user".username like :name', { name: '%' + name + '%' })
      .orWhere('"user"."displayName" like :name', { name: '%' + name + '%' })
      .getMany();
  }

  async updateUser(input: UserInput, userId: number): Promise<UserResponse> {
    const { username, email } = input;
    let user = await this.userRepository.findOne(userId);

    if (!user) {
      return {
        errors: [
          {
            field: 'account',
            message: 'Account not found',
          },
        ],
      };
    }

    if (user.username !== username) {
      const checkUsername = await this.userRepository.findOne({
        where: { username: input.username },
      });
      if (checkUsername) {
        return {
          errors: [
            {
              field: 'username',
              message: 'Username already in use',
            },
          ],
        };
      }
    }

    if (user.email !== email) {
      const checkEmail = await this.userRepository.findOne({
        where: { email: input.email },
      });

      if (checkEmail) {
        return {
          errors: [
            {
              field: 'email',
              message: 'Email already in use',
            },
          ],
        };
      }
    }

    try {
      await UserSchema.validate(input, { abortEarly: false });
    } catch (err) {
      return {
        errors: serializeValidationError(err),
      };
    }

    user = await this.userRepository.save({
      ...user,
      ...input,
    });

    return { user };
  }

  async updateUserImage(
    image: FileUpload,
    userId: number,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      return {
        errors: [
          {
            field: 'account',
            message: 'Account not found.',
          },
        ],
      };
    }

    const directory = `users/image/${ userId }`;
    const url = await uploadProfileImageToS3(image, directory);

    user.image = url;
    await this.userRepository.update(userId, { image: url });

    return { user };
  }

  async followUser(profileId: number, userId: number): Promise<boolean> {
    const following = await Follower.findOne({
      where: { followerId: userId, followingId: profileId },
    });

    if (following) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
              delete
              from follower
              where "followerId" = $1
                and "followingId" = $2
          `,
          [userId, profileId],
        );

        await tm.query(
          `
              update "user"
              set following = following - 1
              where id = $1
          `,
          [userId],
        );

        await tm.query(
          `
              update "user"
              set followers = followers - 1
              where id = $1
          `,
          [profileId],
        );
      });
    } else {
      // has never followed before
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
              insert into "follower" ("followerId", "followingId")
              values ($1, $2)
          `,
          [userId, profileId],
        );

        await tm.query(
          `
              update "user"
              set following = following + 1
              where id = $1
          `,
          [userId],
        );

        await tm.query(
          `
              update "user"
              set followers = followers + 1
              where id = $1
          `,
          [profileId],
        );
      });
    }
    return true;
  }
}
