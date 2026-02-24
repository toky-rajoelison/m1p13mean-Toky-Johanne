require('dotenv').config();
const express = require('express');
const cors = require('cors');              // ✅ ADD
const connectDB = require('./config/db');

const app = express();

// ✅ CORS middleware
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json()); // parse JSON

// Connect to MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('Server running');
});

const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));