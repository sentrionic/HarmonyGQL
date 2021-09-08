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
import { Story } from '../entities/story.entity';
import { StoryService } from './story.service';
import { PaginatedStories, StoryInput, StoryResponse } from './story.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../config/auth.guard';
import { GetUser } from '../config/user.decorator';
import { MyContext } from '../types/MyContext';
import { User } from '../entities/user.entity';

@Resolver(Story)
export class StoryResolver {
  constructor(private readonly storyService: StoryService) {}

  @ResolveField(() => String)
  textSnippet(@Parent() story: Story): string {
    return story.caption.slice(0, 50);
  }

  @ResolveField(() => User)
  author(
    @Parent() story: Story,
    @Context() { userLoader }: MyContext,
  ): Promise<User> {
    return userLoader.load(story.authorId);
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

  @Query(() => PaginatedStories)
  getStories(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('cursor', { type: () => String, nullable: true })
    cursor: string | null,
  ): Promise<PaginatedStories> {
    return this.storyService.findAll(limit, cursor);
  }

  @Query(() => PaginatedStories)
  getProfileStories(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('cursor', { type: () => String, nullable: true })
    cursor: string | null,
    @Args('profile', { type: () => Int }) profileId: number,
  ): Promise<PaginatedStories> {
    return this.storyService.getProfileStories(limit, cursor, profileId);
  }

  @Query(() => PaginatedStories)
  getFollowedStories(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('cursor', { type: () => String, nullable: true })
    cursor: string | null,
    @GetUser() user: number,
  ): Promise<PaginatedStories> {
    return this.storyService.getFollowedStories(limit, cursor, user);
  }

  @Query(() => PaginatedStories)
  getLikedStories(
    @Args('limit', { type: () => Int }) limit: number,
    @Args('cursor', { type: () => String, nullable: true })
    cursor: string | null,
    @GetUser() user: number,
  ): Promise<PaginatedStories> {
    return this.storyService.getLikedStories(limit, cursor, user);
  }

  @Query(() => Story, { nullable: true })
  getStoryById(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Story | undefined> {
    return this.storyService.getStoryById(id);
  }

  @Query(() => Story, { nullable: true })
  getStoryBySlug(@Args('slug') slug: string): Promise<Story | undefined> {
    return this.storyService.getStoryBySlug(slug);
  }

  @Mutation(() => StoryResponse)
  @UseGuards(AuthGuard)
  async createStory(
    @Args('input') input: StoryInput,
    @GetUser() userId: number,
  ): Promise<StoryResponse> {
    return this.storyService.createStory(input, userId);
  }

  @Mutation(() => Story, { nullable: true })
  @UseGuards(AuthGuard)
  async updateStory(
    @Args('id', { type: () => Int }) id: number,
    @Args('caption') title: string,
    @GetUser() userId: number,
  ): Promise<Story | null> {
    return this.storyService.updateStory(id, title, userId);
  }

  @Mutation(() => Boolean)
  async deleteStory(
    @Args('id', { type: () => Int }) id: number,
    @GetUser() userId: number,
  ): Promise<boolean> {
    return this.storyService.deleteStory(id, userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async likeStory(
    @Args('storyId', { type: () => Int }) storyId: number,
    @GetUser() userId: number,
  ): Promise<boolean> {
    return this.storyService.like(storyId, userId);
  }
}
