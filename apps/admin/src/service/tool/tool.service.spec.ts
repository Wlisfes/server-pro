import { Test, TestingModule } from '@nestjs/testing';
import { ToolService } from './tool.service';

describe('ToolService', () => {
  let service: ToolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToolService],
    }).compile();

    service = module.get<ToolService>(ToolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
