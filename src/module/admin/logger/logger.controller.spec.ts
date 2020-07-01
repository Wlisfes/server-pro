import { Test, TestingModule } from '@nestjs/testing';
import { LoggerController } from './logger.controller';

describe('Logger Controller', () => {
  let controller: LoggerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoggerController],
    }).compile();

    controller = module.get<LoggerController>(LoggerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
