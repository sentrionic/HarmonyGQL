import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import RateLimitRedisStore from 'rate-limit-redis';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { __prod__, COOKIE_NAME } from './config/constants';
import { redis } from './config/redis';
import 'dotenv-safe/config';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const RedisStore = connectRedis(session);
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    rateLimit({
      store: new RateLimitRedisStore({
        client: redis,
      }),
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: 'lax', // csrf
        secure: __prod__, // cookie only works in https,
        domain: __prod__ ? '.harmonyapp.xyz' : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    }),
  );

  await app.listen(parseInt(process.env.PORT));
}

bootstrap();
