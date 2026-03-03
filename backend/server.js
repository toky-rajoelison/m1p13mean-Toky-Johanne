require('dotenv').config();
const express = require('express');
const cors = require('cors');              // ✅ ADD
const connectDB = require('./config/db');

const app = express();

// ✅ CORS middleware
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://m1p13mean-toky-johanne-pqc0.onrender.com'
  ],
  credentials: true
}));

app.use(express.json()); // parse JSON

// Connect to MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('Server running');
});

const PORT = process.env.PORT;

const authRoutes = require('./routes/auth');
const boutiqueRoutes = require('./routes/boutique');
const promotionRoutes = require('./routes/promotion');
const commandesRoutes = require('./routes/commandes');
const annonceRoutes = require('./routes/annonces');
const loyerRoutes = require('./routes/loyer');
const demandeRoutes = require('./routes/demande');
const facturesRoutes = require('./routes/factures');
const typeChargesRoutes = require('./routes/typeCharges');
const produitBoutiqueRoutes = require('./routes/produitBoutique');
const categorieRoutes = require('./routes/categorie');
const favorisRoutes = require('./routes/favoris');
const avisProduitRoutes = require('./routes/avisProduit');
const avisBoutiqueRoutes = require('./routes/avisBoutique');
const notifRoutes = require('./routes/notification');

app.use('/api/auth', authRoutes);
app.use('/api/boutique', boutiqueRoutes); 
app.use('/api/promotion', promotionRoutes);
app.use('/api/commandes', commandesRoutes);
app.use('/api/annonces', annonceRoutes);
app.use('/api/loyer', loyerRoutes);
app.use('/api/demandes', demandeRoutes);
app.use('/api/factures', facturesRoutes);
app.use('/api/typeCharges', typeChargesRoutes);
app.use('/api/produitBoutique', produitBoutiqueRoutes);
app.use('/api/categorie', categorieRoutes);
app.use('/api/favoris', favorisRoutes);
app.use('/api/avisProduit', avisProduitRoutes);
app.use('/api/avisBoutique', avisBoutiqueRoutes);
app.use('/api/notifications', notifRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));