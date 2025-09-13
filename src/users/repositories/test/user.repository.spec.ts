import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../user.repository';
import { DatabaseService } from '../../../database/database.service';
import { CreateUserDto } from '../../dto/create-user.dto';

describe('UserRepository', () => {
  let repository: UserRepository;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    isAdmin: false,
  };

  const mockDatabaseService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockDatabaseService.user.create.mockResolvedValue(mockUser);

      const result = await repository.create(createUserDto);

      expect(mockDatabaseService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
      expect(result).toEqual(mockUser);
    });

    it('should handle database connection error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const dbError = new Error('Database connection failed');
      mockDatabaseService.user.create.mockRejectedValue(dbError);

      await expect(repository.create(createUserDto)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.findByEmail('test@example.com');

      expect(mockDatabaseService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockDatabaseService.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should handle database connection error', async () => {
      const dbError = new Error('Database connection failed');
      mockDatabaseService.user.findUnique.mockRejectedValue(dbError);

      await expect(repository.findByEmail('test@example.com')).rejects.toThrow(
        'Database connection failed',
      );
    });
  });
});
