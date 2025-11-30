import { AppDataSource } from './data-source';
import { Concert, ConcertStatus } from '../concerts/entities/concert.entity';
import { Performer } from '../concerts/entities/performer.entity';
import { Attachment, AttachmentType } from '../concerts/entities/attachment.entity';

async function run() {
  await AppDataSource.initialize();
  const concertsRepo = AppDataSource.getRepository(Concert);
  await AppDataSource.getRepository(Attachment).clear();
  await AppDataSource.getRepository(Performer).clear();
  await concertsRepo.clear();

  const samples: Partial<Concert>[] = [
    {
      title: 'Spring Gala',
      date: '2025-04-15',
      time: '18:30:00',
      location: 'Tokyo Hall',
      repertoire: 'Symphony program',
      conductor: 'Maestro A',
      ensemble: 'City Orchestra',
      notes: 'Formal attire suggested',
      ticketUrl: 'https://tickets.example.com/spring',
      status: ConcertStatus.PLANNED,
      performers: [
        { name: 'Violinist A', role: 'Solo', order: 1 },
        { name: 'Pianist B', role: 'Accompanist', order: 2 }
      ],
      attachments: [
        {
          label: 'Event Page',
          url: 'https://example.com/spring',
          type: AttachmentType.LINK,
          order: 1
        }
      ]
    },
    {
      title: 'Summer Nights',
      date: '2025-07-01',
      time: '20:00:00',
      location: 'Osaka Arena',
      repertoire: 'Pop arrangements',
      conductor: 'Maestro B',
      ensemble: 'Summer Band',
      notes: 'Outdoor stage',
      status: ConcertStatus.CONFIRMED,
      attachments: [
        {
          label: 'Tickets',
          url: 'https://tickets.example.com/summer',
          type: AttachmentType.LINK
        }
      ]
    },
    {
      title: 'Autumn Classics',
      date: '2024-10-10',
      time: '19:00:00',
      location: 'Nagoya Concert Hall',
      repertoire: 'Baroque evening',
      conductor: 'Maestro C',
      ensemble: 'Chamber Ensemble',
      status: ConcertStatus.FINISHED
    }
  ];

  for (const sample of samples) {
    const concert = concertsRepo.create(sample);
    await concertsRepo.save(concert);
  }

  await AppDataSource.destroy();
  console.log('Seed data inserted');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
