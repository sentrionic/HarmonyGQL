import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import { Story } from './story.entity';

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @PrimaryColumn()
  authorId!: number;

  @Field()
  @Column()
  text!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  author!: User;

  @PrimaryColumn()
  storyId!: number;

  @ManyToOne(() => Story, (story) => story.comments, {
    onDelete: 'CASCADE',
  })
  story!: Story;
}
