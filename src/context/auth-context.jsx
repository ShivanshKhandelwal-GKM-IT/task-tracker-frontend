import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  useEffect(() => {
    setLoading(false);
  }, []); 

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });

    setUser(res.data.user);
    navigate("/dashboard"); 
  };

  const register = async (name, email, password) => {
    await api.post("/api/auth/register", { name, email, password });
    navigate("/login"); 
  };
  
  const logout = async () => {
    try {
        await api.post("/api/auth/logout"); 
    } catch (error) {
        console.error("Logout API call failed:", error);
    }
    
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);