import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import {
  ChangePasswordInput,
  ResetPasswordInput,
  UserInput,
  UsernamePasswordInput,
  UserResponse,
} from './user.input';
import { UserService } from './user.service';
import { MyContext } from '../types/MyContext';
import { GetUser } from '../config/user.decorator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../config/auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @ResolveField(() => String)
  email(@Parent() user: User, @GetUser() userId: number): string {
    // this is the current user and its ok to show them their own email
    if (userId === user.id) {
      return user.email;
    }
    // current user wants to see someone elses email
    return '';
  }

  @ResolveField(() => Boolean)
  async followed(
    @Parent() user: User,
    @Context() { followLoader }: MyContext,
    @GetUser() userId: number,
  ): Promise<boolean> {
    if (!userId || userId === user.id) {
      return false;
    }

    const followed = await followLoader.load({
      followingId: user.id,
      followerId: userId,
    });

    return !!followed;
  }

  @Query(() => User, { nullable: true })
  async me(@GetUser() user: number): Promise<User | undefined> {
    if (!user) return undefined;
    return this.userService.getUser(user);
  }

  @Query(() => User, { nullable: true })
  async getProfileById(
    @Args('profileId', { type: () => Int }) profileId: number,
  ): Promise<User | undefined> {
    return this.userService.getUser(profileId);
  }

  @Query(() => User, { nullable: true })
  async getProfileByUsername(
    @Args('username') username: string,
  ): Promise<User | undefined> {
    return this.userService.getUserByUsername(username);
  }

  @Query(() => [User], { nullable: true })
  async searchProfiles(@Args('name') name: string): Promise<User[]> {
    return this.userService.getUsers(name);
  }

  @Mutation(() => UserResponse)
  async register(
    @Args('options')
    options: UsernamePasswordInput,
    @Context() ctx: MyContext,
  ): Promise<UserResponse> {
    return this.userService.register(options, ctx.req);
  }

  @Mutation(() => UserResponse)
  async login(
    @Args('usernameOrEmail') usernameOrEmail: string,
    @Args('password') password: string,
    @Context() ctx: MyContext,
  ): Promise<UserResponse> {
    return this.userService.login(usernameOrEmail, password, ctx.req);
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: MyContext): Promise<boolean> {
    return this.userService.logout(ctx.req, ctx.res);
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Args('email') email: string): Promise<boolean> {
    return this.userService.forgotPassword(email);
  }

  @Mutation(() => UserResponse)
  async resetPassword(
    @Args('input') input: ResetPasswordInput,
    @Context() ctx: MyContext,
  ): Promise<UserResponse> {
    return this.userService.resetPassword(input, ctx.req);
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Args('input') input: ChangePasswordInput,
    @GetUser() userId: number,
  ): Promise<UserResponse> {
    return this.userService.changePassword(input, userId);
  }

  @Mutation(() => UserResponse)
  @UseGuards(AuthGuard)
  async updateUser(
    @Args('input') input: UserInput,
    @GetUser() userId: number,
  ): Promise<UserResponse> {
    return this.userService.updateUser(input, userId);
  }

  @Mutation(() => UserResponse)
  @UseGuards(AuthGuard)
  async updateProfileImage(
    @Args({ name: 'image', type: () => GraphQLUpload }) image: FileUpload,
    @GetUser() userId: number,
  ): Promise<UserResponse> {
    return this.userService.updateUserImage(image, userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async followUser(
    @Args('profileId', { type: () => Int }) profileId: number,
    @GetUser() userId: number,
  ): Promise<boolean> {
    return this.userService.followUser(profileId, userId);
  }
}
