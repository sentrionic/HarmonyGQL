import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Story } from '../entities/story.entity';
import { getConnection, Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { serializeValidationError } from '../utils/serializeValidationError';
import { CommentSchema } from '../schemas/comment.schema';
import { CommentResponse, PaginatedComments } from './comment.input';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async getStoryComments(
    storyId: number,
    limit: number,
    cursor: string | null,
  ): Promise<PaginatedComments> {
    const realLimit = Math.min(15, limit);
    const realLimitPlusOne = realLimit + 1;
    const replacements: any[] = [storyId, realLimitPlusOne];

    if (cursor) {
      replacements.push(new Date(parseInt(cursor) + 1));
    }

    const comments: Comment[] = await getConnection().query(
      `
      select c.*
      from comment c
      where c."storyId" = $1
      ${cursor ? `and c."createdAt" > $3` : ''}
      order by c."createdAt" ASC
      limit $2
    `,
      replacements,
    );

    return {
      comments: comments.slice(0, realLimit),
      hasMore: comments.length === realLimitPlusOne,
    };
  }

  async postComment(
    storyId: number,
    text: string,
    userId: number,
  ): Promise<CommentResponse> {
    const input = {
      storyId,
      text,
      userId,
    };

    try {
      await CommentSchema.validate(input, { abortEarly: false });
    } catch (err) {
      return {
        errors: serializeValidationError(err),
      };
    }

    const comment = await this.commentRepository
      .create({
        text,
        storyId,
        authorId: userId,
      })
      .save();

    const story = await Story.findOne({ id: storyId });
    if (story) {
      story.commentsCount = story.commentsCount + 1;
      await story.save();
    }

    return { comment };
  }
}
