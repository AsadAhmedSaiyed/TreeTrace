import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function RequireRole({ children, allowedRoles }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const userRole = user?.publicMetadata?.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}