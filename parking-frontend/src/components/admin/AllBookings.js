import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get('http://localhost:5000/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Bookings</h2>
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
            {bookings.map((b) => (
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
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default AllBookings;
