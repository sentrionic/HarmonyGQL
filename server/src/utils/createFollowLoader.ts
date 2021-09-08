import DataLoader from 'dataloader';
import { Follower } from '../entities/follower.entity';

// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value: 1}]
export const createFollowLoader = () =>
  new DataLoader<{ followingId: number; followerId: number }, Follower | null>(
    async (keys) => {
      const followers = await Follower.findByIds(keys as any);
      const followerIdsToFollowers: Record<string, Follower> = {};
      followers.forEach((follow) => {
        followerIdsToFollowers[
          `${follow.followingId}|${follow.followerId}`
        ] = follow;
      });

      return keys.map(
        (key) => followerIdsToFollowers[`${key.followingId}|${key.followerId}`],
      );
    },
  );
