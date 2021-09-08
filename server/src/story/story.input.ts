import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Story } from '../entities/story.entity';
import { FieldError } from '../user/user.input';

@InputType()
export class StoryInput {
  @Field({ description: 'Min 10, max 500 characters' })
  caption!: string;

  @Field(() => GraphQLUpload)
  image!: FileUpload;
}

@ObjectType()
export class StoryResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Story, { nullable: true })
  story?: Story;
}

@ObjectType()
export class PaginatedStories {
  @Field(() => [Story])
  stories!: Story[];
  @Field()
  hasMore!: boolean;
}
