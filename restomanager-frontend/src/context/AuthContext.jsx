import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await api.get("/me");
      setUser(res.data);
    } catch (error) {
      console.error("Error cargando usuario:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    return userData;
  };

  const register = async (data) => {
    const res = await api.post("/register", data);
    const { token: newToken, user: userData } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    return userData;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    }
  };

  const isAdmin = () => {
    return user?.role?.name?.toLowerCase() === "administrador";
  };

  const isMesero = () => {
    return user?.role?.name?.toLowerCase() === "mesero";
  };

  const isCliente = () => {
    return user?.role?.name?.toLowerCase() === "cliente";
  };

  const hasRole = (...roles) => {
    if (!user?.role?.name) return false;
    const userRole = user.role.name.toLowerCase();
    return roles.some(role => role.toLowerCase() === userRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isMesero,
        isCliente,
        hasRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};