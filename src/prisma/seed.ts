import {
  randEmail,
  randFullName,
  randLines,
  randParagraph,
  randPassword, randPhrase,
  randWord
} from '@ngneat/falso';
import { PrismaClient } from '@prisma/client';
import { createUser } from '../app/routes/auth/auth.service';
import { addComment, createArticle } from '../app/routes/article/article.service';
import dotenv from "dotenv";
import { TokenUserDto } from '../app/routes/auth/models';

dotenv.config();

const prisma = new PrismaClient();
const URL = "http://localhost:" + (process.env.PORT || 3000);

export const generateUser = async (): Promise<TokenUserDto> =>
  createUser({
    username: randFullName(),
    email: randEmail(),
    password: randPassword(),
    image:  URL + '/images/default-avatar.jpg',
  });

export const generateArticle = async (userId: number) =>
  createArticle(
    {
      title: randPhrase(),
      description: randParagraph(),
      body: randLines({ length: 10 }).join(' '),
      tagList: randWord({ length: 4 }),
    },
    userId,
  );

export const generateComment = async (slug: string, userId: number) =>
  addComment(randParagraph(), slug, userId);

const main = async () => {
  try {
    const users = await Promise.all(Array.from({length: 12}, () => generateUser()));
    users?.map(user => user);

    // eslint-disable-next-line no-restricted-syntax
    for await (const user of users) {
      const articles = await Promise.all(Array.from({length: 12}, () => generateArticle(user.id)));

      // eslint-disable-next-line no-restricted-syntax
      for await (const article of articles) {
        await Promise.all(users.map(userItem => generateComment(article.slug, userItem.id)));
      }
    }
  } catch (e) {
    console.error(e);

  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
