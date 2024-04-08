import { NextFunction, Request, Response, Router } from 'express';
import { auth } from '../../core/middlewares/auth.middleware';
import { getTags } from './tag.service';

const router = Router();

/**
 * Get top 10 popular tags
 * @auth optional
 * @route {GET} /api/tags
 * @returns tags list of tag names
 */
router.get('/userId/:userId', auth.optional, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await getTags(Number(req.params.userId));
    res.json({ ...tags });
  } catch (error) {
    next(error);
  }
});

export default router;
