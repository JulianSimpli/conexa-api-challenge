import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  @Expose()
  email: string;
}
