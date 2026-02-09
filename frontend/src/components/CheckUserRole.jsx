import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function CheckUserRole({ children }) {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      const role = user.publicMetadata?.role;
      
      if (!role) {
        navigate('/select-role');
      }
    }
  }, [isLoaded, user, navigate]);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user?.publicMetadata?.role) {
    return null;
  }

  return children;
}