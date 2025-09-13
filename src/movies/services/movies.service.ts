import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { Movie } from '@prisma/client';

import { CreateMovieDto } from '../dto/create-movie.dto';
import { UpdateMovieDto } from '../dto/update-movie.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { IPaginatedResponse } from '../../common/interfaces/paginated-response.interface';
import type { IMovieRepository } from '../interfaces/movie-repository.interface';
import { MOVIE_REPOSITORY_TOKEN } from '../../common/tokens/repository.tokens';

@Injectable()
export class MoviesService {
  constructor(
    @Inject(MOVIE_REPOSITORY_TOKEN)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const existingMovieByTitle = await this.movieRepository.findByTitle(
      createMovieDto.title,
    );
    if (existingMovieByTitle) {
      throw new ConflictException(
        `Movie with title "${createMovieDto.title}" already exists`,
      );
    }

    return this.movieRepository.create(createMovieDto);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResponse<Movie>> {
    const { page = 1, limit = 10 } = paginationDto;
    return this.movieRepository.findPaginated(page, limit);
  }

  async findOne(id: number): Promise<Movie | null> {
    const movie = await this.movieRepository.findById(id);

    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    await this.findOne(id);

    if (updateMovieDto.title) {
      const existingMovieByTitle = await this.movieRepository.findByTitle(
        updateMovieDto.title,
      );
      if (existingMovieByTitle && existingMovieByTitle.id !== id) {
        throw new ConflictException(
          `Movie with title "${updateMovieDto.title}" already exists`,
        );
      }
    }

    return this.movieRepository.update(id, updateMovieDto);
  }

  async remove(id: number): Promise<Movie> {
    const movie = await this.findOne(id);
    await this.movieRepository.delete(id);
    return movie!;
  }
}
