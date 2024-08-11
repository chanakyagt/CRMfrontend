import React from 'react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('loggedIn'); // Check if logged in

  // Hide navbar on the login page
  if (isLoggedIn) return null;

  return (
    <nav className="bg-gray-800 p-4 fixed top-0 left-0 w-full z-10">
      <ul className="flex justify-around">
        <li>
          <a className="text-white" href="/home">Home</a>
        </li>
        <li>
          <a className="text-white" href="/contact-us">Contact Us</a>
        </li>
        {!isLoggedIn && (
          <li>
            <a className="text-white" href="/login">Login</a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
