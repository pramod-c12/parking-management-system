import React, { useState } from 'react';
import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_URL || 'https://parking-management-system-6t4i.onrender.com';

const CleanupButton = () => {
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleCleanup = () => {
    axios
      .delete(`${BASE_URL}/admin/cleanup`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMessage(res.data.message || 'Cleanup successful');
        setTimeout(() => setMessage(''), 5000); // Auto-dismiss after 5s
        setConfirming(false);
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || 'Cleanup failed');
        setTimeout(() => setMessage(''), 5000); // Auto-dismiss after 5s
        setConfirming(false);
      });
  };

  return (
    <div className="mt-4">
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
        >
          🧼 Clean Expired Bookings
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <span className="text-gray-700">Confirm cleanup?</span>
          <button
            onClick={handleCleanup}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Yes
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}
      {message && (
        <div
          className={`mt-3 p-3 rounded text-center ${
            message.includes('failed')
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default CleanupButton;
