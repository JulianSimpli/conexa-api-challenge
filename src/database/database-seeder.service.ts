import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { AdminSeeder } from './seeders/admin.seeder';

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(private readonly adminSeeder: AdminSeeder) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('Admin user seeding...');
    await this.adminSeeder.seed();
  }
}
