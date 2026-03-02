const mongoose = require('mongoose');

const AnnonceSchema = new mongoose.Schema({
  target: {
    type: String,
    enum: ['PUBLIC', 'PRIVATE'],
    required: true
  },
  id_utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  datetime_annonce: {
    type: Date,
    default: Date.now
  },
  contenu: {
    type: String,
    required: true
  },
  photo: {
    type: String, // optional, URL or base64
    default: ''
  }
});

module.exports = mongoose.model('Annonce', AnnonceSchema, 'annonces');