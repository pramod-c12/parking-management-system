import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AllBookings from '../components/admin/AllBookings';
import AllSlots from '../components/admin/AllSlots';
import AddSlotForm from '../components/admin/AddSlotForm';
import CleanupButton from '../components/admin/CleanupButton';
import AdminNavbar from '../components/admin/AdminNavbar';
import { useNavigate } from 'react-router-dom';
const BASE_URL = process.env.REACT_APP_API_URL || 'https://parking-management-system-6t4i.onrender.com';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setIsAdmin(res.data.user.isAdmin);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  // Redirect if not admin after loading finishes
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/login'); // or another route like '/unauthorized'
    }
  }, [loading, isAdmin, navigate]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!isAdmin) return <div className="text-center mt-10 text-red-600">Access Denied</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
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