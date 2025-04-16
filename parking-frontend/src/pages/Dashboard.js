import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [bookingCount, setBookingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    axios
      .get('http://localhost:5000/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const bookings = res.data.bookings || [];
        setBookingCount(bookings.length);
        setRecentBookings(bookings.slice(0, 3));
      })
      .catch((err) => {
        console.error('Failed to fetch bookings:', err);
      });
  }, [navigate, token]);

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to ParkMate! 🚗</h1>
        <p className="text-gray-600 mb-8">
          Manage your bookings, check slot availability, and park hassle-free!
        </p>

        {/* Quick Stats */}
        <div className="bg-white shadow-md rounded-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Your Stats</h2>
          <p className="text-gray-600 text-lg">
            Active Bookings: <span className="font-bold">{bookingCount}</span>
          </p>
        </div>

        {/* Recent Bookings */}
        {recentBookings.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Recent Bookings</h2>
            <div className="grid gap-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white shadow-sm rounded-lg p-4 border border-gray-100"
                >
                  <p className="text-gray-800 font-medium">
                    {booking.slot?.slotNumber || 'N/A'} – {booking.date}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {booking.carNumber} ({booking.carType})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/slots')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow transition"
          >
            Book a Slot
          </button>
          <button
            onClick={() => navigate('/my-bookings')}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-md shadow transition"
          >
            My Bookings
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
