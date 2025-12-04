import api from './axiosInstance';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await api.post('/api/auth/login', { email, password });
  return res.data.data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role?: string
): Promise<AuthResponse> {
  const res = await api.post('/api/auth/register', { name, email, password, role });
  return res.data.data;
}
