import {
  randEmail,
  randFullName,
  randLines,
  randParagraph,
  randPassword, randPhrase,
  randWord, 
  randSlug
} from '@ngneat/falso';
import { PrismaClient } from '@prisma/client';
import { RegisteredUser } from '../app/models/index';
import { createUser } from '../app/routes/auth/auth.service';
import { addComment, createArticle } from '../app/routes/article/article.service';
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const URL = "http://localhost:" + (process.env.PORT || 3000);

export const generateUser = async (): Promise<RegisteredUser> =>
  createUser({
    username: randFullName(),
    email: randEmail(),
    password: randPassword(),
    image:  URL + '/images/default-avatar.jpg',
  });

export const generateArticle = async (id: number) =>
  createArticle(
    {
      slug: randSlug(),
      title: randPhrase(),
      description: randParagraph(),
      body: randLines({ length: 10 }).join(' '),
      tagList: randWord({ length: 4 }),
    },
    id,
  );

export const generateComment = async (id: number, slug: string) =>
  addComment(randParagraph(), slug, id);

const main = async () => {
  try {
    const users = await Promise.all(Array.from({length: 12}, () => generateUser()));
    users?.map(user => user);

    // eslint-disable-next-line no-restricted-syntax
    for await (const user of users) {
      const articles = await Promise.all(Array.from({length: 12}, () => generateArticle(user.id)));

      // eslint-disable-next-line no-restricted-syntax
      for await (const article of articles) {
        await Promise.all(users.map(userItem => generateComment(userItem.id, article.slug)));
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
