const mongoose = require('mongoose');

// === Avis Produit ===
const AvisProduitSchema = new mongoose.Schema({
  note: { type: Number, required: true, min: 1, max: 10 },
  commentaire: { type: String },
  datetime_avis: { type: Date, required: true, default: Date.now },
  id_acheteur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  id_produit_boutique: { type: mongoose.Schema.Types.ObjectId, ref: "Produit_Boutique", required: true }
});

module.exports = mongoose.model('Avis_Produit', AvisProduitSchema, 'avis_produit');
