import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';
import { Concert } from './entities/concert.entity';
import { Performer } from './entities/performer.entity';
import { Attachment } from './entities/attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Performer, Attachment])],
  controllers: [ConcertsController],
  providers: [ConcertsService]
})
export class ConcertsModule {}
