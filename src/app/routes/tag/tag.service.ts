import prisma from '../../../prisma/prisma-client';
import { Tag } from '../../models/index';

const getTags = async (id?: number): Promise<string[]> => {
  const queries: any[] = [];

  if (id) {
    queries.push({
      id: {
        equals: id,
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

export default getTags;
