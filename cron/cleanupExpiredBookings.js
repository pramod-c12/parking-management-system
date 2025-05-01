const cron = require('node-cron');
const { Booking } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

const runCleanupJob = async () => {
  try {
    const now = moment();
    const today = now.format('YYYY-MM-DD');
    const currentTime = now.format('HH:mm');

    const deleted = await Booking.destroy({
      where: {
        [Op.or]: [
          { date: { [Op.lt]: today } },
          { date: today, endTime: { [Op.lt]: currentTime } },
        ]
      }
    });

    if (deleted > 0) {
      console.log(`[CRON] ✅ Deleted ${deleted} expired bookings`);
    } else {
      console.log(`[CRON] No expired bookings to delete`);
    }
  } catch (err) {
    console.error('[CRON] Cleanup failed:', err.message);
  }
};

// Only schedule if not in test environment
if (process.env.NODE_ENV !== 'test') {
  cron.schedule('0 0 * * *', () => {
    console.log('[CRON] Running expired bookings cleanup...');
    runCleanupJob();
  });
}

module.exports = runCleanupJob;
