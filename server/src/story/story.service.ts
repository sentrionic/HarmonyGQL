import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from '../entities/story.entity';
import { getConnection, Repository } from 'typeorm';
import { PaginatedStories, StoryInput, StoryResponse } from './story.input';
import { Like } from '../entities/like.entity';
import { uploadStoryToS3 } from '../utils/fileUtils';
import { serializeValidationError } from '../utils/serializeValidationError';
import { StorySchema } from '../schemas/story.schema';
import { User } from '../entities/user.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
  ) {}

  async findAll(
    limit: number,
    cursor: string | null,
  ): Promise<PaginatedStories> {
    const realLimit = Math.min(15, limit);
    const realLimitPlusOne = realLimit + 1;
    const replacements: any[] = [realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const stories = await getConnection().query(
      `
          select p.*
          from story p
              ${cursor ? `where p."createdAt" < $2` : ''}
          order by p."createdAt" DESC
              limit $1
      `,
      replacements,
    );

    return {
      stories: stories.slice(0, realLimit),
      hasMore: stories.length === realLimitPlusOne,
    };
  }

  async getLikedStories(
    limit: number,
    cursor: string | null,
    user: number,
  ): Promise<PaginatedStories> {
    const realLimit = Math.min(15, limit);
    const realLimitPlusOne = realLimit + 1;
    const replacements: any[] = [realLimitPlusOne, user];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const stories = await getConnection().query(
      `
          select p.*
          from story p
                   join "like" l on p.id = l."storyId"
          where l."userId" = $2
              ${cursor ? ` and p."createdAt" < $3` : ''}
          order by p."createdAt" DESC
              limit $1
      `,
      replacements,
    );

    return {
      stories: stories.slice(0, realLimit),
      hasMore: stories.length === realLimitPlusOne,
    };
  }

  async getFollowedStories(
    limit: number,
    cursor: string | null,
    user: number,
  ): Promise<PaginatedStories> {
    const realLimit = Math.min(15, limit);
    const realLimitPlusOne = realLimit + 1;
    const replacements: any[] = [realLimitPlusOne, user];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const stories = await getConnection().query(
      `
          select p.*
          from story p
                   join "user" u on p."authorId" = u.id
                   join follower f on f."followingId" = u.id
          where f."followerId" = $2
              ${cursor ? ` and p."createdAt" < $3` : ''}
          order by p."createdAt" DESC
              limit $1
      `,
      replacements,
    );

    return {
      stories: stories.slice(0, realLimit),
      hasMore: stories.length === realLimitPlusOne,
    };
  }

  async getProfileStories(
    limit: number,
    cursor: string | null,
    profileId: number,
  ): Promise<PaginatedStories> {
    const realLimit = Math.min(15, limit);
    const realLimitPlusOne = realLimit + 1;
    const replacements: any[] = [realLimitPlusOne, profileId];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor)));
    }

    const stories = await getConnection().query(
      `
          select p.*
          from story p
          where p."authorId" = $2
              ${cursor ? ` and p."createdAt" < $3` : ''}
          order by p."createdAt" DESC
              limit $1
      `,
      replacements,
    );

    return {
      stories: stories.slice(0, realLimit),
      hasMore: stories.length === realLimitPlusOne,
    };
  }

  async getStoryById(id: number): Promise<Story | undefined> {
    return await this.storyRepository.findOne(id, { relations: ['author'] });
  }

  async getStoryBySlug(slug: string): Promise<Story | undefined> {
    return await this.storyRepository.findOne({
      where: { slug },
      relations: ['author'],
    });
  }

  async createStory(input: StoryInput, userId: number): Promise<StoryResponse> {
    try {
      await StorySchema.validate(input, { abortEarly: false });
    } catch (err) {
      return {
        errors: serializeValidationError(err),
      };
    }

    const { caption, image } = input;
    const directory = `users/${userId}`;
    const url = await uploadStoryToS3(image, directory);

    const story = await this.storyRepository
      .create({
        caption,
        image: url,
        authorId: userId,
      })
      .save();

    const user = await User.findOne({ id: userId });
    if (user) {
      user.posts = user.posts + 1;
      await user.save();
    }

    return { story };
  }

  async updateStory(
    id: number,
    caption: string,
    userId: number,
  ): Promise<Story | null> {
    const result = await getConnection()
      .createQueryBuilder()
      .update(Story)
      .set({ caption })
      .where('id = :id and "authorId" = :authorId', {
        id,
        authorId: userId,
      })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  async deleteStory(id: number, userId: number): Promise<boolean> {
    const { affected } = await this.storyRepository.delete({
      id,
      authorId: userId,
    });
    if (affected) {
      const user = await User.findOne({ id: userId });
      if (user) {
        user.posts = user.posts - 1;
        await user.save();
      }
    }
    return true;
  }

  async like(storyId: number, userId: number): Promise<boolean> {
    const like = await Like.findOne({ where: { storyId, userId } });

    if (like) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
              delete
              from "like"
              where "userId" = $1
                and "storyId" = $2
          `,
          [userId, storyId],
        );

        await tm.query(
          `
              update story
              set likes = likes - 1
              where id = $1
          `,
          [storyId],
        );
      });
    } else {
      // has never voted before
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
              insert into "like" ("userId", "storyId")
              values ($1, $2)
          `,
          [userId, storyId],
        );

        await tm.query(
          `
              update story
              set likes = likes + 1
              where id = $1
          `,
          [storyId],
        );
      });
    }
    return true;
  }
}
