import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '@prisma/client';
import { USER_REPOSITORY_TOKEN } from '../../../common/tokens/repository.tokens';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: any;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    isAdmin: false,
  };

  const mockCreateUserDto: CreateUserDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    userRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(mockCreateUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should handle database errors during user creation', async () => {
      const dbError = new Error('Database connection failed');
      userRepository.create.mockRejectedValue(dbError);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        'Database connection failed',
      );
      expect(userRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should handle validation errors with invalid data', async () => {
      const invalidDto = {
        email: 'invalid-email',
        password: '123',
      } as CreateUserDto;

      const validationError = new Error('Validation failed');
      userRepository.create.mockRejectedValue(validationError);

      await expect(service.create(invalidDto)).rejects.toThrow(
        'Validation failed',
      );
      expect(userRepository.create).toHaveBeenCalledWith(invalidDto);
    });

    it('should handle duplicate email constraint violation', async () => {
      const duplicateError = new Error(
        'Unique constraint failed on the field: email',
      );
      userRepository.create.mockRejectedValue(duplicateError);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        'Unique constraint failed on the field: email',
      );
      expect(userRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(userRepository.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
      expect(result).toBeNull();
    });
  });
});
