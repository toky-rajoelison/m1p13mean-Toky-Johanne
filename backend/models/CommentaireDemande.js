const mongoose = require('mongoose');

const CommentaireDemandeSchema = new mongoose.Schema({
  id_demande: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DemandeCentre',
    required: true
  },

  id_utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },

  commentaire: {
    type: String,
    required: true
  },

  datetime_commentaire: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('CommentaireDemande', CommentaireDemandeSchema);