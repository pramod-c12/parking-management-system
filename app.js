require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./models');
const authRoutes = require('./routes/auth.routes');
const slotRoutes = require('./routes/slot.routes');
const bookingRoutes = require('./routes/booking.routes');
const seedSlots = require('./seedSlots');
const adminRoutes = require('./routes/admin.routes');
const cron = require('node-cron');
const { runCleanupJob } = require('./cron/cleanupExpiredBookings');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/slots', slotRoutes);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Parking Management System API is running...');
});

// Export app and startServer separately
async function startServer() {
  await connectDB();
  console.log('Database connected and synced!');
  await seedSlots();

  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });

  // Initialize and start the cron job
  const cleanupJob = cron.schedule('0 0 * * *', () => {
    console.log('[CRON] Running expired bookings cleanup...');
    runCleanupJob();
  }, {
    scheduled: false, // Don't start immediately
  });
  cleanupJob.start();

  return { server, cleanupJob };
}

// Only start the server if this file is run directly (not imported during tests)
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };