const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const adminController = require('../controllers/admin.controller');

// Admin middleware (replace with role check if needed)
const adminMiddleware = async (req, res, next) => {
  const user = req.user;
  if (!user || user.email !== 'admin@example.com') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

// Routes
router.get('/bookings', authMiddleware, adminMiddleware, adminController.getAllBookings);
router.get('/slots', authMiddleware, adminMiddleware, adminController.getAllSlots);
router.post('/slots', authMiddleware, adminMiddleware, adminController.addSlot);
router.delete('/slots/:slotId', authMiddleware, adminMiddleware, adminController.deleteSlot);
router.delete('/bookings/:bookingId', authMiddleware, adminMiddleware, adminController.deleteBooking);
// Manual cleanup of expired bookings
router.delete(
    '/cleanup',
    authMiddleware,
    adminMiddleware,
    adminController.cleanupExpiredBookings
  );
  router.get('/stats', authMiddleware, adminMiddleware, adminController.getAdminBookingStats);

module.exports = router;
