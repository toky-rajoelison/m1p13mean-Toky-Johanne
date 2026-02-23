require('dotenv').config(); // read .env
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json()); // parse JSON

// Connect to MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('Server running');
});

const PORT = process.env.PORT || 5000;s

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));