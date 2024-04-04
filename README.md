## Description

It is a demo app on Express-JS and PostgreSQL(Prisma). You can:
1. Login, Register.
2. User follow another users.
3. CRUD Article, Tag.

See OpenAPI(Swagger) http://localhost:3000/api/#/

## Getting Started

### Prerequisites

Run the following command to install dependencies:

```shell
npm install
```

### Run with docker

Run the following command to build PostgreSQL instance:

```shell
docker-compose up -d postgres
```

### Environment variables

This project depends on some environment variables.
If you are running this project locally, create a `.env` file at the root for these variables.
Your host provider should included a feature to set them there directly to avoid exposing them.

Here are the required ones:

```
PORT=
DATABASE_URL=
JWT_SECRET=
NODE_ENV=production
```

### Apply any SQL migration script

Run the following command to create/update your database based on existing sql migration scripts:

```shell
npm run update-database
```

### Seed the database

The project includes a seed script to populate the database:

```shell
npm run seed-db
```

### Run the project

Run the following command to run the project:

```shell
npm run build
npm run start
```

## Stay in touch

- Email - nguyentrung96dn@gmail.com
- Linkedin - [linkedin.com](https://www.linkedin.com/in/trungnguyen-be/)
