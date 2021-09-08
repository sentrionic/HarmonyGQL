import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '../entities/story.entity';
import { Comment } from '../entities/comment.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Story, Comment]), UserModule],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
