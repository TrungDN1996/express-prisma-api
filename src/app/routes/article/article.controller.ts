import { NextFunction, Request, Response, Router } from 'express';
import { auth } from '../../core/middlewares/auth.middleware';
import {
  addComment,
  createArticle,
  deleteArticle,
  deleteComment,
  favoriteArticle,
  getArticle,
  getArticles,
  getCommentsByArticle,
  getFeed,
  unfavoriteArticle,
  updateArticle,
} from './article.service';

const router = Router();

/**
 * Get paginated articles
 * @auth optional
 * @route {GET} /articles
 * @queryparam offset number of articles dismissed from the first one
 * @queryparam limit number of articles returned
 * @queryparam tag
 * @queryparam author
 * @queryparam favorited
 * @returns articles: list of articles
 */
router.get('/', auth.optional, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getArticles(req.query, req.auth?.user?.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Get paginated feed articles
 * @auth required
 * @route {GET} /articles/feed
 * @returns articles list of articles
 */
router.get(
  '/feed',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('req', req.auth?.user?.id)
      const result = await getFeed(
        Number(req.query.offset),
        Number(req.query.limit),
        req.auth?.user?.id,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Create article
 * @route {POST} /articles
 * @bodyparam  title
 * @bodyparam  description
 * @bodyparam  body
 * @bodyparam  tagList list of tags
 * @returns article created article
 */
router.post('/', auth.required, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await createArticle(req.body.article, req.auth?.user?.id);
    res.status(201).json({ article });
  } catch (error) {
    next(error);
  }
});

/**
 * Get unique article
 * @auth optional
 * @route {GET} /article/:slug
 * @param slug slug of the article (based on the title)
 * @returns article
 */
router.get(
  '/:slug',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await getArticle(req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Update article
 * @auth required
 * @route {PUT} /articles/:slug
 * @param slug slug of the article (based on the title)
 * @bodyparam title new title
 * @bodyparam description new description
 * @bodyparam body new content
 * @returns article updated article
 */
router.put(
  '/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await updateArticle(req.body.article, req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Delete article
 * @auth required
 * @route {DELETE} /article/:id
 * @param slug slug of the article
 */
router.delete(
  '/:slug',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteArticle(req.params.slug, req.auth?.user?.id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Get comments from an article
 * @auth optional
 * @route {GET} /articles/:slug/comments
 * @param slug slug of the article (based on the title)
 * @returns comments list of comments
 */
router.get(
  '/:slug/comments',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await getCommentsByArticle(req.params.slug, req.auth?.user?.id);
      res.json({ comments });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Add comment to article
 * @auth required
 * @route {POST} /articles/:slug/comments
 * @param slug slug of the article (based on the title)
 * @bodyparam body content of the comment
 * @returns comment created comment
 */
router.post(
  '/:slug/comments',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await addComment(req.body.comment.body, req.params.slug, req.auth?.user?.id);
      res.json({ comment });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Delete comment
 * @auth required
 * @route {DELETE} /articles/:slug/comments/:id
 * @param slug slug of the article (based on the title)
 * @param id id of the comment
 */
router.delete(
  '/:slug/comments/:id',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteComment(Number(req.params.id), req.auth?.user?.id);
      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Favorite article
 * @auth required
 * @route {POST} /articles/:slug/favorite
 * @param slug slug of the article (based on the title)
 * @returns article favorited article
 */
router.post(
  '/:slug/favorite',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await favoriteArticle(req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Unfavorite article
 * @auth required
 * @route {DELETE} /articles/:slug/favorite
 * @param slug slug of the article (based on the title)
 * @returns article unfavorited article
 */
router.delete(
  '/:slug/favorite',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const article = await unfavoriteArticle(req.params.slug, req.auth?.user?.id);
      res.json({ article });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
