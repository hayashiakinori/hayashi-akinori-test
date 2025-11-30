import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { Attachment, AttachmentType } from './entities/attachment.entity';
import { Concert } from './entities/concert.entity';
import { ConcertStatus } from './entities/concert-status.enum';
import { Performer } from './entities/performer.entity';

interface ConcertFilters {
  status?: ConcertStatus;
  dateFrom?: string;
  dateTo?: string;
}

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert) private readonly concertsRepo: Repository<Concert>,
    @InjectRepository(Performer) private readonly performersRepo: Repository<Performer>,
    @InjectRepository(Attachment) private readonly attachmentsRepo: Repository<Attachment>
  ) {}

  async create(dto: CreateConcertDto): Promise<Concert> {
    const concert = this.concertsRepo.create({
      ...dto,
      performers: this.mapPerformers(dto.performers),
      attachments: this.mapAttachments(dto.attachments)
    });
    return this.concertsRepo.save(concert);
  }

  async findAll(filters: ConcertFilters = {}): Promise<Concert[]> {
    const query = this.concertsRepo
      .createQueryBuilder('concert')
      .leftJoinAndSelect('concert.performers', 'performer')
      .leftJoinAndSelect('concert.attachments', 'attachment')
      .orderBy('concert.date', 'ASC', 'NULLS LAST');

    if (filters.dateFrom) {
      query.andWhere('concert.date >= :dateFrom', { dateFrom: filters.dateFrom });
    }
    if (filters.dateTo) {
      query.andWhere('concert.date <= :dateTo', { dateTo: filters.dateTo });
    }
    if (filters.status) {
      query.andWhere('concert.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Concert> {
    const concert = await this.concertsRepo.findOne({
      where: { id },
      relations: ['performers', 'attachments']
    });
    if (!concert) {
      throw new NotFoundException(`Concert ${id} not found`);
    }
    return concert;
  }

  async update(id: string, dto: UpdateConcertDto): Promise<Concert> {
    const concert = await this.concertsRepo.findOne({
      where: { id },
      relations: ['performers', 'attachments']
    });
    if (!concert) {
      throw new NotFoundException(`Concert ${id} not found`);
    }
    Object.assign(concert, dto);

    if (dto.performers) {
      concert.performers = this.mapPerformers(dto.performers);
    }
    if (dto.attachments) {
      concert.attachments = this.mapAttachments(dto.attachments);
    }

    return this.concertsRepo.save(concert);
  }

  async remove(id: string): Promise<void> {
    const concert = await this.concertsRepo.findOne({ where: { id } });
    if (!concert) {
      throw new NotFoundException(`Concert ${id} not found`);
    }
    await this.concertsRepo.remove(concert);
  }

  private mapPerformers(payload?: { name: string; role?: string; order?: number }[]):
    | Performer[]
    | undefined {
    if (!payload) return undefined;
    return payload.map((p) => {
      const performer = new Performer();
      performer.name = p.name;
      performer.role = p.role ?? null;
      performer.order = p.order ?? null;
      return performer;
    });
  }

  private mapAttachments(
    payload?: { label: string; url: string; type: AttachmentType; order?: number }[]
  ): Attachment[] | undefined {
    if (!payload) return undefined;
    return payload.map((a) => {
      const attachment = new Attachment();
      attachment.label = a.label;
      attachment.url = a.url;
      attachment.type = a.type;
      attachment.order = a.order ?? null;
      return attachment;
    });
  }
}
