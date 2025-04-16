require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./models'); // Your DB connection logic
const authRoutes = require('./routes/auth.routes');
const slotRoutes = require('./routes/slot.routes');
const bookingRoutes = require('./routes/booking.routes'); // 🆕 Add this
const seedSlots = require('./seedSlots'); // Import the seed script
const adminRoutes = require('./routes/admin.routes');


const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/slots', slotRoutes);
app.use('/bookings', bookingRoutes); // 🆕 Mount booking routes
app.use('/admin', adminRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Parking Management System API is running...');
});

// Connect to DB and seed
connectDB().then(async () => {
  console.log('Database connected and synced!');
  await seedSlots(); // Only if slots table needs to be populated once
  require('./cron/cleanupExpiredBookings'); // ✅ Start the cleanup cron after DB is ready
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
