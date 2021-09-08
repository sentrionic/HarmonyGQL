import { Request } from 'express';
import { createUserLoader } from '../utils/createUserLoader';
import { createLikeLoader } from '../utils/createLikeLoader';
import { createFollowLoader } from '../utils/createFollowLoader';

export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  likeLoader: ReturnType<typeof createLikeLoader>;
  followLoader: ReturnType<typeof createFollowLoader>;
};
