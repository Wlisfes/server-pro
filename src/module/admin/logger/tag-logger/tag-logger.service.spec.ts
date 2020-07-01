import { Test, TestingModule } from '@nestjs/testing';
import { TagLoggerService } from './tag-logger.service';

describe('TagLoggerService', () => {
  let service: TagLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagLoggerService],
    }).compile();

    service = module.get<TagLoggerService>(TagLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
