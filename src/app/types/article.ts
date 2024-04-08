import { Comment } from './comment';

export interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  comments: Comment[];
  favorited: boolean;
}
