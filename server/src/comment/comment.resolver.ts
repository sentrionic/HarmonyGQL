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
import { Comment } from '../entities/comment.entity';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../config/auth.guard';
import { GetUser } from '../config/user.decorator';
import { User } from '../entities/user.entity';
import { Story } from '../entities/story.entity';
import { MyContext } from '../types/MyContext';
import { CommentResponse, PaginatedComments } from './comment.input';

@Resolver(Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @ResolveField(() => User)
  author(
    @Parent() comment: Comment,
    @Context() { userLoader }: MyContext,
  ): Promise<User> {
    return userLoader.load(comment.authorId);
  }

  @ResolveField(() => Boolean)
  async liked(
    @Parent() story: Story,
    @Context() { likeLoader }: MyContext,
    @GetUser() userId: number,
  ): Promise<boolean> {
    if (!userId) {
      return false;
    }

    const like = await likeLoader.load({
      storyId: story.id,
      userId,
    });

    return !!like;
  }

  @Query(() => PaginatedComments, { nullable: true })
  getStoryComments(
    @Args('storyId', { type: () => Int }) storyId: number,
    @Args('limit', { type: () => Int }) limit: number,
    @Args('cursor', { type: () => String, nullable: true })
    cursor: string | null,
  ): Promise<PaginatedComments> {
    return this.commentService.getStoryComments(storyId, limit, cursor);
  }

  @Mutation(() => CommentResponse)
  @UseGuards(AuthGuard)
  async postComment(
    @Args('storyId', { type: () => Int }) storyId: number,
    @Args('text', { description: 'Min 3, max 500 characters' })
    text: string,
    @GetUser() userId: number,
  ): Promise<CommentResponse> {
    return this.commentService.postComment(storyId, text, userId);
  }
}
