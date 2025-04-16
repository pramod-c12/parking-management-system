const { Slot, Booking } = require('../models');
const { Op } = require('sequelize');

exports.getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.findAll({
      attributes: ['id', 'slotNumber']
    });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots', message: err.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date, start, end } = req.query;

    if (!date || !start || !end) {
      return res.status(400).json({ message: 'Date, start time and end time are required' });
    }

    const bookings = await Booking.findAll({
      where: {
        date,
        startTime: { [Op.lt]: end },  // booking starts before requested end
        endTime: { [Op.gt]: start }   // booking ends after requested start
      },
      attributes: ['slotId']
    });

    const bookedSlotIds = bookings.map(b => b.slotId);

    const availableSlots = await Slot.findAll({
      where: {
        id: { [Op.notIn]: bookedSlotIds }
      },
      order: [['slotNumber', 'ASC']]
    });

    res.json({ availableSlots });
  } catch (err) {
    console.error('Slot fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch available slots', message: err.message });
  }
};

