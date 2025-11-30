import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateConcertDto } from './create-concert.dto';
import { ConcertStatus } from '../entities/concert.entity';

async function validateDto(payload: Partial<CreateConcertDto>) {
  const dto = plainToInstance(CreateConcertDto, payload);
  return validate(dto);
}

describe('CreateConcertDto validation', () => {
  it('accepts a valid payload', async () => {
    const errors = await validateDto({
      title: 'Sample Concert',
      date: '2025-01-01',
      time: '19:30',
      ticketUrl: 'https://example.com/tickets',
      status: ConcertStatus.CONFIRMED,
      performers: [{ name: 'Performer', role: 'Solo' }]
    });
    expect(errors).toHaveLength(0);
  });

  it('rejects missing title', async () => {
    const errors = await validateDto({});
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects invalid time', async () => {
    const errors = await validateDto({
      title: 'Bad Time',
      time: '7pm'
    });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('rejects invalid status', async () => {
    const errors = await validateDto({
      title: 'Concert',
      status: 'invalid' as ConcertStatus
    });
    expect(errors.length).toBeGreaterThan(0);
  });
});
