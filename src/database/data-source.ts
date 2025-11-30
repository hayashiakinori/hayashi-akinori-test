import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Attachment } from '../concerts/entities/attachment.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { Performer } from '../concerts/entities/performer.entity';

const dbType = (process.env.DB_TYPE || 'postgres') as DataSourceOptions['type'];

const commonOptions: Partial<DataSourceOptions> = {
  entities: [Concert, Performer, Attachment],
  migrations: ['dist/database/migrations/*.js', 'src/database/migrations/*.ts'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true'
};

const postgresOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...commonOptions
};

const sqliteOptions: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.DB_NAME || process.env.DB_PATH || 'data/dev.db',
  ...commonOptions
};

export const dataSourceOptions: DataSourceOptions =
  dbType === 'sqlite' ? sqliteOptions : postgresOptions;

export const AppDataSource = new DataSource(dataSourceOptions);
