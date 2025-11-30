import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Attachment } from './attachment.entity';
import { Performer } from './performer.entity';

export enum ConcertStatus {
  PLANNED = '予定',
  CONFIRMED = '確定',
  FINISHED = '終了'
}

@Entity({ name: 'concerts' })
export class Concert {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  title!: string;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({ type: 'time', nullable: true })
  time?: string;

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  repertoire?: string;

  @Column({ type: 'text', nullable: true })
  conductor?: string;

  @Column({ type: 'text', nullable: true })
  ensemble?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  ticketUrl?: string;

  @Column({ type: 'enum', enum: ConcertStatus, default: ConcertStatus.PLANNED })
  status!: ConcertStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => Performer, (performer) => performer.concert, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete'
  })
  performers?: Performer[];

  @OneToMany(() => Attachment, (attachment) => attachment.concert, {
    cascade: true,
    eager: true,
    orphanedRowAction: 'delete'
  })
  attachments?: Attachment[];
}
