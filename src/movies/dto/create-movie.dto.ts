import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Movie title',
    example: 'A New Hope',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value?.trim())
  title: string;

  @ApiProperty({
    description: 'Episode identifier',
    example: 4,
  })
  @IsInt()
  episodeId: number;

  @ApiProperty({
    description: 'Release date in YYYY-MM-DD format',
    example: '1977-05-25',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'releaseDate must be in YYYY-MM-DD format',
  })
  releaseDate: string;
}
