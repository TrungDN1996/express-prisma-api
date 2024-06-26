import express, { Express } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import routes from './app/routes/routes';
import HttpException from './app/core/base/http-exception';
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from './swagger/routes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

/**
 * App Configuration
 */

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.json({ status: 'API is running on /api' });
});

/* eslint-disable */
app.use(
  (
    err: Error | HttpException,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err);
    // @ts-ignore
    if (err && err.name === 'UnauthorizedError') {
      return res.status(401).json({
        status: 'error',
        message: 'missing authorization credentials',
      });
      // @ts-ignore
    } else if (err && err.errorCode) {
      // @ts-ignore
      res.status(err.errorCode).json(err.message);
    } else if (err) {
      res.status(500).json(err.message);
    }
  },
);

/**
 * Server activation
 */

app.listen(PORT, () => {
  console.info(`server up on port ${PORT}`);
});

/**
 * Swagger avtivation
 */

const options = {
  swaggerOptions: {
  },
};
app.use('/docs', swaggerUi.serve, async (_req: express.Request, res: express.Response) => {
  return res.send(swaggerUi.generateHTML(await import('./swagger/swagger.json'), options));
});
RegisterRoutes(app);
