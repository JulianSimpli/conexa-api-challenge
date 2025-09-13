import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config.module';

describe('ConfigModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should be a global module', () => {
    const configModule = module.get(ConfigModule);
    expect(configModule).toBeDefined();
  });

  it('should compile without errors', () => {
    expect(() => module).not.toThrow();
  });
});
