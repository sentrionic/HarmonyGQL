import DataLoader from 'dataloader';
import { Like } from '../entities/like.entity';

// [{postId: 5, userId: 10}]
// [{postId: 5, userId: 10, value: 1}]
export const createLikeLoader = () =>
  new DataLoader<{ storyId: number; userId: number }, Like | null>(
    async (keys) => {
      const likes = await Like.findByIds(keys as any);
      const likeIdsToLikes: Record<string, Like> = {};
      likes.forEach((like) => {
        likeIdsToLikes[`${like.userId}|${like.storyId}`] = like;
      });

      return keys.map((key) => likeIdsToLikes[`${key.userId}|${key.storyId}`]);
    },
  );
