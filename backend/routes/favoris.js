const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const HistoriqueFavoris = require('../models/HistoriqueFavoris');
require('../models/ProduitBoutique');
require('../models/Utilisateur');


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
router.post('/toggle', async (req, res) => {
  try {
    const { id_utilisateur_client, id_produit_boutique } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id_utilisateur_client) ||
      !mongoose.Types.ObjectId.isValid(id_produit_boutique)
    ) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const existing = await HistoriqueFavoris.findOne({
      id_utilisateur_client,
      id_produit_boutique
    });

    // 🟢 Si existe
    if (existing) {

      // Toggle status
      existing.status = existing.status === 1 ? 2 : 1;
      existing.datetime_modif = new Date();

        console.log("in");
        console.log({
            id_utilisateur_client,
            id_produit_boutique,
            status: 1,
            datetime_modif: new Date()
        });
        
        await existing.save();
        
        return res.json({
            message: existing.status === 1
            ? "Ajouté aux favoris"
            : "Retiré des favoris",
            status: existing.status
        });
    }
    
    // 🔵 Si n'existe pas → créer
    const newFavori = new HistoriqueFavoris({
        id_utilisateur_client,
      id_produit_boutique,
      status: 1,
      datetime_modif: new Date()
    });
    
    console.log("out");
    console.log({
        id_utilisateur_client,
        id_produit_boutique,
        status: 1,
        datetime_modif: new Date()
    });

    await newFavori.save();

    res.status(201).json({
      message: "Ajouté aux favoris",
      status: 1
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;