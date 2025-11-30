import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertsModule } from './concerts/concerts.module';
import { Attachment } from './concerts/entities/attachment.entity';
import { Concert } from './concerts/entities/concert.entity';
import { Performer } from './concerts/entities/performer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const type = (configService.get('DB_TYPE') || 'postgres') as
          | 'postgres'
          | 'sqlite';
        const isSQLite = type === 'sqlite';
        const url = configService.get<string>('DATABASE_URL');
        return {
          type,
          url: isSQLite ? undefined : url,
          database: isSQLite ? configService.get('SQLITE_PATH') || 'concerts.sqlite' : undefined,
          entities: [Concert, Performer, Attachment],
          synchronize: false,
          migrationsRun: false,
          logging: false
        };
      },
      inject: [ConfigService]
    }),
    ConcertsModule
  ]
})
export class AppModule {}
