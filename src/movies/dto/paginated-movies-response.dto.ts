import { ApiProperty } from '@nestjs/swagger';
import { MovieResponseDto } from './movie-response.dto';

export class PaginatedMoviesResponseDto {
  @ApiProperty({
    description: 'Array of movies',
    type: [MovieResponseDto],
  })
  data: MovieResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
