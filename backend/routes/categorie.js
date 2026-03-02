const express = require('express');
const router = express.Router();

const CategorieProduit = require('../models/CategorieProduit');
const Produit = require('../models/Produit');

const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  try {
    const categories = await CategorieProduit.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.get('/p', async (req, res) => {
  try {
    const produits = await Produit.find();
    res.json(produits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;