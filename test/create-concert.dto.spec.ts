import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateConcertDto } from '../src/concerts/dto/create-concert.dto';
import { ConcertStatus } from '../src/concerts/entities/concert-status.enum';
import { AttachmentType } from '../src/concerts/entities/attachment.entity';

describe('CreateConcertDto validation', () => {
  it('accepts a valid payload', async () => {
    const dto = plainToInstance(CreateConcertDto, {
      title: 'Sample',
      date: '2025-01-01',
      time: '18:00',
      status: ConcertStatus.Planned,
      ticketUrl: 'https://example.com',
      performers: [{ name: 'Performer 1', role: 'Cello', order: 1 }],
      attachments: [
        {
          label: 'Tickets',
          url: 'https://example.com/tickets',
          type: AttachmentType.Link,
          order: 1
        }
      ]
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('rejects missing title and invalid time', async () => {
    const dto = plainToInstance(CreateConcertDto, {
      date: '2025-01-01',
      time: '25:00',
      status: '予定'
    });

    const errors = await validate(dto);
    const fields = errors.map((e) => e.property);
    expect(fields).toContain('title');
    expect(fields).toContain('time');
  });

  it('rejects invalid attachment url', async () => {
    const dto = plainToInstance(CreateConcertDto, {
      title: 'Test',
      status: ConcertStatus.Planned,
      attachments: [
        {
          label: 'Bad',
          url: 'not-a-url',
          type: AttachmentType.Link
        }
      ]
    });

    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'attachments')).toBeTruthy();
  });
});
