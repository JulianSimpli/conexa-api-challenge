import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

import { JwtPayload } from '../../interfaces/jwt.interface';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) { }

  async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(token);
  }
}
