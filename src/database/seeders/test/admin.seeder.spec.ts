import { AdminSeeder } from '../admin.seeder';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockedBcrypt = bcrypt as any;

jest.mock('../../../config/config', () => ({
  config: {
    admin: {
      email: 'admin@example.com',
      password: 'admin123',
    },
  },
}));

describe('AdminSeeder', () => {
  let seeder: AdminSeeder;
  let databaseService: any;

  beforeEach(() => {
    databaseService = {
      user: {
        upsert: jest.fn(),
      },
    };

    seeder = new AdminSeeder(databaseService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    it('should create admin user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword);
      databaseService.user.upsert.mockResolvedValue({});

      await seeder.seed();

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('admin123', 10);
    });

    it('should handle upsert errors gracefully', async () => {
      const error = new Error('Database error');
      mockedBcrypt.hash.mockResolvedValue('hashedPassword123');
      databaseService.user.upsert.mockRejectedValue(error);

      await expect(seeder.seed()).resolves.toBeUndefined();

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('admin123', 10);
    });

    it('should handle bcrypt hashing errors', async () => {
      const error = new Error('Hashing error');
      mockedBcrypt.hash.mockRejectedValue(error);

      await expect(seeder.seed()).resolves.toBeUndefined();

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('admin123', 10);
      expect(databaseService.user.upsert).not.toHaveBeenCalled();
    });
  });
});
