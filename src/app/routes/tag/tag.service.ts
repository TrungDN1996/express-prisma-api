import prisma from '../../../prisma/prisma-client';
import { Tag } from '../../types/index';

export const getTags = async (userId: number): Promise<string[]> => {
  const queries: any[] = [];

  if (userId) {
    queries.push({
      id: {
        equals: userId,
      },
    });
  }

  const tags = await prisma.tag.findMany({
    where: {
      articles: {
        some: {
          author: {
            OR: queries,
          },
        },
      },
    },
    select: {
      name: true,
    },
    orderBy: {
      articles: {
        _count: 'desc',
      },
    },
    take: 10,
  });

  return tags.map((tag: Tag) => tag.name);
};