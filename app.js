require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./models'); // Your DB connection logic
const authRoutes = require('./routes/auth.routes');
const seedSlots = require('./seedSlots'); // Import the seed script

const app = express();
const PORT = process.env.PORT || 5000;
const slotRoutes = require('./routes/slot.routes');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/slots', slotRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Parking Management System API is running...');
});

// Connect to DB
connectDB().then(async () => {
  console.log('Database connected and synced!');

  // Seed only after DB is ready
  await seedSlots();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
