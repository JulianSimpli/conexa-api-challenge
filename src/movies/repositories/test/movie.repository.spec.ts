import { Test, TestingModule } from '@nestjs/testing';
import { MovieRepository } from '../movie.repository';
import { DatabaseService } from '../../../database/database.service';
import { CreateMovieDto } from '../../dto/create-movie.dto';
import { UpdateMovieDto } from '../../dto/update-movie.dto';

describe('MovieRepository', () => {
  let repository: MovieRepository;

  const mockMovie = {
    id: 1,
    title: 'A New Hope',
    episodeId: 4,
    releaseDate: '1977-05-25',
    swapi: false,
  };

  const mockDatabaseService = {
    movie: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieRepository,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    repository = module.get<MovieRepository>(MovieRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        title: 'A New Hope',
        episodeId: 4,
        releaseDate: '1977-05-25',
      };

      mockDatabaseService.movie.create.mockResolvedValue(mockMovie);

      const result = await repository.create(createMovieDto);

      expect(mockDatabaseService.movie.create).toHaveBeenCalledWith({
        data: createMovieDto,
      });
      expect(result).toEqual(mockMovie);
    });
  });

  describe('findById', () => {
    it('should find movie by id', async () => {
      mockDatabaseService.movie.findUnique.mockResolvedValue(mockMovie);

      const result = await repository.findById(1);

      expect(mockDatabaseService.movie.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockMovie);
    });
  });

  describe('findByTitle', () => {
    it('should find movie by title', async () => {
      mockDatabaseService.movie.findUnique.mockResolvedValue(mockMovie);

      const result = await repository.findByTitle('A New Hope');

      expect(mockDatabaseService.movie.findUnique).toHaveBeenCalledWith({
        where: { title: 'A New Hope' },
      });
      expect(result).toEqual(mockMovie);
    });

    it('should return null if movie not found by title', async () => {
      mockDatabaseService.movie.findUnique.mockResolvedValue(null);

      const result = await repository.findByTitle('Non-existent Movie');

      expect(result).toBeNull();
    });
  });

  describe('findPaginated', () => {
    it('should return paginated movies', async () => {
      const movies = [mockMovie];
      const total = 1;

      mockDatabaseService.movie.findMany.mockResolvedValue(movies);
      mockDatabaseService.movie.count.mockResolvedValue(total);

      const result = await repository.findPaginated(1, 10);

      expect(mockDatabaseService.movie.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
      });
      expect(mockDatabaseService.movie.count).toHaveBeenCalled();

      expect(result).toEqual({
        data: movies,
        meta: {
          total,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });
  });

  describe('update', () => {
    it('should update movie', async () => {
      const updateData: UpdateMovieDto = { title: 'Updated Title' };
      const updatedMovie = { ...mockMovie, ...updateData };

      mockDatabaseService.movie.update.mockResolvedValue(updatedMovie);

      const result = await repository.update(1, updateData);

      expect(mockDatabaseService.movie.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).toEqual(updatedMovie);
    });
  });

  describe('delete', () => {
    it('should delete movie', async () => {
      mockDatabaseService.movie.delete.mockResolvedValue(mockMovie);

      await repository.delete(1);

      expect(mockDatabaseService.movie.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
