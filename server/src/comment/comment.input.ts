import { Field, ObjectType } from '@nestjs/graphql';
import { Comment } from '../entities/comment.entity';
import { FieldError } from '../user/user.input';

@ObjectType()
export class CommentResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Comment, { nullable: true })
  comment?: Comment;
}

@ObjectType()
export class PaginatedComments {
  @Field(() => [Comment])
  comments!: Comment[];
  @Field()
  hasMore!: boolean;
}
