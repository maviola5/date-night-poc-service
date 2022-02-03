import { Context, Next } from 'koa';
import { logger } from '../utils/logger';
import { auth as getAuth } from 'firebase-admin';
import { decode } from 'jsonwebtoken';
import { UnauthorizedRequest } from './error-handler';

export const validateJwt = () => async (ctx: Context, next: Next) => {
  const jwt = ctx.headers.authorization?.replace('Bearer ', '') as string;

  const decoded = decode(jwt);
  logger.info({
    message: 'Validating JWT.',
    metadata: {
      userId: decoded?.sub,
    },
  });

  try {
    const auth = getAuth();
    auth.verifyIdToken(jwt);

    ctx.state.user = {
      id: decoded?.sub,
    };
  } catch (e) {
    logger.info({
      message: (e as any).message,
    });
    throw new UnauthorizedRequest();
  }

  logger.info({
    message: 'JWT is valid.',
    metadata: {
      userId: decoded?.sub,
    },
  });

  await next();
};
