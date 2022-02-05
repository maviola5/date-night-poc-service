import { Context, Next } from 'koa';
import { log } from '../utils/logger';

export const errorHandler = () => async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    log('There was an error', { error: err });
    ctx.status = (err as any).status || 500;
    ctx.body =
      (err as any).status !== 500
        ? (err as any).message
        : 'Internal Server Error';
  }
};

export class NotFound extends Error {
  constructor(public message = 'Not Found', public status = 404) {
    super();
  }
}

export class BadRequest extends Error {
  constructor(public message = 'Bad Request', public status = 400) {
    super();
  }
}

export class UnauthorizedRequest extends Error {
  constructor(public message = 'Unauthorized', public status = 401) {
    super();
  }
}
