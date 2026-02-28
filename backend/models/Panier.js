const mongoose = require('mongoose');

const PanierSchema = new mongoose.Schema({
  id_utilisateur_client: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  datetime_creation: { type: Date, default: Date.now, required: true },
  last_updated: { type: Date, default: Date.now, required: true },
  statut: { type: Number, enum: [1,2,3,4], required: true }, // 1=en cours, 2=confirmé, 3=paye, 4=livré
  prix_total: { type: Number, default: 0 },
  mode_paiement: { type: Number, enum: [1,2], required: true }, // 1=CB, 2=Cash
  type_livraison: { type: Number, enum: [1,2], required: true } // 1=standard, 2=express
});

module.exports = mongoose.model('Panier', PanierSchema, 'panier');