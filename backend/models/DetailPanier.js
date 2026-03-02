const mongoose = require('mongoose');

const DetailPanierSchema = new mongoose.Schema({
  id_produit_boutique: { type: mongoose.Schema.Types.ObjectId, ref: "Produit_Boutique", required: true },
  quantite: { type: Number, required: true, min: 0 },
  id_panier: { type: mongoose.Schema.Types.ObjectId, ref: "Panier", required: true },
  datetime_added: { type: Date, default: Date.now },
  shipping_fee: { type: Number, default: 0 },
  price_per_item: { type: Number, required: true }
});

module.exports = mongoose.model('DetailPanier', DetailPanierSchema, 'detail_panier');