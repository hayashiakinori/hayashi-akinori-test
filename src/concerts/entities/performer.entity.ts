import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Concert } from './concert.entity';

@Entity({ name: 'performers' })
export class Performer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'concert_id' })
  concertId!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  role?: string;

  @Column({ type: 'integer', name: 'order', nullable: true })
  order?: number;

  @ManyToOne(() => Concert, (concert) => concert.performers, { onDelete: 'CASCADE' })
  concert!: Concert;
}
