const mongoose = require('mongoose');

const DemandeCentreSchema = new mongoose.Schema({
  description: {
    type: String,
    required: false
  },

  id_admin_boutique_utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },

  datetime_demande: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('DemandeCentre', DemandeCentreSchema);