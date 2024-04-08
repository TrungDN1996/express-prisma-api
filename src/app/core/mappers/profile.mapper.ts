import { User, Profile } from '../../types/index';

export const profileMapper = (user: any, id: number | undefined): Profile => ({
  username: user.username,
  bio: user.bio,
  image: user.image,
  following: id
    ? user?.followedBy.some((followingUser: Partial<User>) => followingUser.id === id)
    : false,
});