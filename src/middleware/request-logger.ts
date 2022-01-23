import { Context, Next } from 'koa';
import { logger } from '../utilities/logger';

export const requestLogger = () => async (ctx: Context, next: Next) => {
  const start = Date.now();
  try {
    logger.info(`Request Start - ${ctx.method} ${ctx.url}`);
    await next();
  } finally {
    const ms = Date.now() - start;
    logger.info(`Request End - ${ctx.method} ${ctx.url} - Duration: ${ms}ms`);
  }
};
