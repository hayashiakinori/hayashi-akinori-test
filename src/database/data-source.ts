import 'reflect-metadata';
import { ConfigModule } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Attachment } from '../concerts/entities/attachment.entity';
import { Concert } from '../concerts/entities/concert.entity';
import { Performer } from '../concerts/entities/performer.entity';
import { CreateConcertSchema1712131200000 } from './migrations/1712131200000-CreateConcertSchema';

ConfigModule.forRoot();

const type = (process.env.DB_TYPE || 'postgres') as 'postgres' | 'sqlite';

const options: DataSourceOptions = {
  type,
  url: type === 'postgres' ? process.env.DATABASE_URL : undefined,
  database: type === 'sqlite' ? process.env.SQLITE_PATH || 'concerts.sqlite' : undefined,
  entities: [Concert, Performer, Attachment],
  migrations: [CreateConcertSchema1712131200000],
  synchronize: false,
  logging: false
};

export const dataSource = new DataSource(options);

export default options;
