import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { MoviesController } from '../movies.controller';
import { MoviesService, MovieSyncService } from '../../services';
import { CreateMovieDto, UpdateMovieDto, PaginationDto } from '../../dto';
import { Movie } from '@prisma/client';
import { JwtAuthGuard, AdminGuard } from '../../../auth/guards';

describe('MoviesController', () => {
  let controller: MoviesController;
  let moviesService: jest.Mocked<MoviesService>;
  let movieSyncService: jest.Mocked<MovieSyncService>;

  const mockMovie: Movie = {
    id: 1,
    title: 'A New Hope',
    episodeId: 4,
    releaseDate: '1977-05-25',
    swapi: false,
  };

  const mockCreateMovieDto: CreateMovieDto = {
    title: 'A New Hope',
    episodeId: 4,
    releaseDate: '1977-05-25',
  };

  const mockUpdateMovieDto: UpdateMovieDto = {
    title: 'Star Wars: A New Hope',
  };

  const mockPaginationDto: PaginationDto = {
    page: 1,
    limit: 10,
  };

  const mockPaginatedResponse = {
    data: [mockMovie],
    meta: {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  };

  beforeEach(async () => {
    const mockMoviesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockMovieSyncService = {
      forceSyncMovies: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: MovieSyncService,
          useValue: mockMovieSyncService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<MoviesController>(MoviesController);
    moviesService = module.get(MoviesService);
    movieSyncService = module.get(MovieSyncService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      moviesService.create.mockResolvedValue(mockMovie);

      const result = await controller.create(mockCreateMovieDto);

      expect(moviesService.create).toHaveBeenCalledWith(mockCreateMovieDto);
      expect(result).toEqual(mockMovie);
    });

    it('should throw ConflictException when movie with episode ID already exists', async () => {
      const conflictError = new ConflictException(
        'Movie with episode ID 4 already exists',
      );
      moviesService.create.mockRejectedValue(conflictError);

      await expect(controller.create(mockCreateMovieDto)).rejects.toThrow(
        ConflictException,
      );
      expect(moviesService.create).toHaveBeenCalledWith(mockCreateMovieDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated movies', async () => {
      moviesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(mockPaginationDto);

      expect(moviesService.findAll).toHaveBeenCalledWith(mockPaginationDto);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return paginated movies with default pagination', async () => {
      const defaultPagination = {};
      moviesService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(
        defaultPagination as PaginationDto,
      );

      expect(moviesService.findAll).toHaveBeenCalledWith(defaultPagination);
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      moviesService.findOne.mockResolvedValue(mockMovie);

      const result = await controller.findOne(1);

      expect(moviesService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException when movie is not found', async () => {
      const notFoundError = new NotFoundException(
        'Movie with ID 999 not found',
      );
      moviesService.findOne.mockRejectedValue(notFoundError);

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(moviesService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const updatedMovie = { ...mockMovie, ...mockUpdateMovieDto };
      moviesService.update.mockResolvedValue(updatedMovie);

      const result = await controller.update(1, mockUpdateMovieDto);

      expect(moviesService.update).toHaveBeenCalledWith(1, mockUpdateMovieDto);
      expect(result).toEqual(updatedMovie);
    });

    it('should throw NotFoundException when movie to update is not found', async () => {
      const notFoundError = new NotFoundException(
        'Movie with ID 999 not found',
      );
      moviesService.update.mockRejectedValue(notFoundError);

      await expect(controller.update(999, mockUpdateMovieDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(moviesService.update).toHaveBeenCalledWith(
        999,
        mockUpdateMovieDto,
      );
    });

    it('should throw ConflictException when episode ID already exists', async () => {
      const conflictError = new ConflictException(
        'Movie with episode ID 5 already exists',
      );
      moviesService.update.mockRejectedValue(conflictError);

      await expect(controller.update(1, { episodeId: 5 })).rejects.toThrow(
        ConflictException,
      );
      expect(moviesService.update).toHaveBeenCalledWith(1, { episodeId: 5 });
    });
  });

  describe('remove', () => {
    it('should delete a movie', async () => {
      moviesService.remove.mockResolvedValue(mockMovie);

      const result = await controller.remove(1);

      expect(moviesService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMovie);
    });

    it('should throw NotFoundException when movie to delete is not found', async () => {
      const notFoundError = new NotFoundException(
        'Movie with ID 999 not found',
      );
      moviesService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(moviesService.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('syncMovies', () => {
    it('should trigger movie synchronization', async () => {
      movieSyncService.forceSyncMovies.mockResolvedValue(true);

      const result = await controller.syncMovies();

      expect(movieSyncService.forceSyncMovies).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle synchronization errors', async () => {
      const syncError = new Error('SWAPI synchronization failed');
      movieSyncService.forceSyncMovies.mockRejectedValue(syncError);

      await expect(controller.syncMovies()).rejects.toThrow(
        'SWAPI synchronization failed',
      );
      expect(movieSyncService.forceSyncMovies).toHaveBeenCalled();
    });
  });
});
