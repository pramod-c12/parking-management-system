// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navLinkClass = ({ isActive }) =>
    `block px-4 py-3 rounded hover:bg-gray-200 ${
      isActive ? 'bg-gray-300 font-semibold' : ''
    }`;

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <nav className="space-y-2">
        <NavLink to="/dashboard" className={navLinkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/slots" className={navLinkClass}>
          Available Slots
        </NavLink>
        <NavLink to="/my-bookings" className={navLinkClass}>
          My Bookings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
