import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">ParkMate</Link>
        <div className="flex items-center space-x-6">
          <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">Dashboard</Link>
          <Link to="/slots" className="text-gray-700 hover:text-blue-600 transition">Slots</Link>
          <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 transition">My Bookings</Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
