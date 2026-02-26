const mongoose = require('mongoose');

const ProduitBoutiqueSchema = new mongoose.Schema({
  id_produit: { type: mongoose.Schema.Types.ObjectId, ref: "Produit", required: true },
  id_boutique: { type: mongoose.Schema.Types.ObjectId, ref: "Boutique", required: true },
  stock: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  statut: { type: Number, enum: [1,2], required: true }, // 1=actif, 2=inactive
  description: { type: String },
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Produit_Boutique', ProduitBoutiqueSchema);