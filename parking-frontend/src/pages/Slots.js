// src/pages/Slots.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Slots = () => {
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [bookingSlotId, setBookingSlotId] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    carNumber: '',
    carType: '',
    durationHours: 1,
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const res = await axios.get('http://localhost:5000/slots', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSlots(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Error fetching slots');
    }
  };

  const handleInputChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });
  };

  const handleBookClick = (slotId) => {
    setBookingSlotId(slotId); // Show form only for this slot
    setMessage('');
    setBookingForm({ carNumber: '', carType: '', durationHours: 1 });
  };

  const handleBookingSubmit = async () => {
    const carNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

    if (!carNumberRegex.test(bookingForm.carNumber)) {
      setMessage('Invalid Car Number format. Use: KA01AB1234');
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/slots/book/${bookingSlotId}`,
        bookingForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Slot booked successfully!');
      setBookingSlotId(null);
      fetchSlots(); // Refresh list
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Available Slots</h2>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      <ul>
        {slots.map((slot) => (
          <li key={slot.id} style={{ marginBottom: '10px' }}>
            {slot.slotNumber} - {slot.isAvailable ? 'Available' : 'Booked'}
            {slot.isAvailable && (
              <>
                {bookingSlotId === slot.id ? (
                  <div style={{ marginTop: '10px' }}>
                    <input
                      type="text"
                      name="carNumber"
                      placeholder="Car Number (e.g., KA01AB1234)"
                      value={bookingForm.carNumber}
                      onChange={handleInputChange}
                    /><br />
                    <select
                      name="carType"
                      value={bookingForm.carType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Car Type</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Minivan">Minivan</option>
                      <option value="Electric Car">Electric Car</option>
                    </select><br />
                    <select
                      name="durationHours"
                      value={bookingForm.durationHours}
                      onChange={handleInputChange}
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} Hour(s)</option>
                      ))}
                    </select><br />
                    <button onClick={handleBookingSubmit}>Confirm Booking</button>
                    <button onClick={() => setBookingSlotId(null)} style={{ marginLeft: '10px' }}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button style={{ marginLeft: '10px' }} onClick={() => handleBookClick(slot.id)}>
                    Book
                  </button>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Slots;
