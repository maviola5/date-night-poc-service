import './environment';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { requestLogger } from './middleware/request-logger';
import showsRouter from './routes/show-routes';
import { errorHandler } from './middleware/error-handler';
import { validateJwt } from './middleware/validate-jwt';

const app = new Koa();

app.use(requestLogger());
app.use(errorHandler());
app.use(validateJwt());
app.use(bodyParser());

app.use(showsRouter.routes());
app.use(showsRouter.allowedMethods());

app.listen(process.env.PORT || 8080);
