import { Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';
import { IMovieRepository } from '../interfaces/movie-repository.interface';
import { IPaginatedResponse } from '../../common/interfaces/paginated-response.interface';

@Injectable()
export class MovieRepository implements IMovieRepository {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(data: Partial<Movie>): Promise<Movie> {
    return this.databaseService.movie.create({
      data: {
        title: data.title!,
        episodeId: data.episodeId!,
        releaseDate: data.releaseDate!,
        swapi: data.swapi ?? false,
      },
    });
  }

  async findById(id: number): Promise<Movie | null> {
    return this.databaseService.movie.findUnique({
      where: { id },
    });
  }

  async findByTitle(title: string): Promise<Movie | null> {
    return this.databaseService.movie.findUnique({
      where: { title },
    });
  }

  async findPaginated(
    page: number,
    limit: number,
  ): Promise<IPaginatedResponse<Movie>> {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.databaseService.movie.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.databaseService.movie.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async update(id: number, data: Partial<Movie>): Promise<Movie> {
    return this.databaseService.movie.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.databaseService.movie.delete({
      where: { id },
    });
  }
}
