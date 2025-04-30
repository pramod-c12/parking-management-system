import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Menu</h2>
      <ul className="space-y-2">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? 'bg-gray-300' : 'hover:bg-gray-200'}`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/slots"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? 'bg-gray-300' : 'hover:bg-gray-200'}`
            }
          >
            Book a Slot
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/my-bookings"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? 'bg-gray-300' : 'hover:bg-gray-200'}`
            }
          >
            My Bookings
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/statistics"
            className={({ isActive }) =>
              `block p-2 rounded ${isActive ? 'bg-gray-300' : 'hover:bg-gray-200'}`
            }
          >
            Statistics
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;