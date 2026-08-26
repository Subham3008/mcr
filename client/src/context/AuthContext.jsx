import { createContext, useEffect, useState } from "react";
import { authApi } from "../services/api";
import { setAccessToken, clearAccessToken } from "../services/TokenStore";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(true);

  // =================================
  // LOGIN
  // =================================

  const login = async (data) => {
    const response = await authApi.post("/auth/login", data);

    const { accessToken, user } = response.data;

    // Memory me
    setAccessToken(accessToken);

    setUser(user);

    return response;
  };

  // =================================
  // REGISTER
  // =================================

  const registerUser = async (data) => {
    const response = await authApi.post("/auth/register", data);

    const { accessToken, user } = response.data;

    setAccessToken(accessToken);

    setUser(user);

    return response;
  };

  // =================================
  // LOGOUT
  // =================================

  const logout = async () => {
    try {
      await authApi.post("/auth/logout");
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  // =================================
  // PAGE REFRESH RECOVERY
  // =================================

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await authApi.post("/auth/refresh-token");

        const { accessToken, user } = response.data;

        setAccessToken(accessToken);

        setUser(user);
      } catch (error) {
        clearAccessToken();
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        registerUser,
        logout,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
