import { Test, TestingModule } from '@nestjs/testing';
import { ProjectLoggerService } from './project-logger.service';

describe('ProjectLoggerService', () => {
  let service: ProjectLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectLoggerService],
    }).compile();

    service = module.get<ProjectLoggerService>(ProjectLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
