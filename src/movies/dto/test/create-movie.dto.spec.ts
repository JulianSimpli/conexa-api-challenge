import { validate } from 'class-validator';
import { CreateMovieDto } from '../create-movie.dto';

describe('CreateMovieDto', () => {
  let dto: CreateMovieDto;

  beforeEach(() => {
    dto = new CreateMovieDto();
  });

  it('should pass validation with valid data', async () => {
    dto.title = 'A New Hope';
    dto.episodeId = 4;
    dto.releaseDate = '1977-05-25';

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should fail validation with empty title', async () => {
    dto.title = '';
    dto.episodeId = 4;
    dto.releaseDate = '1977-05-25';

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('title');
  });

  it('should fail validation with invalid date format', async () => {
    dto.title = 'A New Hope';
    dto.episodeId = 4;
    dto.releaseDate = 'invalid-date';

    const errors = await validate(dto);

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('releaseDate');
  });
});
