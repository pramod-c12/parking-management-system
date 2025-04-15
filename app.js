require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./models');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 5000;
const slotRoutes = require('./routes/slot.routes');

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.use('/slots', slotRoutes);

app.get('/', (req, res) => {
  res.send('Parking Management System API is running...');
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
