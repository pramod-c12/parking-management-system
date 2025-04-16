import React, { useState, useRef } from 'react';
import axios from 'axios';

const AddSlotForm = () => {
  const [slotNumber, setSlotNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const token = localStorage.getItem('token');
  const inputRef = useRef(null);

  const handleAdd = () => {
    setMessage('');
    setIsError(false);

    const slotRegex = /^[A-Z]\d{1,2}$/i;
    if (!slotNumber.trim() || !slotRegex.test(slotNumber)) {
      setMessage('Invalid format. Use A1, B2, etc.');
      setIsError(true);
      return;
    }

    axios
      .post(
        'http://localhost:5000/admin/slots',
        { slotNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setMessage('Slot added successfully ✅');
        setIsError(false);
        setSlotNumber('');
        inputRef.current?.focus();
      })
      .catch((err) => {
        setMessage(err.response?.data?.message || 'Error adding slot');
        setIsError(true);
      });
  };

  return (
    <div className="bg-white p-4 shadow rounded-md mt-4">
      <h2 className="text-2xl font-semibold mb-3 text-gray-800">Add New Slot</h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <input
          ref={inputRef}
          type="text"
          value={slotNumber}
          onChange={(e) => setSlotNumber(e.target.value.toUpperCase())}
          placeholder="e.g. A1"
          className="px-4 py-2 border border-gray-300 rounded w-40 uppercase"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
        >
          Add
        </button>
      </div>
      {message && (
        <p className={`mt-3 text-sm ${isError ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AddSlotForm;
