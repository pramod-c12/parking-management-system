const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// 📌 Protected routes
router.post('/book', authMiddleware, bookingController.bookSlot);
router.get('/my-bookings', authMiddleware, bookingController.getMyBookings);
router.delete('/:bookingId', authMiddleware, bookingController.cancelBooking);

module.exports = router;
