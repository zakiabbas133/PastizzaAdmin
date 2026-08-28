export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  expiresAt: string;
  user: AuthUser;
}
