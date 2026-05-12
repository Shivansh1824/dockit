import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, pendingGoogleProfile } = useAuth();

  // If a Google user is mid-onboarding, redirect them to the onboarding page
  if (pendingGoogleProfile) {
    return <Navigate to="/onboarding" replace />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
