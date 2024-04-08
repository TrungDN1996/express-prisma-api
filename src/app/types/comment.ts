import { Article } from './article';

export interface Comment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  article?: Article;
}
