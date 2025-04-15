const { Slot, User } = require('../models');

exports.getAllSlots = async (req, res) => {
  const slots = await Slot.findAll();
  res.json(slots);
};

exports.bookSlot = async (req, res) => {
  const { slotId } = req.params;
  const { carNumber, carType, durationHours } = req.body;

  // Validate car number format
  const carNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/;
  if (!carNumberRegex.test(carNumber)) {
    return res.status(400).json({ message: 'Invalid car number format' });
  }

  // Validate car type
  const validCarTypes = ['Sedan', 'SUV', 'Coupe', 'Hatchback', 'Minivan', 'Electric Car'];
  if (!validCarTypes.includes(carType)) {
    return res.status(400).json({ message: 'Invalid car type' });
  }

  // Validate duration
  if (!durationHours || durationHours < 1 || durationHours > 12) {
    return res.status(400).json({ message: 'Duration must be between 1 and 12 hours' });
  }

  const slot = await Slot.findByPk(slotId);
  if (!slot || !slot.isAvailable) {
    return res.status(400).json({ message: 'Slot unavailable' });
  }

  slot.isAvailable = false;
  slot.bookedBy = req.user.id;
  slot.bookedAt = new Date();
  slot.carNumber = carNumber;
  slot.carType = carType;
  slot.durationHours = durationHours;

  await slot.save();

  res.json({ message: 'Slot booked successfully', slot });
};

exports.cancelBooking = async (req, res) => {
  const { slotId } = req.params;

  const slot = await Slot.findByPk(slotId);
  if (!slot || slot.isAvailable) {
    return res.status(400).json({ message: 'Slot not booked' });
  }

  // Optional: Ensure only the user who booked can cancel
  if (slot.bookedBy !== req.user.id) {
    return res.status(403).json({ message: 'Unauthorized to cancel this slot' });
  }

  slot.isAvailable = true;
  slot.bookedBy = null;
  slot.bookedAt = null;
  await slot.save();

  res.json({ message: 'Booking cancelled', slot });
};

exports.getMyBookedSlots = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const slots = await Slot.findAll({
        where: { bookedBy: userId },
        attributes: ['id', 'slotNumber', 'isAvailable', 'bookedAt'],
      });
  
      res.json({ slots }); // ✅ Wrap in object
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch booked slots', message: error.message });
    }
};
  
