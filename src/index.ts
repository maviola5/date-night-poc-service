import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { requestLogger } from './middleware/request-logger';
import trendingRouter from './routes/trending';
import moviesRouter from './routes/movies';
import showsRouter from './routes/shows';
import { errorHandler } from './middleware/error-handler';

const app = new Koa();

app.use(requestLogger());
app.use(bodyParser());
app.use(errorHandler());
app.use(trendingRouter.routes());
app.use(trendingRouter.allowedMethods());
app.use(moviesRouter.routes());
app.use(moviesRouter.allowedMethods());
app.use(showsRouter.routes());
app.use(showsRouter.allowedMethods());

app.listen(process.env.PORT || 8080);
