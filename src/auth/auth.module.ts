import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './services/auth.service';
import { HashService } from './services/hash/hash.service';
import { JwtService } from './services/jwt/jwt.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './guards';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: ['CONFIG'],
      useFactory: (config: any) => ({
        secret: config.jwt.secret,
        signOptions: { expiresIn: config.jwt.expiresIn },
      }),
    }),
  ],
  providers: [HashService, JwtService, JwtAuthGuard, AuthService],
  controllers: [AuthController],
  exports: [AuthService, HashService, JwtService, JwtAuthGuard],
})
export class AuthModule { }
