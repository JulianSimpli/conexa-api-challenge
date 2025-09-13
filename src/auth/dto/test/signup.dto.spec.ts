import { validate } from 'class-validator';
import { SignupDto } from '../signup.dto';

describe('SignupDto', () => {
  let dto: SignupDto;

  beforeEach(() => {
    dto = new SignupDto();
  });

  it('should pass validation with valid data', async () => {
    dto.email = 'test@example.com';
    dto.password = 'password123';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail validation with invalid email', async () => {
    dto.email = 'invalid-email';
    dto.password = 'validPassword123';

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with short password', async () => {
    dto.email = 'test@example.com';
    dto.password = '12345'; // too short

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('password');
  });
});
