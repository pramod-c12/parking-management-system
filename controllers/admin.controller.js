const { Booking, Slot, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment'); // make sure you installed this

// View all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Slot, as: 'slot', attributes: ['slotNumber'] },
        { model: User, as: 'user', attributes: ['email'] },
      ],
      order: [['date', 'ASC'], ['startTime', 'ASC']],
    });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings', message: err.message });
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
    const now = moment();
    const today = now.format('YYYY-MM-DD');
    const currentTime = now.format('HH:mm');

    const deleted = await Booking.destroy({
      where: {
        [Op.or]: [
          // Bookings in the past
          { date: { [Op.lt]: today } },

          // Bookings for today but already ended
          {
            date: today,
            endTime: { [Op.lt]: currentTime }
          }
        ]
      }
    });

    res.json({ message: `${deleted} expired bookings cleaned up.` });
  } catch (err) {
    res.status(500).json({ error: 'Cleanup failed', message: err.message });
  }
};
