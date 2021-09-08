import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Story } from './story.entity';

@Entity()
export class Like extends BaseEntity {
  @PrimaryColumn()
  userId!: number;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @PrimaryColumn()
  storyId!: number;

  @ManyToOne(() => Story, (story) => story.userLikes, {
    onDelete: 'CASCADE',
  })
  story!: Story;
}
