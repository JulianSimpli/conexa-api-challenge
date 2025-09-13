import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseSeederService } from './database-seeder.service';
import { AdminSeeder } from './seeders/admin.seeder';

@Module({
  providers: [DatabaseService, DatabaseSeederService, AdminSeeder],
  exports: [DatabaseService],
})
export class DatabaseModule {}
