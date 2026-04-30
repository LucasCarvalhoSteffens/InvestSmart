/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  const signIn = useCallback(async (username, password) => {
    const data = await login(username, password);

    setHttpAccessToken(data.access);
    setAccessToken(data.access);

    const me = await getMe();
    setUser(me);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      // mesmo com erro, limpamos a sessão local
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    bootstrapAuth();

    return () => {
      setUnauthorizedHandler(() => {});
    };
  }, [bootstrapAuth, clearSession]);

  const contextValue = useMemo(
    () => ({
      accessToken,
      user,
      loading,
      isAuthenticated: !!user,
      signIn,
      signOut,
    }),
    [accessToken, user, loading, signIn, signOut]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}