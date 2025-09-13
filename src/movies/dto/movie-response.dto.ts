import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MovieResponseDto {
  @ApiProperty({
    description: 'Movie unique identifier',
    example: 1,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'Movie title',
    example: 'A New Hope',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Episode identifier',
    example: 4,
  })
  @Expose()
  episodeId: number;

  @ApiProperty({
    description: 'Release date',
    example: '1977-05-25',
  })
  @Expose()
  releaseDate: string;

  @ApiProperty({
    description: 'Indicates if the movie comes from SWAPI',
    example: false,
  })
  @Expose()
  swapi: boolean;
}
