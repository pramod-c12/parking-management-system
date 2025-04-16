import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Add this import

const MyBookings = () => {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMyBookings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/bookings/my-bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookedSlots(res.data.bookings || []);
      } catch (err) {
        console.error('Failed to fetch booked slots:', err);
        setBookedSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate, token]);

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookedSlots(bookedSlots.filter((slot) => slot.id !== bookingId));
    } catch (err) {
      console.error('Cancel failed:', err);
      alert('Failed to cancel booking.');
    }
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            My Bookings
          </h2>

          {loading ? (
            <div className="text-center text-gray-500">Loading your bookings...</div>
          ) : bookedSlots.length === 0 ? (
            <div className="text-center text-gray-600">You have no active bookings.</div>
          ) : (
            <div className="grid gap-4">
              {bookedSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white shadow-md rounded-lg p-5 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      {slot.slot?.slotNumber || 'N/A'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {slot.date} | {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Car: {slot.carNumber} ({slot.carType})
                    </p>
                  </div>
                  <button
                    onClick={() => cancelBooking(slot.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md transition duration-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyBookings;
