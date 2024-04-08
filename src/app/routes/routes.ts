import { Router } from 'express';
import tagsController from './tag/tag.controller';
import articlesController from './article/article.controller';
import profileController from './profile/profile.controller';
import authController from './auth/auth.controller';

const api = Router()
  .use('/tags', tagsController)
  .use('/articles', articlesController)
  .use('/profiles', profileController)
  .use('/users', authController);

export default Router().use('/api', api);