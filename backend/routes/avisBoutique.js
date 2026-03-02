const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const AvisBoutique = require('../models/AvisBoutique');
const Boutique = require('../models/Boutique');
require('../models/Utilisateur');


// ===============================
// 📝 CREER UN AVIS BOUTIQUE
// ===============================
router.post('/avis-boutique', async (req, res) => {

  console.log("=======================================");
  console.log("🔥 ROUTE POST /avis-boutique HIT");

  try {

    const { note, commentaire, id_acheteur, id_boutique } = req.body;

    console.log("📥 Données reçues :", req.body);

    // ===============================
    // ✅ Vérifications basiques
    // ===============================
    if (!note || !id_acheteur || !id_boutique) {
      return res.status(400).json({
        message: "Champs obligatoires manquants"
      });
    }

    if (note < 1 || note > 10) {
      return res.status(400).json({
        message: "La note doit être entre 1 et 10"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id_acheteur) ||
        !mongoose.Types.ObjectId.isValid(id_boutique)) {
      return res.status(400).json({
        message: "ID invalide"
      });
    }

    // ===============================
    // 🔎 Vérifier que la boutique existe
    // ===============================
    const boutique = await Boutique.findById(id_boutique);

    if (!boutique) {
      return res.status(404).json({
        message: "Boutique introuvable"
      });
    }

    // ===============================
    // 🚫 Vérifier si l'utilisateur a déjà noté
    // ===============================
    const avisExistant = await AvisBoutique.findOne({
      id_acheteur,
      id_boutique
    });

    if (avisExistant) {
      return res.status(400).json({
        message: "Vous avez déjà laissé un avis pour cette boutique"
      });
    }

    // ===============================
    // 💾 Création de l'avis
    // ===============================
    const nouvelAvis = new AvisBoutique({
      note,
      commentaire,
      id_acheteur,
      id_boutique
    });

    await nouvelAvis.save();

    console.log("✅ Avis boutique enregistré avec succès");

    res.status(201).json({
      message: "Avis boutique créé avec succès",
      avis: nouvelAvis
    });

  } catch (error) {
    console.error("💥 ERREUR SERVEUR POST /avis-boutique :", error);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }

});

module.exports = router;