import { JwtService } from '../jwt.service';
import { JwtPayload } from '../../../interfaces/jwt.interface';

describe('JwtService', () => {
  let service: JwtService;
  let nestJwtService: any;

  const mockJwtPayload: JwtPayload = {
    sub: '1',
    email: 'test@example.com',
    isAdmin: false,
  };

  beforeEach(() => {
    nestJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    service = new JwtService(nestJwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a token', async () => {
      const token = 'generated-token';
      nestJwtService.signAsync.mockResolvedValue(token);

      const result = await service.generateToken(mockJwtPayload);

      expect(nestJwtService.signAsync).toHaveBeenCalledWith(mockJwtPayload);
      expect(result).toBe(token);
    });

    it('should handle token generation errors', async () => {
      const error = new Error('Token generation failed');
      nestJwtService.signAsync.mockRejectedValue(error);

      await expect(service.generateToken(mockJwtPayload)).rejects.toThrow(
        'Token generation failed',
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const token = 'valid-token';
      nestJwtService.verifyAsync.mockResolvedValue(mockJwtPayload);

      const result = await service.verifyToken(token);

      expect(nestJwtService.verifyAsync).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockJwtPayload);
    });

    it('should handle token verification errors', async () => {
      const token = 'invalid-token';
      const error = new Error('Token verification failed');
      nestJwtService.verifyAsync.mockRejectedValue(error);

      await expect(service.verifyToken(token)).rejects.toThrow(
        'Token verification failed',
      );
    });
  });
});
