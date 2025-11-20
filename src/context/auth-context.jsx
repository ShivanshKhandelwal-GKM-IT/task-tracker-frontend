import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await api.get("/api/auth/me"); 
        setUser(res.data.user); 
      } catch (error) {
        setUser(null); 
      } finally {
        setLoading(false); 
      }
    };

    checkUserLoggedIn();
  }, []); 

  const login = async (payload) => {
    const res = await api.post("/api/auth/login", payload);
    setUser(res.data.user);
    navigate("/dashboard"); 
  };

  const register = async (payload) => {
    await api.post("/api/auth/register", payload);
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