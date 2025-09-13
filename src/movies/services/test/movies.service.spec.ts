import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from '../movies.service';
import { CreateMovieDto } from '../../dto/create-movie.dto';
import { UpdateMovieDto } from '../../dto/update-movie.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { Movie } from '@prisma/client';
import { MOVIE_REPOSITORY_TOKEN } from '../../../common/tokens/repository.tokens';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: any;

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

  beforeEach(async () => {
    movieRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByTitle: jest.fn(),
      findPaginated: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: MOVIE_REPOSITORY_TOKEN,
          useValue: movieRepository,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a movie', async () => {
    movieRepository.findByTitle.mockResolvedValue(null);
    movieRepository.create.mockResolvedValue(mockMovie);

    const result = await service.create(mockCreateMovieDto);

    expect(movieRepository.findByTitle).toHaveBeenCalledWith('A New Hope');
    expect(movieRepository.create).toHaveBeenCalledWith(mockCreateMovieDto);
    expect(result).toEqual(mockMovie);
  });

  it('should throw ConflictException when creating movie with duplicate title', async () => {
    movieRepository.findByTitle.mockResolvedValue(mockMovie);

    await expect(service.create(mockCreateMovieDto)).rejects.toThrow(
      'Movie with title "A New Hope" already exists',
    );

    expect(movieRepository.findByTitle).toHaveBeenCalledWith('A New Hope');
    expect(movieRepository.create).not.toHaveBeenCalled();
  });

  it('should get all movies', async () => {
    const paginationDto: PaginationDto = { page: 1, limit: 10 };
    const mockPaginatedResponse = {
      data: [mockMovie],
      meta: {
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };

    movieRepository.findPaginated.mockResolvedValue(mockPaginatedResponse);

    const result = await service.findAll(paginationDto);

    expect(movieRepository.findPaginated).toHaveBeenCalledWith(1, 10);
    expect(result).toEqual(mockPaginatedResponse);
  });

  it('should get one movie', async () => {
    movieRepository.findById.mockResolvedValue(mockMovie);

    const result = await service.findOne(1);

    expect(movieRepository.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockMovie);
  });

  it('should update a movie', async () => {
    const updateDto: UpdateMovieDto = { title: 'Updated Title' };
    const updatedMovie = { ...mockMovie, ...updateDto };

    movieRepository.findById.mockResolvedValue(mockMovie);
    movieRepository.findByTitle.mockResolvedValue(null);
    movieRepository.update.mockResolvedValue(updatedMovie);

    const result = await service.update(1, updateDto);

    expect(movieRepository.findById).toHaveBeenCalledWith(1);
    expect(movieRepository.findByTitle).toHaveBeenCalledWith('Updated Title');
    expect(movieRepository.update).toHaveBeenCalledWith(1, updateDto);
    expect(result).toEqual(updatedMovie);
  });

  it('should throw ConflictException when updating movie with duplicate title', async () => {
    const updateDto: UpdateMovieDto = { title: 'A New Hope' };
    const existingMovie = { ...mockMovie, id: 2 };

    movieRepository.findById.mockResolvedValue(mockMovie);
    movieRepository.findByTitle.mockResolvedValue(existingMovie);

    await expect(service.update(1, updateDto)).rejects.toThrow(
      'Movie with title "A New Hope" already exists',
    );

    expect(movieRepository.findById).toHaveBeenCalledWith(1);
    expect(movieRepository.findByTitle).toHaveBeenCalledWith('A New Hope');
    expect(movieRepository.update).not.toHaveBeenCalled();
  });

  it('should delete a movie', async () => {
    movieRepository.findById.mockResolvedValue(mockMovie);
    movieRepository.delete.mockResolvedValue(undefined);

    const result = await service.remove(1);

    expect(movieRepository.findById).toHaveBeenCalledWith(1);
    expect(movieRepository.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockMovie);
  });
});
