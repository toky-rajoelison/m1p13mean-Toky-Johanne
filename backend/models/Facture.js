const mongoose = require('mongoose');

const FactureSchema = new mongoose.Schema({
  id_boutique: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boutique',
    required: true
  },

  id_type_charge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TypeCharge',
    required: true
  },

  categorie: {
    type: String,
    enum: ['FIXE', 'VARIABLE', 'PONCTUEL'],
    required: true
  },

  mois: {
    type: Number,
    min: 1,
    max: 12,
    required: true
  },

  annee: {
    type: Number,
    required: true
  },

  montant: {
    type: Number,
    required: true
  },

  date_facturation: {
    type: Date,
    default: Date.now
  },
  
  date_echeance: {
    type: Date,
    required: true
  },

  description: {
    type: String,
    default: ''
  },

  statut: {
    type: String,
    enum: ['EN_ATTENTE', 'PAYEE', 'EN_RETARD'],
    default: 'EN_ATTENTE'
  },

  date_paiement: {
    type: Date,
    default: null
  }

});

module.exports = mongoose.model('Facture', FactureSchema, 'factures');