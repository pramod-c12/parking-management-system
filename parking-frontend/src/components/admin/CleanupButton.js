import React, { useState } from 'react';
import axios from 'axios';

const CleanupButton = () => {
  const [confirming, setConfirming] = useState(false);
  const token = localStorage.getItem('token');

  const handleCleanup = () => {
    axios
      .delete('http://localhost:5000/admin/cleanup', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        alert(res.data.message);
        setConfirming(false);
      })
      .catch((err) => {
        alert(err.response?.data?.message || 'Cleanup failed');
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
    </div>
  );
};

export default CleanupButton;
