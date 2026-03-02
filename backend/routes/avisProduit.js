const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const AvisProduit = require('../models/AvisProduit');
const ProduitBoutique = require('../models/ProduitBoutique');
require('../models/Utilisateur');


router.post('/', async (req, res) => {

  console.log("=======================================");
  console.log("🔥 ROUTE POST /avis-produit HIT");

  try {

    const { note, commentaire, id_acheteur, id_produit_boutique } = req.body;

    console.log("📥 Données reçues :", req.body);

    if (note === undefined || note === null || !id_acheteur || !id_produit_boutique) {
        return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    if (note < 1 || note > 10) {
      return res.status(400).json({
        message: "La note doit être entre 1 et 10"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id_acheteur) ||
        !mongoose.Types.ObjectId.isValid(id_produit_boutique)) {
      return res.status(400).json({
        message: "ID invalide"
      });
    }

    const produit = await ProduitBoutique.findById(id_produit_boutique);

    if (!produit) {
      return res.status(404).json({
        message: "Produit boutique introuvable"
      });
    }

    const avisExistant = await AvisProduit.findOne({
      id_acheteur,
      id_produit_boutique
    });

    if (avisExistant) {
      return res.status(400).json({
        message: "Vous avez déjà laissé un avis pour ce produit"
      });
    }

    const nouvelAvis = new AvisProduit({
      note,
      commentaire,
      id_acheteur,
      id_produit_boutique
    });

    await nouvelAvis.save();

    console.log("✅ Avis enregistré avec succès");

    res.status(201).json({
      message: "Avis créé avec succès",
      avis: nouvelAvis
    });

  } catch (error) {
    console.error("💥 ERREUR SERVEUR POST /avis-produit :", error);
    res.status(500).json({
      message: "Erreur serveur"
    });
  }

});

module.exports = router;