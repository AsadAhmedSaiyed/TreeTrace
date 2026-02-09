import { useUser } from "@clerk/clerk-react";
import { Children } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children,role})=>{
  
   const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // If a specific role is required, check for it
  if (role && user?.publicMetadata?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;