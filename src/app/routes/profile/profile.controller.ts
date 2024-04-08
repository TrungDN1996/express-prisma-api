import { NextFunction, Request, Response, Router } from 'express';
import { auth } from '../../core/middlewares/auth.middleware';
import { followUser, getProfile, unfollowUser } from './profile.service';

const router = Router();

/**
 * Get profile
 * @auth optional
 * @route {GET} /profiles/:username
 * @param username string
 * @returns profile
 */
router.get(
  '/userId/:userId',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await getProfile(Number(req.params.userId));
      res.json({ ...profile });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Follow user
 * @auth required
 * @route {POST} /profiles/:username/follow
 * @param username string
 * @returns profile
 */
router.post(
  '/follow',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await followUser(Number(req.body.followUserId), req.auth?.user?.id, );
      res.json({ ...profile });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Unfollow user
 * @auth required
 * @route {DELETE} /profiles/:username/follow
 * @param username string
 * @returns profiles
 */
router.delete(
  '/unfollow',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await unfollowUser(Number(req.body.unfollowUserId), req.auth?.user?.id);
      res.json({ profile });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
