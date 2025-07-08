import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { token } = useAuth();
  // Check if user is logged in
  const isAuthenticated = !!token;

  if (!isAuthenticated) {
    // If not authenticated, redirect to signup with the current path as return URL
    return <Navigate to="/signup" state={{ returnUrl: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;