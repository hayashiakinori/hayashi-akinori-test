import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Concert } from './concert.entity';

export enum AttachmentType {
  LINK = 'link',
  DOCUMENT = 'document',
  OTHER = 'other'
}

@Entity({ name: 'attachments' })
export class Attachment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'concert_id' })
  concertId!: number;

  @Column({ type: 'text' })
  label!: string;

  @Column({ type: 'text' })
  url!: string;

  @Column({ type: 'enum', enum: AttachmentType, default: AttachmentType.LINK })
  type!: AttachmentType;

  @Column({ type: 'integer', name: 'order', nullable: true })
  order?: number;

  @ManyToOne(() => Concert, (concert) => concert.attachments, { onDelete: 'CASCADE' })
  concert!: Concert;
}
