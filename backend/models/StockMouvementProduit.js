const mongoose = require('mongoose');

const StockMouvementProduitSchema = new mongoose.Schema({
  id_produit_boutique: { type: mongoose.Schema.Types.ObjectId, ref: "Produit_Boutique", required: true },
  mouvement: { type: Number, enum: [1,2], required: true }, // 1=in, 2=out
  nb_produit: { type: Number, required: true, min: 0 },
  datetime_mouvement: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stock_Mouvement_Produit', StockMouvementProduitSchema);