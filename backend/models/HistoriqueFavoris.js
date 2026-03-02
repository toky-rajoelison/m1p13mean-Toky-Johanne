const mongoose = require('mongoose');

const HistoriqueFavorisSchema = new mongoose.Schema({
  id_utilisateur_client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Utilisateur", 
    required: true 
  },
  id_produit_boutique: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Produit_Boutique", 
    required: true 
  },
  datetime_modif: { 
    type: Date,
    default: Date.now,
    required: true 
  },
  status: { 
    type: Number, 
    enum: [1, 2],
    required: true 
  }
});

module.exports = mongoose.model('HistoriqueFavoris', HistoriqueFavorisSchema, 'historique_favoris');