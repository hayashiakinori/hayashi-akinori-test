import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { Concert, ConcertStatus } from './entities/concert.entity';
import { Performer } from './entities/performer.entity';
import { CreateConcertDto } from './dto/create-concert.dto';
import { UpdateConcertDto } from './dto/update-concert.dto';
import { FilterConcertDto } from './dto/filter-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(
    @InjectRepository(Concert)
    private readonly concertsRepository: Repository<Concert>,
    @InjectRepository(Performer)
    private readonly performersRepository: Repository<Performer>,
    @InjectRepository(Attachment)
    private readonly attachmentsRepository: Repository<Attachment>
  ) {}

  async create(dto: CreateConcertDto): Promise<Concert> {
    const concert = this.concertsRepository.create({
      ...dto,
      performers: dto.performers?.map((performer) =>
        this.performersRepository.create(performer)
      ),
      attachments: dto.attachments?.map((attachment) =>
        this.attachmentsRepository.create(attachment)
      )
    });
    return this.concertsRepository.save(concert);
  }

  async findAll(filter: FilterConcertDto): Promise<Concert[]> {
    const qb = this.concertsRepository
      .createQueryBuilder('concert')
      .leftJoinAndSelect('concert.performers', 'performer')
      .leftJoinAndSelect('concert.attachments', 'attachment')
      .orderBy('concert.date', 'ASC', 'NULLS LAST')
      .addOrderBy('concert.time', 'ASC', 'NULLS LAST');

    if (filter.status) {
      qb.andWhere('concert.status = :status', { status: filter.status });
    }
    if (filter.fromDate) {
      qb.andWhere('concert.date >= :fromDate', { fromDate: filter.fromDate });
    }
    if (filter.toDate) {
      qb.andWhere('concert.date <= :toDate', { toDate: filter.toDate });
    }

    return qb.getMany();
  }

  async findOne(id: number): Promise<Concert> {
    const concert = await this.concertsRepository.findOne({
      where: { id },
      relations: ['performers', 'attachments']
    });
    if (!concert) {
      throw new NotFoundException(`Concert ${id} not found`);
    }
    return concert;
  }

  async update(id: number, dto: UpdateConcertDto): Promise<Concert> {
    const concert = await this.findOne(id);

    Object.assign(concert, dto);

    if (dto.performers) {
      concert.performers = dto.performers.map((performer) =>
        this.performersRepository.create(performer)
      );
    }
    if (dto.attachments) {
      concert.attachments = dto.attachments.map((attachment) =>
        this.attachmentsRepository.create(attachment)
      );
    }

    return this.concertsRepository.save(concert);
  }

  async remove(id: number): Promise<void> {
    const concert = await this.findOne(id);
    await this.concertsRepository.remove(concert);
  }
}
