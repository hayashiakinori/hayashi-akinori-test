import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId
} from 'typeorm';
import { Concert } from './concert.entity';

export enum AttachmentType {
  Link = 'link',
  File = 'file',
  Other = 'other'
}

@Entity({ name: 'attachments' })
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  label: string;

  @Column({ type: 'text' })
  url: string;

  @Column({ type: 'enum', enum: AttachmentType, enumName: 'attachment_type' })
  type: AttachmentType;

  @Column({ type: 'integer', nullable: true })
  order?: number | null;

  @ManyToOne(() => Concert, (concert) => concert.attachments, {
    onDelete: 'CASCADE'
  })
  concert: Concert;

  @RelationId((attachment: Attachment) => attachment.concert)
  concertId: string;
}
