const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ProduitBoutique = require('../models/ProduitBoutique');

require('../models/Produit');
require('../models/Boutique');

router.get('/', async (req, res) => {
  try {
    const {
      id_boutique,
      page = 1,
      limit = 10,
      categorie,
      description
    } = req.query;

    let filter = {};
    const id_produit = categorie;

    // ✅ Filtre description (string → regex OK)
    if (description) {
      filter.description = { $regex: description, $options: 'i' };
    }

    // ✅ Filtre id_boutique (ObjectId)
    if (id_boutique) {
      if (!mongoose.Types.ObjectId.isValid(id_boutique)) {
        return res.status(400).json({ message: 'id_boutique invalide' });
      }

      filter.id_boutique = new mongoose.Types.ObjectId(id_boutique);
    }
    if (id_produit) {
      if (!mongoose.Types.ObjectId.isValid(id_produit)) {
        return res.status(400).json({ message: 'id_produit invalide' });
      }

      filter.id_produit = new mongoose.Types.ObjectId(id_produit);
    }

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const produits = await ProduitBoutique.find(filter)
      .populate('id_produit', 'nom')
      .populate('id_boutique', 'nom')
      .sort({ last_updated: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    const produitsFiltres = categorie
      ? produits.filter(p => p.id_produit !== null)
      : produits;

    const total = await ProduitBoutique.countDocuments(filter);

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      produits: produitsFiltres
    });

  } catch (err) {
    console.error('Erreur récupération ProduitBoutique:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;