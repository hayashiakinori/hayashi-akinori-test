import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Attachment } from './attachment.entity';
import { ConcertStatus } from './concert-status.enum';
import { Performer } from './performer.entity';

@Entity({ name: 'concerts' })
export class Concert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'date', nullable: true })
  date?: string | null;

  @Column({ type: 'time without time zone', nullable: true })
  time?: string | null;

  @Column({ type: 'text', nullable: true })
  location?: string | null;

  @Column({ type: 'text', nullable: true })
  repertoire?: string | null;

  @Column({ type: 'text', nullable: true })
  conductor?: string | null;

  @Column({ type: 'text', nullable: true })
  ensemble?: string | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @Column({ type: 'text', nullable: true })
  ticketUrl?: string | null;

  @Column({ type: 'enum', enum: ConcertStatus, enumName: 'concert_status' })
  status: ConcertStatus;

  @OneToMany(() => Performer, (performer) => performer.concert, {
    cascade: true,
    eager: false
  })
  performers?: Performer[];

  @OneToMany(() => Attachment, (attachment) => attachment.concert, {
    cascade: true,
    eager: false
  })
  attachments?: Attachment[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
