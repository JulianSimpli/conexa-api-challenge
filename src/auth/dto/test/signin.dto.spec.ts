import { validate } from 'class-validator';
import { SigninDto } from '../signin.dto';

describe('SigninDto', () => {
  let dto: SigninDto;

  beforeEach(() => {
    dto = new SigninDto();
  });

  it('should pass validation with valid data', async () => {
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid email', async () => {
    dto.email = 'invalid-email';
    dto.password = 'validPassword';

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with empty password', async () => {
    dto.email = 'test@example.com';
    dto.password = '';

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });
});
