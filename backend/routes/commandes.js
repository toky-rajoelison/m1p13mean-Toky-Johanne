const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Panier = require('../models/Panier');
const DetailPanier = require('../models/DetailPanier');
const Utilisateur = require('../models/Utilisateur');
const ProduitBoutique = require('../models/ProduitBoutique');
const Produit = require('../models/Produit');

// ---------------------------------
// GET commandes par statut (payées/non payées) pour une boutique ou produit
// ---------------------------------
router.get('/statut/:statut', async (req, res) => {
  try {
    const { statut } = req.params;

    const paniers = await Panier.find({ statut: Number(statut) })
      .populate('id_utilisateur_client', 'nom prenom email')
      .sort({ datetime_creation: -1 });

    const commandes = await Promise.all(
      paniers.map(async panier => {
        const details = await DetailPanier.find({ id_panier: panier._id })
          .populate({
            path: 'id_produit_boutique',
            populate: { path: 'id_produit', select: 'nom description' }
          });

        return { panier, details };
      })
    );

    res.json({ total: commandes.length, commandes });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get('/:statut/produit/:idProduitBoutique', async (req, res) => {
  try {
    const { statut, idProduitBoutique } = req.params;

    const paniers = await Panier.find({ statut: Number(statut) })
      .populate('id_utilisateur_client', 'nom prenom email');

    const commandes = [];

    for (const panier of paniers) {
      const details = await DetailPanier.find({
        id_panier: panier._id,
        id_produit_boutique: idProduitBoutique
      }).populate({
        path: 'id_produit_boutique',
        populate: { path: 'id_produit', select: 'nom description' }
      });

      if (details.length > 0) {
        commandes.push({ panier, details });
      }
    }

    res.json({ total: commandes.length, commandes });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ---------------------------------
// GET détails d'une commande
// ---------------------------------
router.get('/cart/:idPanier', async (req, res) => {
  try {
    const { idPanier } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idPanier)) {
      return res.status(400).json({ message: "ID panier invalide" });
    }

    const panier = await Panier.findById(idPanier)
      .populate('id_utilisateur_client', 'nom prenom email');

    if (!panier) {
      return res.status(404).json({ message: "Panier introuvable" });
    }

    const details = await DetailPanier.find({ id_panier: panier._id })
      .populate({
        path: 'id_produit_boutique',
        populate: { path: 'id_produit', select: 'nom description' }
      });

    res.json({ panier, details });

  } catch (error) {
    console.error("💥 ERREUR GET DETAILS COMMANDE:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;