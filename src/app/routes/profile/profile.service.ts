import prisma from '../../../prisma/prisma-client';
import { profileMapper } from '../../core/mappers/index';
import HttpException from '../../core/base/http-exception';
import { Profile } from '../../types';

export const getProfile = async (userId: number): Promise<Profile> => {
  const profile = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      followedBy: true,
    },
  });

  if (!profile) {
    throw new HttpException(404, {});
  }

  return profileMapper(profile, userId);
};

export const followUser = async (followUserId: number, userId?: number): Promise<Profile> => {
  const profile = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      followedBy: {
        connect: {
          id: followUserId,
        },
      },
    },
    include: {
      followedBy: true,
    },
  });

  return profileMapper(profile, userId);
};

export const unfollowUser = async (unfollowUserId: number, userId?: number): Promise<Profile> => {
  const profile = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      followedBy: {
        disconnect: {
          id: unfollowUserId,
        },
      },
    },
    include: {
      followedBy: true,
    },
  });

  return profileMapper(profile, userId);
};
