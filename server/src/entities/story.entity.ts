import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import shortid from 'shortid';
import { Like } from './like.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';

@ObjectType()
@Entity()
export class Story extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt!: Date;

  @Field()
  @Column({ unique: true })
  slug!: string;

  @Field()
  @Column()
  image!: string;

  @Field()
  @Column()
  caption!: string;

  @Field()
  @Column({ type: 'int', default: 0 })
  likes!: number;

  @Field(() => [String])
  @Column('text', { array: true, default: '{}' })
  tags!: string[];

  @Field()
  @Column({ type: 'int', default: 0 })
  commentsCount!: number;

  @Field()
  @Column()
  authorId!: number;

  @Field(() => Boolean, { defaultValue: false })
  liked!: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.stories, { onDelete: 'CASCADE' })
  author!: User;

  @ManyToOne(() => Comment, (comment) => comment.story, { onDelete: 'CASCADE' })
  comments!: Comment[];

  @OneToMany(() => Like, (like) => like.story)
  userLikes!: Like[];

  @BeforeInsert()
  generateSlug(): void {
    this.slug = shortid.generate();
  }

  @BeforeInsert()
  generateTags(): void {
    this.tags = this.caption.split(' ').filter((word) => word.includes('#'));
  }
}
