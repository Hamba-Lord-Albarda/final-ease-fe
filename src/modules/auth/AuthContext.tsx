import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginApi, register as registerApi, User, AuthResponse } from '../../api/auth';
import { setAuthToken } from '../../api/axiosInstance';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'finalease_auth';

function saveToStorage(data: AuthResponse) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      user: data.user,
      token: data.token
    })
  );
}

function loadFromStorage(): AuthState {
  if (typeof window === 'undefined') {
    return { user: null, token: null, loading: false };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, token: null, loading: false };
    const parsed = JSON.parse(raw) as { user: User; token: string };
    return { user: parsed.user, token: parsed.token, loading: false };
  } catch {
    return { user: null, token: null, loading: false };
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = loadFromStorage();
    setUser(state.user);
    setToken(state.token);
    setAuthToken(state.token);
    setLoading(false);
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.token);
    setAuthToken(data.token);
    saveToStorage(data);
  };

  const login = async (email: string, password: string) => {
    const data = await loginApi(email, password);
    handleAuthSuccess(data);
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    const data = await registerApi(name, email, password, role);
    handleAuthSuccess(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
