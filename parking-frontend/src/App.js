import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Slots from './pages/Slots';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Statistics from './pages/Statistics';
import AdminStatistics from './pages/AdminStatistics';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/slots" element={<Slots />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/statistics" element={<AdminStatistics />} />
      </Routes>
    </Router>
  );
}

export default App;
