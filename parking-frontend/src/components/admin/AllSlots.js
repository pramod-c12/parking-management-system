import React, { useEffect, useState } from 'react';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL || 'https://parking-management-system-6t4i.onrender.com';

const AllSlots = () => {
  const [slots, setSlots] = useState([]);
  const [confirmId, setConfirmId] = useState(null); // 🆕 track which slot we're confirming
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/slots`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const sortedSlots = res.data.slots.sort((a, b) => {
          const numA = parseInt(a.slotNumber.match(/\d+/)?.[0]);
          const numB = parseInt(b.slotNumber.match(/\d+/)?.[0]);
          return numA - numB;
        });
        setSlots(sortedSlots);
      })
      .catch((err) => console.error(err));
  }, [token]);
  

  const deleteSlot = (id) => {
    axios
      .delete(`${BASE_URL}/admin/slots/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSlots((prev) => prev.filter((s) => s.id !== id));
        setConfirmId(null);
      })
      .catch((err) => alert(err.response?.data?.message || 'Error deleting slot'));
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Slots</h2>
      {slots.length === 0 ? (
        <p className="text-gray-500">No slots available.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="bg-gray-100 px-4 py-2 rounded relative flex flex-col items-start justify-between"
            >
              <span className="font-medium text-gray-700">{slot.slotNumber}</span>

              {confirmId === slot.id ? (
                <div className="mt-2 flex gap-2 text-sm">
                  <button
                    onClick={() => deleteSlot(slot.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="bg-gray-300 text-gray-800 px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(slot.id)}
                  className="text-red-500 text-sm mt-2 hover:underline"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllSlots;
