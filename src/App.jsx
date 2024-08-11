import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Login from './components/Login';
import RoleBasedRoutes from './components/RoleBasedRoutes ';
import LayoutComponent from './components/Layout';
import Home from './components/Home';
import ContactUs from './components/ContactUs';

const App = () => {
  console.log('App component rendered');
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LayoutComponent />}>
            <Route path="login" element={<Login />} />
            <Route path="home" element={<Home />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="*" element={<RoleBasedRoutes />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
