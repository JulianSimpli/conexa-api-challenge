import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { HashService } from '../hash/hash.service';
import { JwtService } from '../jwt/jwt.service';
import { UsersService } from '../../../users/services/users.service';
import { SignupDto } from '../../dto/signup.dto';
import { SigninDto } from '../../dto/signin.dto';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let hashService: jest.Mocked<HashService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockHashService = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const mockJwtService = {
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: HashService,
          useValue: mockHashService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    hashService = module.get(HashService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user successfully', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      hashService.hash.mockResolvedValue('hashedPassword');
      usersService.create.mockResolvedValue(mockUser);

      const result = await service.signup(signupDto);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw error when email already exists', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('signin', () => {
    const signinDto: SigninDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should sign in user successfully', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(true);
      jwtService.generateToken.mockResolvedValue('jwt-token');

      const result = await service.signin(signinDto);

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        accessToken: 'jwt-token',
      });
    });

    it('should throw error when user not found', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(service.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw error when password is invalid', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);
      hashService.compare.mockResolvedValue(false);

      await expect(service.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
