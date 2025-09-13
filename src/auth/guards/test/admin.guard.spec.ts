import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from '../admin.guard';
import { JwtPayload } from '../../interfaces/jwt.interface';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminGuard],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
  });

  const createMockExecutionContext = (user?: JwtPayload): ExecutionContext => {
    const mockRequest = {
      user,
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
    it('should allow admin users', () => {
      const adminUser: JwtPayload = {
        sub: '123',
        email: 'admin@example.com',
        isAdmin: true,
      };
      const context = createMockExecutionContext(adminUser);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny non-admin users', () => {
      const regularUser: JwtPayload = {
        sub: '456',
        email: 'user@example.com',
        isAdmin: false,
      };
      const context = createMockExecutionContext(regularUser);

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });

    it('should deny unauthenticated users', () => {
      const context = createMockExecutionContext();

      expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    });
  });
});
