import { Injectable, Logger, Inject } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';

import { SwapiFilm } from '../interfaces/swapi-response.interface';
import { MOVIE_REPOSITORY_TOKEN } from '../../common/tokens/repository.tokens';

import type { IMovieRepository } from '../interfaces/movie-repository.interface';

@Injectable()
export class MovieSyncService {
  private readonly logger = new Logger(MovieSyncService.name);
  private readonly swapiUrl = 'https://www.swapi.tech/api/films';

  constructor(
    @Inject(MOVIE_REPOSITORY_TOKEN)
    private readonly movieRepository: IMovieRepository,
  ) { }

  // @Cron(CronExpression.EVERY_MINUTE)
  async handleMovieSync(): Promise<void> {
    this.logger.log('Starting movies synchronization with SWAPI...');

    try {
      await this.syncMoviesFromSwapi();
      this.logger.log('Movies synchronization completed successfully');
    } catch (error) {
      this.logger.error('Error during movies synchronization:', error);
    }
  }

  async syncMoviesFromSwapi(): Promise<void> {
    try {
      const swapiMovies = await this.fetchMoviesFromSwapi();

      if (!swapiMovies || swapiMovies.length === 0) {
        this.logger.warn('No movies received from SWAPI');
        return;
      }

      for (const swapiMovie of swapiMovies) {
        const movieData = this.mapSwapiToMovie(swapiMovie);

        const existingMovie = await this.movieRepository.findByTitle(
          movieData.title,
        );
        if (!existingMovie) {
          await this.movieRepository.create({
            ...movieData,
            swapi: true,
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to sync movies from SWAPI:', error);
      throw error;
    }
  }

  private async fetchMoviesFromSwapi(): Promise<SwapiFilm[]> {
    try {
      const response = await fetch(this.swapiUrl);

      if (!response.ok) {
        throw new Error(`SWAPI request failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data.result;
    } catch (error) {
      this.logger.error('Failed to fetch movies from SWAPI:', error);
      throw error;
    }
  }

  private mapSwapiToMovie(swapiMovie: SwapiFilm) {
    const { properties } = swapiMovie;

    return {
      title: properties.title?.trim(),
      episodeId: properties.episode_id,
      releaseDate: properties.release_date,
    };
  }

  async forceSyncMovies(): Promise<boolean> {
    this.logger.log('Manual movies synchronization triggered');
    try {
      await this.syncMoviesFromSwapi();
      return true;
    } catch (error) {
      this.logger.error('Manual synchronization failed:', error);
      throw error;
    }
  }
}
