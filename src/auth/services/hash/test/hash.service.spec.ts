import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from '../hash.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await service.hash(password);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(result).toBe(hashedPassword);
    });

    it('should handle hashing errors', async () => {
      const password = 'password123';
      const error = new Error('Hashing failed');

      (bcrypt.hash as jest.Mock).mockRejectedValue(error);

      await expect(service.hash(password)).rejects.toThrow('Hashing failed');
    });
  });

  describe('compare', () => {
    it('should return true for matching passwords', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.compare(password, hashedPassword);

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.compare(password, hashedPassword);

      expect(result).toBe(false);
    });

    it('should handle comparison errors', async () => {
      const password = 'password123';
      const hashedPassword = 'hashedPassword123';
      const error = new Error('Comparison failed');

      (bcrypt.compare as jest.Mock).mockRejectedValue(error);

      await expect(service.compare(password, hashedPassword)).rejects.toThrow(
        'Comparison failed',
      );
    });
  });
});
