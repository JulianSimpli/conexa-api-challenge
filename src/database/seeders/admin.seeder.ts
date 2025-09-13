import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { DatabaseService } from '../database.service';
import { config } from '../../config/config';

@Injectable()
export class AdminSeeder {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async seed(): Promise<void> {
    try {
      await this.databaseService.user.upsert({
        where: { email: config.admin.email },
        update: {},
        create: {
          email: config.admin.email,
          password: await bcrypt.hash(config.admin.password, 10),
          isAdmin: true,
        },
      });
      this.logger.log(`Admin user ready`);
    } catch (error) {
      this.logger.warn('Seeding skipped:', error);
    }
  }
}
