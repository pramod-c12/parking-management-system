const { Booking, Slot, User, BookingHistory } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment'); // make sure you installed this
const sendEmail = require('../utils/sendEmail');
const { sequelize } = require('../models');

// View all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const currentBookings = await Booking.findAll({
      include: [
        { model: User, as: 'user', attributes: ['email'] },
        { model: Slot, as: 'slot', attributes: ['slotNumber'] },
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']],
    });

    const historicalBookings = await BookingHistory.findAll({
      order: [['date', 'DESC'], ['startTime', 'DESC']],
    });

    res.status(200).json({
      currentBookings,
      historicalBookings,
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Error fetching bookings.' });
  }
};


// View all slots
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.findAll({ order: [['slotNumber', 'ASC']] });
    res.json({ slots });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots', message: err.message });
  }
};

// Add a new slot (you already have this)
exports.addSlot = async (req, res) => {
  try {
    const { slotNumber } = req.body;
    const slotRegex = /^[A-Z]\d{1,2}$/i;
    if (!slotNumber || !slotRegex.test(slotNumber)) {
      return res.status(400).json({ message: 'slotNumber is required and must be in format like A1, B2, etc.' });
    }

    const exists = await Slot.findOne({ where: { slotNumber } });
    if (exists) {
      return res.status(409).json({ message: 'Slot with this number already exists' });
    }

    const slot = await Slot.create({ slotNumber });
    res.status(201).json({ message: 'Slot added successfully', slot });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add slot', message: err.message });
  }
};

// Delete slot (already in your code, modified to check for bookings)
exports.deleteSlot = async (req, res) => {
  try {
    const { slotId } = req.params;

    const slot = await Slot.findByPk(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    const existingBookings = await Booking.findOne({ where: { slotId } });
    if (existingBookings) {
      return res.status(400).json({ message: 'Cannot delete slot with existing bookings' });
    }

    await slot.destroy();
    res.json({ message: 'Slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete slot', message: err.message });
  }
};

// 🧼 Delete expired bookings (manual cleanup)
exports.cleanupExpiredBookings = async (req, res) => {
  try {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);

    const expiredBookings = await Booking.findAll({
      where: {
        [Op.or]: [
          { date: { [Op.lt]: currentDate } },
          {
            [Op.and]: [
              { date: currentDate },
              { endTime: { [Op.lte]: currentTime } },
            ],
          },
        ],
      },
      include: [
        { model: Slot, as: 'slot', attributes: ['slotNumber'] },
        { model: User, as: 'user', attributes: ['email'] },
      ],
    });

    if (expiredBookings.length === 0) {
      return res.status(200).json({ message: 'No expired bookings found.' });
    }

    // Prepare historical data
    const historyData = expiredBookings.map((booking) => ({
      userId: booking.userId,
      slotId: booking.slotId,
      slotNumber: booking.slot?.slotNumber || 'N/A',
      userEmail: booking.user?.email || 'N/A',
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      carNumber: booking.carNumber,
      carType: booking.carType,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    // Move to BookingHistory and delete from Bookings
    await sequelize.transaction(async (t) => {
      await BookingHistory.bulkCreate(historyData, { transaction: t });
      await Booking.destroy({
        where: {
          id: expiredBookings.map((b) => b.id),
        },
        transaction: t,
      });
    });

    res.status(200).json({
      message: `${expiredBookings.length} expired bookings moved to history.`,
    });
  } catch (err) {
    console.error('Cleanup error:', err);
    res.status(500).json({ message: 'Error during cleanup.' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: Slot, as: 'slot', attributes: ['slotNumber'] },
        { model: User, as: 'user', attributes: ['email'] },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    const historyData = {
      userId: booking.userId,
      slotId: booking.slotId,
      slotNumber: booking.slot?.slotNumber || 'N/A',
      userEmail: booking.user?.email || 'N/A',
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      carNumber: booking.carNumber,
      carType: booking.carType,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };

    await sequelize.transaction(async (t) => {
      await BookingHistory.create(historyData, { transaction: t });
      await booking.destroy({ transaction: t });
    });

    // Send email notification
    try {
      await sendEmail({
        to: booking.user?.email,
        subject: 'Your Parking Booking Has Been Cancelled',
        text: `Dear User,\n\nYour booking for slot ${booking.slot?.slotNumber || 'N/A'} on ${booking.date} from ${booking.startTime} to ${booking.endTime} has been cancelled by an admin.\n\nThank you,\nParkMate Team`,
      });
    } catch (emailErr) {
      console.error('Failed to send notification email:', emailErr);
      // Continue despite email failure to ensure booking is deleted
    }

    res.status(200).json({ message: 'Booking deleted and moved to history.' });
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Error deleting booking.' });
  }
};