import { Article } from './article';
import { Comment } from './comment';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  bio: string | null;
  image: any | null;
  articles: Article[];
  favorites: Article[];
  followedBy: User[];
  following: User[];
  comments: Comment[];
}
