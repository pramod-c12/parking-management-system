const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slot.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { Slot, Booking } = require('../models');
const { Op } = require('sequelize');

// ✅ Only static slot metadata
router.get('/', slotController.getAllSlots);
router.get('/available', authMiddleware, slotController.getAvailableSlots);


module.exports = router;
