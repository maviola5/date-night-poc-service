import { Context, Next } from 'koa';
import { log } from '../utils/logger';

export const requestLogger = () => async (ctx: Context, next: Next) => {
  const start = Date.now();
  const { method, url } = ctx;
  try {
    log(`Request Start - ${method} ${url}`, { method, url });
    await next();
  } finally {
    const ms = Date.now() - start;
    log(`Request End - ${method} ${url} - Duration: ${ms}ms`, {
      method,
      url,
      duration: ms,
    });
  }
};
