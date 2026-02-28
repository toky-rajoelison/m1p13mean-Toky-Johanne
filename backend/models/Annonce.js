const mongoose = require('mongoose');

const AnnonceSchema = new mongoose.Schema({
  target: { type: String, required: true },
  id_utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
  datetime_annonce: { type: Date, default: Date.now },
  photo: { type: String }
});

module.exports = mongoose.model('Annonce', AnnonceSchema);