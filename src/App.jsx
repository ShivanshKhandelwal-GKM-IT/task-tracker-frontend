import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/auth-context";
import { ToastContainer } from "react-toastify";

import Login from "./pages/login";
import Register from "./pages/register";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Dashboard from "./pages/dashboard";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(); 
  
  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center'}}>Loading application...</div>;
  }
  if (isAuthenticated) {
    return children;
  }
  return <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer />
      </AuthProvider>
    </Router>
  );
}
