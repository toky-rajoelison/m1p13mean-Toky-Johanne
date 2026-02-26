const mongoose = require('mongoose');

const CategorieProduitSchema = new mongoose.Schema({
  libelle: { type: String, required: true }
});

module.exports = mongoose.model('Categorie_Produit', CategorieProduitSchema);