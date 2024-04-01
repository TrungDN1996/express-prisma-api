import * as jwt from 'jsonwebtoken';

export const generateToken = (id: number): string =>
  jwt.sign({ user: { id } }, process.env.JWT_SECRET || 'superSecret', {
    expiresIn: '3600s',
  });