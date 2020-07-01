import { Test, TestingModule } from '@nestjs/testing';
import { ArticleLoggerService } from './article-logger.service';

describe('ArticleLoggerService', () => {
  let service: ArticleLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticleLoggerService],
    }).compile();

    service = module.get<ArticleLoggerService>(ArticleLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
