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
const boutiqueRoutes = require('./routes/boutique');
const promotionRoutes = require('./routes/promotion');
app.use('/api/auth', authRoutes);
app.use('/api/boutique', boutiqueRoutes);
app.use('/api/promotion', promotionRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));