import 'reflect-metadata';
import { dataSource } from './data-source';
import { Concert } from '../concerts/entities/concert.entity';
import { ConcertStatus } from '../concerts/entities/concert-status.enum';
import { Performer } from '../concerts/entities/performer.entity';
import { Attachment, AttachmentType } from '../concerts/entities/attachment.entity';

async function seed() {
  await dataSource.initialize();
  await dataSource.synchronize();

  const concertRepo = dataSource.getRepository(Concert);

  const concerts: Partial<Concert>[] = [
    {
      title: 'Spring Preview',
      date: '2025-04-01',
      time: '18:30',
      location: 'Tokyo Hall',
      status: ConcertStatus.Planned
    },
    {
      title: 'Summer Gala',
      date: '2025-07-15',
      time: '19:00',
      location: 'Osaka Symphony Hall',
      status: ConcertStatus.Confirmed
    },
    {
      title: 'Autumn Finale',
      date: '2024-10-30',
      time: '17:00',
      location: 'Nagoya Theater',
      status: ConcertStatus.Finished
    }
  ];

  const saved = await concertRepo.save(
    concerts.map((c) =>
      concertRepo.create({
        ...c,
        performers: [
          Object.assign(new Performer(), {
            name: 'Performer A',
            role: 'Violin',
            order: 1
          })
        ],
        attachments: [
          Object.assign(new Attachment(), {
            label: 'Tickets',
            url: 'https://example.com/tickets',
            type: AttachmentType.Link,
            order: 1
          })
        ]
      })
    )
  );

  console.log(`Inserted ${saved.length} concerts`);
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
