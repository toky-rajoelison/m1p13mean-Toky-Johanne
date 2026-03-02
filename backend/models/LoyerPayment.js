const mongoose = require('mongoose');

const LoyerPaymentSchema = new mongoose.Schema({
  id_utilisateur_centre: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  id_boutique: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique', required: true },
  description: { type: String },
  datetime_payment: { type: Date, required: true, default: Date.now },
  month: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  amount: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('LoyerPayment', LoyerPaymentSchema);