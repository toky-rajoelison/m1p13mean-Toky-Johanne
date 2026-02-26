const mongoose = require('mongoose');

const SousCategorieSchema = new mongoose.Schema({
  nom: { type: String },
  id_categorie: { type: mongoose.Schema.Types.ObjectId, ref: "Categorie_Produit", required: true }
});

module.exports = mongoose.model('Sous_Categorie', SousCategorieSchema);