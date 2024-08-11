import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
  const [userType, setUserType] = useState(localStorage.getItem('userType'));
  const [ID, setID] = useState(localStorage.getItem('ID'));
  const [name, setName] = useState(localStorage.getItem('name'));

  const login = (id, type, userName) => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userType', type);
    localStorage.setItem('ID', id);
    localStorage.setItem('name', userName);

    setIsLoggedIn(true);
    setUserType(type);
    setID(id);
    setName(userName);
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUserType(null);
    setID(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userType, ID, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
