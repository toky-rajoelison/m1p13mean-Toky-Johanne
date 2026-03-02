const mongoose = require('mongoose');

const LoyerEmplacementSchema = new mongoose.Schema({
  emplacement: { type: Number, required: true, unique: true }, // unique ensures one loyer per emplacement
  montant: { type: Number, required: true },
  date_debut: { type: Date, required: true } // the date this loyer amount becomes effective
});

module.exports = mongoose.model('LoyerEmplacement', LoyerEmplacementSchema);