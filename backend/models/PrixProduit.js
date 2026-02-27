const mongoose = require('mongoose');

const PrixProduitSchema = new mongoose.Schema({
  id_produit_boutique: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Produit_Boutique",
    required: true
  },
  montant: {
    type: Number,
    required: true
  },
  datetime_changement: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prix_Produit', PrixProduitSchema, 'prix_produit');