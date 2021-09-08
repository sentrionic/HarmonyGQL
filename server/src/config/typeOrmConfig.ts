import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv-safe/config';
import { __prod__ } from './constants';

export const typeOrmConfig: TypeOrmModuleOptions = {
  name: 'default',
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: true,
  synchronize: !__prod__,
  dropSchema: false,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true,
};
