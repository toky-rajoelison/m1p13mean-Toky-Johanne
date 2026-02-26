const mongoose = require('mongoose');

const BoutiqueSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: { type: String },
  id_categorie_boutique: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie_Boutique", required: true },
  etage: { type: Number, required: true },
  emplacement: { type: Number, required: true },
  telephone: { type: String },
  email: { type: String, required: true },
  logo: { type: String },
  statut: { type: mongoose.Schema.Types.ObjectId, ref: "Statut", required: true },
  id_centre: { type: mongoose.Schema.Types.ObjectId, ref: "Centre_Commercial" },
  datetime_added: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Boutique', BoutiqueSchema);