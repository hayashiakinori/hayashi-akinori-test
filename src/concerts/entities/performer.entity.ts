import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId
} from 'typeorm';
import { Concert } from './concert.entity';

@Entity({ name: 'performers' })
export class Performer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  role?: string | null;

  @Column({ type: 'integer', nullable: true })
  order?: number | null;

  @ManyToOne(() => Concert, (concert) => concert.performers, {
    onDelete: 'CASCADE'
  })
  concert: Concert;

  @RelationId((performer: Performer) => performer.concert)
  concertId: string;
}
