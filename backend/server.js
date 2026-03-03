require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// ✅ CORS FIRST
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://m1p13mean-toky-johanne-pqc0.onrender.com'
  ],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// ================= API ROUTES =================

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

// ================= SERVE ANGULAR =================

// Serve static Angular files
app.use(express.static(path.join(__dirname, '../frontend-mean/dist/browser')));

// Catch all non-API routes and send index.html
app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '../frontend-mean/dist/browser/index.html'));
});

// ================= START SERVER =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));