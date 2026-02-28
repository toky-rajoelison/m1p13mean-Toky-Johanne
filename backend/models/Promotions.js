const mongoose = require('mongoose');

// === Promotions ===
const PromotionSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  pourcentage: { type: Number, required: true, min: 1, max: 100 },
  datetime_debut: { type: Date, required: true },
  datetime_fin: { type: Date, required: true }
});

module.exports = mongoose.model('Promotion', PromotionSchema, 'promotions');
