import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL || 'https://parking-management-system-6t4i.onrender.com';

const AllBookings = () => {
  const [currentBookings, setCurrentBookings] = useState([]);
  const [historicalBookings, setHistoricalBookings] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // Track booking to delete
  const token = localStorage.getItem('token');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCurrentBookings(res.data.currentBookings || []);
        setHistoricalBookings(res.data.historicalBookings || []);
      })
      .catch((err) => console.error(err));
  }, [token]);

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`${BASE_URL}/admin/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentBookings(currentBookings.filter((b) => b.id !== bookingId));
      setConfirmDeleteId(null);
      setMessage('Booking deleted and email successfully sent to the user.');
      setTimeout(() => setMessage(''), 5000); // Auto-dismiss after 5s
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking.');
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Bookings</h2>
      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded text-sm">
          {message}
        </div>
      )}


      {/* Current Bookings */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Current Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2">Slot</th>
                <th className="border px-4 py-2">Car</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{b.date}</td>
                  <td className="border px-4 py-2">
                    {b.startTime} - {b.endTime}
                  </td>
                  <td className="border px-4 py-2">{b.slot?.slotNumber || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {b.carNumber} ({b.carType})
                  </td>
                  <td className="border px-4 py-2">{b.user?.email || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {confirmDeleteId === b.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="bg-gray-300 text-gray-800 px-2 py-1 rounded text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(b.id)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentBookings.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No current bookings found.</p>
          )}
        </div>
      </div>

      {/* Historical Bookings */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Booking History</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Time</th>
                <th className="border px-4 py-2">Slot</th>
                <th className="border px-4 py-2">Car</th>
                <th className="border px-4 py-2">User</th>
              </tr>
            </thead>
            <tbody>
              {historicalBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{b.date}</td>
                  <td className="border px-4 py-2">
                    {b.startTime} - {b.endTime}
                  </td>
                  <td className="border px-4 py-2">{b.slotNumber || 'N/A'}</td>
                  <td className="border px-4 py-2">
                    {b.carNumber} ({b.carType})
                  </td>
                  <td className="border px-4 py-2">{b.userEmail || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {historicalBookings.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No historical bookings found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllBookings;