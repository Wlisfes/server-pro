import { Test, TestingModule } from '@nestjs/testing';
import { NotesLoggerService } from './notes-logger.service';

describe('NotesLoggerService', () => {
  let service: NotesLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesLoggerService],
    }).compile();

    service = module.get<NotesLoggerService>(NotesLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
