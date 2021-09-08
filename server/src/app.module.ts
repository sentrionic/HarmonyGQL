import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoryModule } from './story/story.module';
import { typeOrmConfig } from './config/typeOrmConfig';
import { UserModule } from './user/user.module';
import { MyContext } from './types/MyContext';
import { createUserLoader } from './utils/createUserLoader';
import { createLikeLoader } from './utils/createLikeLoader';
import { CommentModule } from './comment/comment.module';
import { createFollowLoader } from './utils/createFollowLoader';
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      cors: {
        credentials: true,
        origin: process.env.CORS_ORIGIN,
      },
      context: ({ req, res }): MyContext => ({
        req,
        res,
        userLoader: createUserLoader(),
        likeLoader: createLikeLoader(),
        followLoader: createFollowLoader(),
      }),
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    }),
    StoryModule,
    UserModule,
    CommentModule,
  ],
})
export class AppModule {
  constructor(private connection: Connection) {}

  async migrations() {
    //await this.connection.runMigrations();
  }
}
