import { Context, Next } from 'koa';
import { log } from '../utils/logger';
import { auth as getAuth } from 'firebase-admin';
import { decode } from 'jsonwebtoken';
import { UnauthorizedRequest } from './error-handler';

export const validateJwt = () => async (ctx: Context, next: Next) => {
  const jwt = ctx.headers.authorization?.replace('Bearer ', '') as string;

  const decoded = decode(jwt);
  log('Validating JWT.', { userId: decoded?.sub });

  try {
    const auth = getAuth();
    auth.verifyIdToken(jwt);

    ctx.state.user = {
      id: decoded?.sub,
    };
  } catch (e) {
    log((e as any).message);
    throw new UnauthorizedRequest();
  }

  log('JWT is valid.', { userId: decoded?.sub });
  await next();
};
