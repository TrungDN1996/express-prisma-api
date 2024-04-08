import { NextFunction, Request, Response, Router } from 'express';
import { auth } from '../../core/middlewares/auth.middleware';
import { createUser, getCurrentUser, login, updateUser } from './auth.service';

const router = Router();

/**
 * Create an user
 * @auth none
 * @route {POST} /users
 * @bodyparam user User
 * @returns user User
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUser({ ...req.body });
    res.status(201).json({ ...user });
  } catch (error) {
    next(error);
  }
});

/**
 * Update user
 * @auth required
 * @route {PUT} /user
 * @bodyparam user User
 * @returns user User
 */
router.put('/:id', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUser(Number(req.params.id), req.body);
    res.json({ ...user });
  } catch (error) {
    next(error);
  }
});

/**
 * Login
 * @auth none
 * @route {POST} /users/login
 * @bodyparam user User
 * @returns user User
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await login(req.body);
    res.json({ ...user });
  } catch (error) {
    next(error);
  }
});

/**
 * Get current user
 * @auth required
 * @route {GET} /user
 * @returns user User
 */
router.get('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getCurrentUser(Number(req.auth?.user?.id));
    res.json({ ...user });
  } catch (error) {
    next(error);
  }
});

export default router;
