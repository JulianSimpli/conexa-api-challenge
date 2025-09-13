import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { AuthUserResponseDto } from './auth-user-response.dto';

export class AuthResponseDto extends AuthUserResponseDto {
  @ApiProperty({
    description: 'JWT access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  accessToken: string;
}
