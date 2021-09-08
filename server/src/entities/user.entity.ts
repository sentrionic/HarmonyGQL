import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Story } from './story.entity';
import { Like } from './like.entity';
import { Follower } from './follower.entity';
import { Comment } from './comment.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ nullable: true })
  image!: string;

  @Field()
  @Column()
  displayName!: string;

  @Field()
  @Column({ default: '' })
  description!: string;

  @Field()
  @Column({ default: '' })
  website!: string;

  @Column()
  password!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field()
  @Column({ default: 0 })
  followers!: number;

  @Field()
  @Column({ default: 0 })
  following!: number;

  @Field()
  @Column({ default: 0 })
  posts!: number;

  @OneToMany(() => Story, (story) => story.author)
  stories!: Story[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments!: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes!: Like[];

  @OneToMany(() => Follower, (follower) => follower.following)
  followingRelation!: Follower[];

  @OneToMany(() => Follower, (follower) => follower.follower)
  followerRelation!: Follower[];
}
