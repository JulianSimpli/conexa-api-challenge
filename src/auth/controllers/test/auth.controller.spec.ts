import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../auth.controller';
import { AuthService } from '../../services/auth.service';
import { SignupDto } from '../../dto/signup.dto';
import { SigninDto } from '../../dto/signin.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should register a new user', async () => {
      const expectedResponse = { id: 1, email: 'test@example.com' };
      authService.signup.mockResolvedValue(expectedResponse);

      const result = await controller.signup(signupDto);

      expect(result).toEqual(expectedResponse);
    });

    it('should throw error when email exists', async () => {
      authService.signup.mockRejectedValue(new ConflictException());

      await expect(controller.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('signin', () => {
    const signinDto: SigninDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should sign in a user', async () => {
      const expectedResponse = {
        id: 1,
        email: 'test@example.com',
        accessToken: 'jwt-token',
      };
      authService.signin.mockResolvedValue(expectedResponse);

      const result = await controller.signin(signinDto);

      expect(result).toEqual(expectedResponse);
    });

    it('should throw error with invalid credentials', async () => {
      authService.signin.mockRejectedValue(new UnauthorizedException());

      await expect(controller.signin(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
