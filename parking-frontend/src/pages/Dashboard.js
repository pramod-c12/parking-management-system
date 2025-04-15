// src/pages/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const goToSlots = () => navigate('/slots');
  const goToMyBookings = () => navigate('/my-bookings');
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Welcome to Parking Dashboard</h2>
      <p>Select an option:</p>
      <button onClick={goToSlots}>View Available Slots</button><br /><br />
      <button onClick={goToMyBookings}>My Bookings</button><br /><br />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
