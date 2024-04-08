import * as jwt from 'jsonwebtoken';
import * as express from 'express';

export const isRequiredAuth = (req: express.Request, res:express.Response, next:express.NextFunction) => {
  const sec = process.env.JWT_SECRET || 'superSecret' as jwt.Secret;
  const authHeader = req.headers.authorization;

  if(authHeader){
      const token = (authHeader as string).split(' ')[1];
      jwt.verify(token, sec, async (err, payload)=>{
          if(err){
            res.status(403).json('Token not valid');
          }
          const payloadId = payload?.sub as string;
          if(!payload || !payloadId) return res.status(400).json({error:"Not authorized"})
          req.auth = { 
            user: {
              id: Number(payloadId)
            }
          };
          next();
      })
  } else{
      return res.status(401).json('Not authorized');
  }
};

export const isOptionalAuth = (req: express.Request, res:express.Response, next:express.NextFunction) => {
  const sec = process.env.JWT_SECRET || 'superSecret' as jwt.Secret;
  const authHeader = req.headers.authorization;

  if(authHeader){
      const token = (authHeader as string).split(' ')[1];
      jwt.verify(token, sec, async (err, payload)=>{
        const payloadId = payload?.sub as string;
        if (payload && payloadId)
          req.auth = { 
            user: {
              id: Number(payloadId)
            }
          };
      })
  }

  next();
};

export const auth = {
  required: isRequiredAuth,
  optional: isOptionalAuth,
};