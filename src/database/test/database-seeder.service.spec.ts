import { DatabaseSeederService } from '../database-seeder.service';

describe('DatabaseSeederService', () => {
  let service: DatabaseSeederService;
  let adminSeeder: any;

  beforeEach(() => {
    adminSeeder = {
      seed: jest.fn(),
    };

    service = new DatabaseSeederService(adminSeeder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onApplicationBootstrap', () => {
    it('should seed admin user on bootstrap', async () => {
      adminSeeder.seed.mockResolvedValue(undefined);

      await service.onApplicationBootstrap();

      expect(adminSeeder.seed).toHaveBeenCalledTimes(1);
    });

    it('should handle seeding errors', async () => {
      const error = new Error('Seeding failed');
      adminSeeder.seed.mockRejectedValue(error);

      await expect(service.onApplicationBootstrap()).rejects.toThrow(
        'Seeding failed',
      );
      expect(adminSeeder.seed).toHaveBeenCalledTimes(1);
    });
  });
});
