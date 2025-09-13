export interface IAuthUserResponse {
  id: number;
  email: string;
}

export interface IAuthResponse extends IAuthUserResponse {
  accessToken?: string;
}
