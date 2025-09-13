import { Module } from '@nestjs/common';

import { MoviesService, MovieSyncService } from './services';
import { MoviesController } from './controllers/movies.controller';
import { MovieRepository } from './repositories/movie.repository';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { MOVIE_REPOSITORY_TOKEN } from '../common/tokens/repository.tokens';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [
    MoviesService,
    MovieSyncService,
    {
      provide: MOVIE_REPOSITORY_TOKEN,
      useClass: MovieRepository,
    },
  ],
  controllers: [MoviesController],
  exports: [MoviesService],
})
export class MoviesModule {}
