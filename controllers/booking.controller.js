const { Booking, Slot, BookingHistory } = require('../models');
const { Op } = require('sequelize');

exports.bookSlot = async (req, res) => {
  try {
    const { slotId, date, startTime, endTime, carNumber, carType } = req.body;
    const userId = req.user.id;

    // Validate car number
    const carNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
    if (!carNumberRegex.test(carNumber)) {
      return res.status(400).json({ message: 'Invalid car number format' });
    }

    const validCarTypes = ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Minivan', 'Electric Car'];
    if (!validCarTypes.includes(carType)) {
      return res.status(400).json({ message: 'Invalid car type' });
    }

    // Validate date range
    const today = new Date();
    const bookingDate = new Date(date);
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);

    if (bookingDate < today || bookingDate > oneWeekLater) {
      return res.status(400).json({ message: 'Booking must be within the next 7 days' });
    }

    // Check for overlap
    const overlap = await Booking.findOne({
      where: {
        slotId,
        date,
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime }
          }
        ]
      }
    });

    if (overlap) {
      return res.status(409).json({ message: 'Slot already booked for this time range' });
    }

    // Create booking
    const booking = await Booking.create({
      slotId,
      userId,
      date,
      startTime,
      endTime,
      carNumber,
      carType
    });

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (err) {
    res.status(500).json({ error: 'Booking failed', message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const bookings = await Booking.findAll({
        where: { userId },
        include: [
          {
            model: Slot,
            as: 'slot', // 🛠️ Match the alias used in the association
            attributes: ['slotNumber']
          }
        ]
      });
  
      res.json({ bookings });
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch bookings', message: err.message });
    }
};

exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    const booking = await Booking.findOne({ where: { id: bookingId, userId } });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    await booking.destroy();
    res.json({ message: 'Booking canceled successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking', message: err.message });
  }
};

exports.getMyBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const currentBookings = await Booking.findAll({
      where: { userId },
      include: [{ model: Slot, as: 'slot', attributes: ['slotNumber'] }],
      order: [['date', 'ASC'], ['startTime', 'ASC']],
    });

    const historicalBookings = await BookingHistory.findAll({
      where: { userId },
      order: [['date', 'DESC'], ['startTime', 'DESC']],
    });

    res.status(200).json({
      currentBookings,
      historicalBookings,
    });
  } catch (err) {
    console.error('Error fetching booking history:', err);
    res.status(500).json({ message: 'Error fetching booking history.' });
  }
};

exports.getUserBookingStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Total bookings per month
    const bookingsPerMonth = await Promise.all(
      Array.from({ length: 13 }, (_, i) => {
        const monthStart = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
        const monthEnd = new Date(startDate.getFullYear(), startDate.getMonth() + i + 1, 0);
        return Booking.count({
          where: {
            userId,
            date: { [Op.between]: [monthStart, monthEnd] },
          },
        }).then((currentCount) =>
          BookingHistory.count({
            where: {
              userId,
              date: { [Op.between]: [monthStart, monthEnd] },
            },
          }).then((historyCount) => ({
            month: monthStart.toLocaleString('default', { month: 'short', year: 'numeric' }),
            count: currentCount + historyCount,
          }))
        );
      })
    );

    // Car types booked
    const carTypes = await Promise.all(
      ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Minivan', 'Electric Car'].map((type) =>
        Booking.count({
          where: { userId, carType: type },
        }).then((currentCount) =>
          BookingHistory.count({
            where: { userId, carType: type },
          }).then((historyCount) => ({
            type,
            count: currentCount + historyCount,
          }))
        )
      )
    );

    res.status(200).json({
      bookingsPerMonth,
      carTypes: carTypes.filter((c) => c.count > 0), // Only include types with bookings
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ message: 'Error fetching statistics.' });
  }
};
