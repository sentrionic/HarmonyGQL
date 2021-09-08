import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class UsernamePasswordInput implements Partial<User> {
  @Field({ description: 'Unique. Min 3, max 30 alphanumeric characters.' })
  username!: string;

  @Field({ description: 'Unique. Must be a valid email.' })
  email!: string;

  @Field({ description: 'Min 6, max 150 characters.' })
  password!: string;

  @Field({ description: 'Must be the same as the password value.' })
  confirmPassword!: string;
}

@InputType()
export class ChangePasswordInput {
  @Field()
  currentPassword!: string;

  @Field({ description: 'Min 6, max 150 characters.' })
  newPassword!: string;

  @Field({ description: 'Must be the same as the newPassword value.' })
  confirmNewPassword!: string;
}

@InputType()
export class ResetPasswordInput {
  @Field({ description: 'The from the email provided token.' })
  token!: string;
  @Field({ description: 'Min 6, max 150 characters.' })
  newPassword!: string;
  @Field({ description: 'Must be the same as the newPassword value.' })
  confirmNewPassword!: string;
}

@InputType()
export class UserInput implements Partial<User> {
  @Field({ description: 'Unique. Min 3, max 30 alphanumeric characters.' })
  username!: string;

  @Field({ description: 'Unique. Must be a valid email.' })
  email!: string;

  @Field({ nullable: true, description: 'Min 3, max 50 characters.' })
  displayName?: string;

  @Field({ nullable: true, description: 'Max 250 characters.' })
  description?: string;

  @Field({ nullable: true, description: 'Must be a valid website.' })
  website?: string;
}

@ObjectType()
export class FieldError {
  @Field()
  field!: string;
  @Field()
  message!: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
