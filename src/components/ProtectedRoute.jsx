import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, userType } = useAuth();

  console.log('ProtectedRoute:', { isLoggedIn, userType, allowedRoles });

  if (!isLoggedIn) {
    console.log('User is not logged in, redirecting to /login');
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.map(role => role.toLowerCase()).includes(userType.toLowerCase())) {
    console.log(`User role ${userType} is not allowed, redirecting to /${userType.toLowerCase()}`);
    return <Navigate to={`/${userType.toLowerCase()}`} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
