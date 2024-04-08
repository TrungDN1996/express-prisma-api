import * as jwt from 'jsonwebtoken';

export const generateToken = (userId: number): string =>
  jwt.sign({ sub: userId }, (process.env.JWT_SECRET || 'superSecret') as jwt.Secret, {
    expiresIn: '3600s',
  });