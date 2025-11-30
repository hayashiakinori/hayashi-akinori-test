import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertsModule } from '../src/concerts/concerts.module';
import { Concert } from '../src/concerts/entities/concert.entity';
import { Performer } from '../src/concerts/entities/performer.entity';
import { Attachment } from '../src/concerts/entities/attachment.entity';
import { ConcertStatus } from '../src/concerts/entities/concert-status.enum';
import { AttachmentType } from '../src/concerts/entities/attachment.entity';

describe('ConcertsModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Concert, Performer, Attachment],
          synchronize: true
        }),
        ConcertsModule
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true }
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates, reads, updates, and deletes a concert', async () => {
    const createPayload = {
      title: 'Integration Test',
      date: '2025-01-10',
      time: '18:30',
      location: 'Test Hall',
      status: ConcertStatus.Planned,
      performers: [{ name: 'Tester', role: 'Piano' }],
      attachments: [
        {
          label: 'Info',
          url: 'https://example.com/info',
          type: AttachmentType.Link
        }
      ]
    };

    const { body: created } = await request(app.getHttpServer())
      .post('/concerts')
      .send(createPayload)
      .expect(201);

    expect(created.id).toBeDefined();
    expect(created.performers).toHaveLength(1);
    expect(created.attachments).toHaveLength(1);

    const { body: list } = await request(app.getHttpServer())
      .get('/concerts')
      .expect(200);
    expect(list).toHaveLength(1);

    const { body: fetched } = await request(app.getHttpServer())
      .get(`/concerts/${created.id}`)
      .expect(200);
    expect(fetched.title).toBe(createPayload.title);

    const updatePayload = { status: ConcertStatus.Confirmed, performers: [] };
    const { body: updated } = await request(app.getHttpServer())
      .put(`/concerts/${created.id}`)
      .send(updatePayload)
      .expect(200);
    expect(updated.status).toBe(ConcertStatus.Confirmed);
    expect(updated.performers).toHaveLength(0);

    await request(app.getHttpServer())
      .delete(`/concerts/${created.id}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/concerts/${created.id}`)
      .expect(404);
  });
});
