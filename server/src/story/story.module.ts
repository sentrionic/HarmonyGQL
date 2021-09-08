import { Module } from '@nestjs/common';
import { StoryResolver } from './story.resolver';
import { StoryService } from './story.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Story } from '../entities/story.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Story]), UserModule],
  providers: [StoryResolver, StoryService],
})
export class StoryModule {}
