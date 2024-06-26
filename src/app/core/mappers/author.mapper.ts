import { User } from '../../types/index';

export const authorMapper = (author: any, id?: number) => ({
  username: author.username,
  bio: author.bio,
  image: author.image,
  following: id
    ? author?.followedBy.some((followingUser: Partial<User>) => followingUser.id === id)
    : false,
});