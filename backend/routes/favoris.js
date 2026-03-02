const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const HistoriqueFavoris = require('../models/HistoriqueFavoris');


router.get('/utilisateur/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID utilisateur invalide" });
    }

    const favoris = await HistoriqueFavoris
      .find({
        id_utilisateur_client: id,
        status: 1
      })
      .populate('id_produit_boutique');

    res.json(favoris);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// ===============================
// ✅ Add produitBoutique to favorites
// ===============================
router.post('/add', async (req, res) => {
  try {
    const { id_utilisateur_client, id_produit_boutique } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id_utilisateur_client) ||
      !mongoose.Types.ObjectId.isValid(id_produit_boutique)
    ) {
      return res.status(400).json({ message: "ID invalide" });
    }

    // Vérifier si déjà en favori actif
    const existing = await HistoriqueFavoris.findOne({
      id_utilisateur_client,
      id_produit_boutique,
      status: 1
    });

    if (existing) {
      return res.status(400).json({ message: "Produit déjà en favori" });
    }

    const newFavori = new HistoriqueFavoris({
      id_utilisateur_client,
      id_produit_boutique,
      status: 1, // ajouté
      datetime_modif: new Date()
    });

    await newFavori.save();

    res.status(201).json(newFavori);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;