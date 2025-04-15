// src/pages/MyBookings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        const res = await axios.get('http://localhost:5000/slots/my-bookings', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookedSlots(res.data.slots || []); // Safe fallback if slots is undefined
      } catch (err) {
        console.error('Failed to fetch booked slots:', err);
        setBookedSlots([]); // Fallback in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate, token]);

  const cancelBooking = async (slotId) => {
    try {
      await axios.post(`http://localhost:5000/slots/cancel/${slotId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Booking canceled successfully!');
      setBookedSlots(bookedSlots.filter(slot => slot.id !== slotId));
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      alert('Cancellation failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Booked Slots</h2>
      {loading ? (
        <p>Loading your bookings...</p>
      ) : bookedSlots.length === 0 ? (
        <p>You have no bookings.</p>
      ) : (
        <ul>
          {bookedSlots.map((slot) => (
            <li key={slot.id}>
              Slot #{slot.slotNumber} - Booked
              <button style={{ marginLeft: '10px' }} onClick={() => cancelBooking(slot.id)}>Cancel</button>
            </li>
          ))}
        </ul>
      )}
      <button style={{ marginTop: '20px' }} onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default MyBookings;
