import { Test, TestingModule } from '@nestjs/testing';
import { MovieSyncService } from '../movie-sync.service';
import { DatabaseService } from '../../../database/database.service';
import { MOVIE_REPOSITORY_TOKEN } from '../../../common/tokens/repository.tokens';

global.fetch = jest.fn();

describe('MovieSyncService', () => {
  let service: MovieSyncService;
  let databaseService: any;
  let movieRepository: any;

  beforeEach(async () => {
    databaseService = {
      movie: {
        create: jest.fn(),
      },
    };

    movieRepository = {
      findByTitle: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieSyncService,
        {
          provide: DatabaseService,
          useValue: databaseService,
        },
        {
          provide: MOVIE_REPOSITORY_TOKEN,
          useValue: movieRepository,
        },
      ],
    }).compile();

    service = module.get<MovieSyncService>(MovieSyncService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sync movies from SWAPI', async () => {
    const mockResponse = {
      message: 'ok',
      result: [
        {
          properties: {
            title: 'A New Hope',
            episode_id: 4,
            release_date: '1977-05-25',
          },
        },
      ],
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    movieRepository.findByTitle.mockResolvedValue(null);
    movieRepository.create.mockResolvedValue({});

    await service.syncMoviesFromSwapi();

    expect(fetch).toHaveBeenCalledWith('https://www.swapi.tech/api/films');
    expect(movieRepository.findByTitle).toHaveBeenCalledWith('A New Hope');
    expect(movieRepository.create).toHaveBeenCalledWith({
      title: 'A New Hope',
      episodeId: 4,
      releaseDate: '1977-05-25',
      swapi: true,
    });
  });

  it('should handle network errors', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    await expect(service.syncMoviesFromSwapi()).rejects.toThrow(
      'Network error',
    );
  });
});
