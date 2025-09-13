import { SignupDto } from '../dto/signup.dto';
import { SigninDto } from '../dto/signin.dto';
import { IAuthUserResponse, IAuthResponse } from './auth.interface';

export interface IAuthService {
  signup(signupDto: SignupDto): Promise<IAuthUserResponse>;
  signin(signinDto: SigninDto): Promise<IAuthResponse>;
}

export interface IHashService {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}
