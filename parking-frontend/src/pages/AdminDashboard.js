import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AllBookings from '../components/admin/AllBookings';
import AllSlots from '../components/admin/AllSlots';
import AddSlotForm from '../components/admin/AddSlotForm';
import CleanupButton from '../components/admin/CleanupButton';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:5000/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsAdmin(res.data.user.isAdmin);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!isAdmin) return <div className="text-center mt-10 text-red-600">Access Denied</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom admin top bar */}
      <div className="bg-gray-800 text-white py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-sm px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      {/* Main admin panel */}
      <div className="max-w-6xl mx-auto py-10 px-4">
        <div className="grid gap-10">
          <AllBookings />
          <AllSlots />
          <AddSlotForm />
          <CleanupButton />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
