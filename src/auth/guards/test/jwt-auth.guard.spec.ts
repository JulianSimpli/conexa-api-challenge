import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { JwtService } from '../../services/jwt/jwt.service';
import { JwtPayload } from '../../interfaces/jwt.interface';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let reflector: jest.Mocked<Reflector>;

  const mockJwtService = {
    generateToken: jest.fn(),
    verifyToken: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get(JwtService);
    reflector = module.get(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (
    headers: Record<string, string> = {},
  ): ExecutionContext => {
    const mockRequest = {
      headers,
      user: undefined,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should allow public routes', async () => {
      const context = createMockExecutionContext();
      reflector.getAllAndOverride.mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow valid Bearer token', async () => {
      const validPayload: JwtPayload = {
        sub: '123',
        email: 'test@example.com',
        isAdmin: false,
      };
      const context = createMockExecutionContext({
        authorization: 'Bearer valid-jwt-token',
      });

      reflector.getAllAndOverride.mockReturnValue(false);
      jwtService.verifyToken.mockResolvedValue(validPayload);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should reject missing token', async () => {
      const context = createMockExecutionContext();
      reflector.getAllAndOverride.mockReturnValue(false);

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should reject invalid token', async () => {
      const context = createMockExecutionContext({
        authorization: 'Bearer invalid-token',
      });

      reflector.getAllAndOverride.mockReturnValue(false);
      jwtService.verifyToken.mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
