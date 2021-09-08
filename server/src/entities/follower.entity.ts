import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follower extends BaseEntity {
  @PrimaryColumn()
  followerId!: number;

  @ManyToOne(() => User, (user) => user.followerRelation, {
    onDelete: 'CASCADE',
  })
  follower!: User;

  @PrimaryColumn()
  followingId!: number;

  @ManyToOne(() => User, (user) => user.followingRelation, {
    onDelete: 'CASCADE',
  })
  following!: User;
}
