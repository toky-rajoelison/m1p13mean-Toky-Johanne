const mongoose = require('mongoose');

const adminBoutiqueSchema = new mongoose.Schema({
  id_utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  id_boutique: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  last_updated: Date
});

module.exports = mongoose.model('Admin_Boutique', adminBoutiqueSchema, 'admin_boutique');