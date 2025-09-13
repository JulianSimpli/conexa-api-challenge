import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from '../create-user.dto';

describe('CreateUserDto', () => {
  const createValidDto = (): CreateUserDto => {
    return plainToClass(CreateUserDto, {
      email: 'test@example.com',
      password: 'password123',
    });
  };

  describe('email validation', () => {
    it('should pass with valid email', async () => {
      const dto = createValidDto();
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with invalid email', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: 'invalid-email',
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail with missing email', async () => {
      const dto = plainToClass(CreateUserDto, {
        password: 'password123',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('email');
    });
  });

  describe('password validation', () => {
    it('should pass with valid password', async () => {
      const dto = createValidDto();
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with short password', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: 'test@example.com',
        password: '12345',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
    });

    it('should fail with missing password', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: 'test@example.com',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(1);
      expect(errors[0].property).toBe('password');
    });
  });

  describe('complete validation', () => {
    it('should pass with all valid fields', async () => {
      const dto = createValidDto();
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should fail with all invalid fields', async () => {
      const dto = plainToClass(CreateUserDto, {
        email: 'invalid',
        password: '123',
      });
      const errors = await validate(dto);
      expect(errors).toHaveLength(2);
    });
  });
});
