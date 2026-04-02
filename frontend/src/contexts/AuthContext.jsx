import { createContext, useContext, useEffect, useState } from "react";
import { getMe, login, logout, refreshToken } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function bootstrapAuth() {
    try {
      const refreshData = await refreshToken();
      const token = refreshData.access;
      setAccessToken(token);

      const me = await getMe(token);
      setUser(me);
    } catch {
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(username, password) {
    const data = await login(username, password);
    setAccessToken(data.access);

    const me = await getMe(data.access);
    setUser(me);
  }

  async function signOut() {
    try {
      if (accessToken) {
        await logout(accessToken);
      }
    } catch {
      // ignora erro de logout
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  useEffect(() => {
    bootstrapAuth();
  }, []);

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