import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { MoviesService, MovieSyncService } from '../services';
import {
  CreateMovieDto,
  UpdateMovieDto,
  MovieResponseDto,
  PaginationDto,
  PaginatedMoviesResponseDto,
} from '../dto';
import { Serialize, Public } from '../../common';
import { JwtAuthGuard, AdminGuard } from '../../auth/guards';

@ApiTags('movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly movieSyncService: MovieSyncService,
  ) {}

  @ApiOperation({ summary: 'Create a new movie' })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    type: MovieResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Movie with episode ID already exists',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @UseGuards(AdminGuard)
  @Serialize(MovieResponseDto)
  @Post()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @ApiOperation({ summary: 'Get all movies with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Movies retrieved successfully',
    type: PaginatedMoviesResponseDto,
  })
  @Public()
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.moviesService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie retrieved successfully',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @UseGuards(AdminGuard)
  @Serialize(MovieResponseDto)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie updated successfully',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @ApiResponse({
    status: 409,
    description: 'Movie with episode ID already exists',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @UseGuards(AdminGuard)
  @Serialize(MovieResponseDto)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiOperation({ summary: 'Delete movie by ID' })
  @ApiResponse({
    status: 200,
    description: 'Movie deleted successfully',
    type: MovieResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Movie not found' })
  @UseGuards(AdminGuard)
  @Serialize(MovieResponseDto)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.remove(id);
  }

  @ApiOperation({ summary: 'Manually sync movies from SWAPI' })
  @ApiResponse({
    status: 200,
    description: 'Movies synchronization triggered successfully',
  })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sync')
  syncMovies() {
    return this.movieSyncService.forceSyncMovies();
  }
}
