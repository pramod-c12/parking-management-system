import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
const BASE_URL = process.env.REACT_APP_API_URL || 'https://parking-management-system-6t4i.onrender.com';

const timeRanges = [
  { label: '9:00 AM - 11:00 AM', start: '09:00', end: '11:00' },
  { label: '11:00 AM - 1:00 PM', start: '11:00', end: '13:00' },
  { label: '1:00 PM - 3:00 PM', start: '13:00', end: '15:00' },
  { label: '3:00 PM - 5:00 PM', start: '15:00', end: '17:00' },
];

const Slots = () => {
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [carNumber, setCarNumber] = useState('');
  const [carType, setCarType] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  // Filter time ranges based on today's date
  const getAvailableTimeRanges = () => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      const currentTime = new Date();
      return timeRanges.filter(range => {
        const [startHours, startMinutes] = range.start.split(':').map(Number);
        const rangeStart = new Date();
        rangeStart.setHours(startHours, startMinutes, 0, 0);
        return rangeStart > currentTime;
      });
    }
    return timeRanges;
  };

  useEffect(() => {
    if (date && selectedTime) {
      const selectedRange = timeRanges.find(t => t.label === selectedTime);
      if (!selectedRange) return;

      axios
        .get(`${BASE_URL}/slots/available`, {
          params: {
            date,
            start: selectedRange.start,
            end: selectedRange.end,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          const sortedSlots = (res.data.availableSlots || []).sort((a, b) => {
            const aNum = parseInt(a.slotNumber.replace(/\D/g, ''), 10);
            const bNum = parseInt(b.slotNumber.replace(/\D/g, ''), 10);
            return aNum - bNum;
          });
          setAvailableSlots(sortedSlots);
        })
        .catch(err => {
          console.error(err);
          setAvailableSlots([]);
          setError('Failed to fetch available slots. Please try again.');
        });
    }
  }, [date, selectedTime, token]);

  const handleCarNumberChange = (e) => {
    const input = e.target.value.toUpperCase();
    setCarNumber(input);
  };

  const handleBooking = () => {
    setError('');
    setMessage('');

    const carNumberPattern = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;

    if (!date || !selectedTime || !selectedSlot || !carNumber || !carType) {
      setError('Please fill in all fields before booking.');
      return;
    }

    if (!carNumberPattern.test(carNumber)) {
      setError('Invalid car number format. Example: MH12AB1234');
      return;
    }

    const selectedRange = timeRanges.find(t => t.label === selectedTime);
    if (!selectedRange) {
      setError('Invalid time range selected.');
      return;
    }

    axios
      .post(
        `${BASE_URL}/bookings/book`,
        {
          date,
          slotId: selectedSlot.id,
          startTime: selectedRange.start,
          endTime: selectedRange.end,
          carNumber,
          carType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => {
        setMessage(res.data.message || 'Booking confirmed ✅');
        setSelectedSlot(null);
        setCarNumber('');
        setCarType('');
        setSelectedTime('');
        setDate('');
        setAvailableSlots([]);
      })
      .catch(err => {
        console.error(err);
        const errorMessage = err.response?.data?.message || 'Booking failed. Please try again.';
        setError(errorMessage);
      });
  };

  const availableTimeRanges = getAvailableTimeRanges();

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Book a Slot</h1>

        {/* Date & Time selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-gray-600 mb-2">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-2">Select Time</label>
            <select
              value={selectedTime}
              onChange={e => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm"
            >
              <option value="">-- Choose Time Slot --</option>
              {availableTimeRanges.map((range, index) => (
                <option key={index} value={range.label}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Available Slots */}
        {availableSlots.length > 0 && (
          <>
            <h2 className="text-lg font-medium text-gray-700 mb-3">Available Slots</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
              {availableSlots.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`h-16 rounded-lg text-sm font-semibold transition flex items-center justify-center border-2 ${
                    selectedSlot?.id === slot.id
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-100 hover:bg-blue-100 border-gray-300'
                  }`}
                >
                  {slot.slotNumber}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Car Details */}
        {selectedSlot && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-2">Car Number</label>
              <input
                type="text"
                value={carNumber}
                onChange={handleCarNumberChange}
                placeholder="e.g. MH12AB1234"
                className="w-full px-3 py-2 border border-gray-300 rounded uppercase shadow-sm"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-2">Car Type</label>
              <select
                value={carType}
                onChange={e => setCarType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm"
              >
                <option value="">-- Select Car Type --</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Minivan">Minivan</option>
                <option value="Electric Car">Electric Car</option>
              </select>
            </div>
          </div>
        )}

        {/* Booking Button */}
        {selectedSlot && (
          <button
            onClick={handleBooking}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition shadow-sm"
          >
            Confirm Booking
          </button>
        )}

        {/* Messages */}
        {message && (
          <div className="mt-6 p-4 bg-green-100 text-green-800 rounded shadow">{message}</div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-100 text-red-800 rounded shadow">{error}</div>
        )}
      </div>
    </>
  );
};

export default Slots;