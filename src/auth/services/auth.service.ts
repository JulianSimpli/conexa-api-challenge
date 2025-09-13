import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';

import { HashService, JwtService } from './';
import { UsersService } from '../../users/services/users.service';

import { SignupDto, SigninDto } from '../dto';
import { IAuthService } from '../interfaces/auth-service.interface';
import { IAuthUserResponse, IAuthResponse } from '../interfaces/auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) { }

  async signup(signupDto: SignupDto): Promise<IAuthUserResponse> {
    const { email, password } = signupDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hashService.hash(password);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  async signin(signinDto: SigninDto): Promise<IAuthResponse> {
    const { email, password } = signinDto;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.jwtService.generateToken({
      sub: user.id.toString(),
      email: user.email,
      isAdmin: user.isAdmin,
    });

    return {
      id: user.id,
      email: user.email,
      accessToken,
    };
  }
}
