const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slot.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', slotController.getAllSlots);
router.post('/book/:slotId', authMiddleware, slotController.bookSlot);
router.post('/cancel/:slotId', authMiddleware, slotController.cancelBooking);
router.get('/my-bookings', authMiddleware, slotController.getMyBookedSlots);


module.exports = router;
