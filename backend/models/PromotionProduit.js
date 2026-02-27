const mongoose = require('mongoose');

// === Produit_Promotion ===
const ProduitPromotionSchema = new mongoose.Schema({
  id_produit_boutique: { type: mongoose.Schema.Types.ObjectId, ref: "Produit_Boutique", required: true },
  id_promotion: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion", required: true },
  datetime_added: { type: Date, default: Date.now, required: true }
});

module.exports = mongoose.model('Produit_Promotion', ProduitPromotionSchema, 'produit_promotion');