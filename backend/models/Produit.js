const mongoose = require('mongoose');

const ProduitSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  id_sous_categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Sous_Categorie", required: true },
  last_updated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Produit', ProduitSchema);