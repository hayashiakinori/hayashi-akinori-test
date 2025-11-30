process.env.DB_TYPE = 'sqlite';
process.env.DB_NAME = ':memory:';
process.env.DB_SYNCHRONIZE = 'true';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ConcertStatus } from '../src/concerts/entities/concert.entity';

describe('ConcertsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/concerts (POST -> GET -> PUT -> DELETE)', async () => {
    const createPayload = {
      title: 'E2E Concert',
      date: '2025-12-01',
      time: '20:00',
      status: ConcertStatus.CONFIRMED,
      performers: [{ name: 'Performer 1' }],
      attachments: [
        { label: 'Ticket', url: 'https://example.com/ticket', type: 'link' }
      ]
    };

    const createResponse = await request(app.getHttpServer())
      .post('/concerts')
      .send(createPayload)
      .expect(201);

    const createdId = createResponse.body.id;

    const fetched = await request(app.getHttpServer())
      .get(`/concerts/${createdId}`)
      .expect(200);

    expect(fetched.body.title).toBe(createPayload.title);
    expect(fetched.body.performers).toHaveLength(1);

    await request(app.getHttpServer())
      .put(`/concerts/${createdId}`)
      .send({
        title: 'Updated Concert',
        status: ConcertStatus.FINISHED,
        performers: [{ name: 'Another Performer', role: 'Guest' }]
      })
      .expect(200);

    const updated = await request(app.getHttpServer())
      .get(`/concerts/${createdId}`)
      .expect(200);

    expect(updated.body.title).toBe('Updated Concert');
    expect(updated.body.status).toBe(ConcertStatus.FINISHED);
    expect(updated.body.performers[0].name).toBe('Another Performer');

    await request(app.getHttpServer())
      .delete(`/concerts/${createdId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/concerts/${createdId}`)
      .expect(404);
  });
});
