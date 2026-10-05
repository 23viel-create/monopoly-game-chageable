import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../auth';

// Sends visitors without a valid session to the login page
function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
