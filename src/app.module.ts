import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertsModule } from './concerts/concerts.module';
import { dataSourceOptions } from './database/data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), ConcertsModule]
})
export class AppModule {}
