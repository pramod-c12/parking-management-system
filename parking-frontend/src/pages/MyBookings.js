import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
const BASE_URL = process.env.REACT_APP_API_URL || 'https://parking-management-system-6t4i.onrender.com';

const MyBookings = () => {
  const [currentBookings, setCurrentBookings] = useState([]);
  const [historicalBookings, setHistoricalBookings] = useState([]);
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
        const res = await axios.get(`${BASE_URL}/bookings/my-booking-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentBookings(res.data.currentBookings || []);
        setHistoricalBookings(res.data.historicalBookings || []);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setCurrentBookings([]);
        setHistoricalBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate, token]);

  const cancelBooking = async (bookingId) => {
    try {
      await axios.delete(`${BASE_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentBookings(currentBookings.filter((booking) => booking.id !== bookingId));
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
          ) : (
            <>
              {/* Current Bookings */}
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Current Bookings
                </h3>
                {currentBookings.length === 0 ? (
                  <div className="text-center text-gray-600">
                    You have no active bookings.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {currentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white shadow-md rounded-lg p-5 flex items-center justify-between"
                      >
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700">
                            {booking.slot?.slotNumber || 'N/A'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {booking.date} | {formatTime(booking.startTime)} -{' '}
                            {formatTime(booking.endTime)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Car: {booking.carNumber} ({booking.carType})
                          </p>
                        </div>
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Historical Bookings */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">
                  Booking History
                </h3>
                {historicalBookings.length === 0 ? (
                  <div className="text-center text-gray-600">
                    You have no previous bookings.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {historicalBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white shadow-md rounded-lg p-5"
                      >
                        <h4 className="text-lg font-semibold text-gray-700">
                          {booking.slotNumber || 'N/A'}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {booking.date} | {formatTime(booking.startTime)} -{' '}
                          {formatTime(booking.endTime)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Car: {booking.carNumber} ({booking.carType})
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md shadow-md transition duration-200"
                >
                  Back to Dashboard
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;