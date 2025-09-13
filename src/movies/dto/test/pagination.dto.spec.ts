import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PaginationDto } from '../pagination.dto';

describe('PaginationDto', () => {
  it('should pass validation with default values', async () => {
    const dto = new PaginationDto();

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
  });

  it('should pass validation with valid values', async () => {
    const dto = plainToClass(PaginationDto, { page: '2', limit: '5' });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(5);
  });

  it('should fail validation with invalid page', async () => {
    const dto = plainToClass(PaginationDto, { page: '0' });

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('page');
  });
});
