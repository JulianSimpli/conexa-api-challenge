import { Movie } from '@prisma/client';
import { IPaginatedResponse } from '../../common/interfaces/paginated-response.interface';

export interface IMovieRepository {
  create(data: Partial<Movie>): Promise<Movie>;
  findById(id: number): Promise<Movie | null>;
  findByTitle(title: string): Promise<Movie | null>;
  findPaginated(
    page: number,
    limit: number,
  ): Promise<IPaginatedResponse<Movie>>;
  update(id: number, data: Partial<Movie>): Promise<Movie>;
  delete(id: number): Promise<void>;
}
