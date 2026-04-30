/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getMe, login, logout, refreshToken } from "../services/authApi";
import {
  clearHttpAccessToken,
  setHttpAccessToken,
  setUnauthorizedHandler,
} from "../services/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = useCallback(() => {
    clearHttpAccessToken();
    setAccessToken(null);
    setUser(null);
  }, []);

  const bootstrapAuth = useCallback(async () => {
    try {
      const refreshData = await refreshToken();
      const token = refreshData.access;

      setHttpAccessToken(token);
      setAccessToken(token);

      const me = await getMe();
      setUser(me);
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  async function signIn(username, password) {
    const data = await login(username, password);

    setHttpAccessToken(data.access);
    setAccessToken(data.access);

    const me = await getMe();
    setUser(me);
  }

  async function signOut() {
    try {
      await logout();
    } catch {
      // mesmo com erro, limpamos a sessão local
    } finally {
      clearSession();
    }
  }

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    bootstrapAuth();

    return () => {
      setUnauthorizedHandler(() => {});
    };
  }, [bootstrapAuth, clearSession]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        loading,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}