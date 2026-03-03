const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ProduitBoutique = require('../models/ProduitBoutique');
require('../models/Produit');
require('../models/Boutique');

// ================================
// 🔹 GET - liste produits avec filtres et pagination
// ================================
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
    if (description) filter.description = { $regex: description, $options: 'i' };
    if (id_boutique && mongoose.Types.ObjectId.isValid(id_boutique)) filter.id_boutique = id_boutique;
    if (categorie && mongoose.Types.ObjectId.isValid(categorie)) filter.id_produit = categorie;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    const produits = await ProduitBoutique.find(filter)
      .populate('id_produit', 'nom')
      .populate('id_boutique', 'nom')
      .sort({ last_updated: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber)
      .lean();

    const total = await ProduitBoutique.countDocuments(filter);

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
      produits
    });

  } catch (err) {
    console.error('Erreur récupération ProduitBoutique:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ================================
// 🔹 GET - un produit spécifique
// ================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'ID invalide' });

    const produit = await ProduitBoutique.findById(id)
      .populate('id_produit', 'nom')
      .populate('id_boutique', 'nom')
      .lean();

    if (!produit) return res.status(404).json({ message: 'Produit introuvable' });

    res.json(produit);
  } catch (err) {
    console.error('Erreur GET ProduitBoutique/:id:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ================================
// 🔹 POST - créer un produit
// ================================
router.post('/', async (req, res) => {
  try {
    const { id_produit, id_boutique, description, stock, statut } = req.body;

    if (!id_produit || !id_boutique) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' });
    }

    const nouveauProduit = new ProduitBoutique({
      id_produit,
      id_boutique,
      description: description || '',
      stock: stock || 0,
      statut: statut ?? 1,
      last_updated: new Date()
    });

    await nouveauProduit.save();
    res.status(201).json({ message: 'Produit créé avec succès', produit: nouveauProduit });
  } catch (err) {
    console.error('Erreur POST ProduitBoutique:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ================================
// 🔹 PUT - modifier un produit
// ================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'ID invalide' });

    const { description, stock, statut } = req.body;

    const produit = await ProduitBoutique.findById(id);
    if (!produit) return res.status(404).json({ message: 'Produit introuvable' });

    if (description !== undefined) produit.description = description;
    if (stock !== undefined) produit.stock = stock;
    if (statut !== undefined) produit.statut = statut;
    produit.last_updated = new Date();

    await produit.save();

    res.json({ message: 'Produit mis à jour avec succès', produit });
  } catch (err) {
    console.error('Erreur PUT ProduitBoutique/:id:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'ID invalide' });

    const produit = await ProduitBoutique.findByIdAndDelete(id);
    if (!produit) return res.status(404).json({ message: 'Produit introuvable' });

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error('Erreur DELETE ProduitBoutique/:id:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;