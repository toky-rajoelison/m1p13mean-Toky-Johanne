const mongoose = require('mongoose');

const UtilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mot_de_passe: { type: String, required: true },
  telephone: { type: String },
  statut: { type: Number, enum: [1,2], default: 1 }, // 1=actif, 2=bloqué
  datetime_creation: { type: Date, default: Date.now },

  id_role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true }
});

module.exports = mongoose.model('Utilisateur', UtilisateurSchema);