import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

import { authApi, setAccessToken } from '../services/api';

const STORAGE_KEY = 'inventory-auth-session';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function hydrateSession() {
      try {
        const rawSession = await AsyncStorage.getItem(STORAGE_KEY);
        if (!rawSession) {
          return;
        }

        const session = JSON.parse(rawSession);
        setUser(session.user || null);
        setToken(session.token || null);
        setAccessToken(session.token || null);
      } finally {
        setLoading(false);
      }
    }

    hydrateSession();
  }, []);

  async function persistSession(nextSession) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setUser(nextSession.user);
    setToken(nextSession.token);
    setAccessToken(nextSession.token);
  }

  async function clearSession() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setToken(null);
    setAccessToken(null);
  }

  async function login(credentials) {
    const response = await authApi.login(credentials);
    await persistSession(response.data);
    return response.data;
  }

  async function register(payload) {
    const response = await authApi.register(payload);

    if (!user) {
      await persistSession(response.data);
    }

    return response.data;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout: clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}

