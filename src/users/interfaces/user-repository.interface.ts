import { User } from '@prisma/client';

export interface IUserRepository {
  create(data: Partial<User>): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
