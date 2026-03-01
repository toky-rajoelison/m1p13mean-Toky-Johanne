const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Annonce = require('../models/Annonce');
const Utilisateur = require('../models/Utilisateur');
const Role = require('../models/Role'); // your roles collection

// ------------------------
// Create a new announcement
// ------------------------
router.post('/', async (req, res) => {
  try {
    const { id_utilisateur, target, contenu, photo } = req.body;

    // Validate required fields
    if (!id_utilisateur || !target || !contenu) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    if (!['PUBLIC', 'PRIVATE'].includes(target)) {
      return res.status(400).json({ message: 'Target invalide' });
    }

    // Optional: check if the user exists
    const user = await Utilisateur.findById(id_utilisateur);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    // Only admins can create announcements
    const role = await Role.findById(user.id_role);
    if (!['ADMIN_CENTRE', 'ADMIN_BOUTIQUE'].includes(role.libelle)) {
      return res.status(403).json({ message: 'Vous n\'avez pas la permission' });
    }

    const annonce = new Annonce({
      target,
      id_utilisateur,
      contenu,
      photo: photo || ''
    });

    await annonce.save();
    res.status(201).json({ message: 'Annonce créée', annonce });

  } catch (err) {
    console.error('Erreur création annonce:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ------------------------------------
// Get paginated announcements for a user
// ------------------------------------
router.get('/', async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    const user = await Utilisateur.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    const role = await Role.findById(user.id_role);
    const userRole = role.libelle;

    // Build filter
    let filter = {};
    if (userRole === 'ACHETEUR') {
      filter.target = 'PUBLIC';
    } else if (['ADMIN_CENTRE', 'ADMIN_BOUTIQUE'].includes(userRole)) {
      filter.target = { $in: ['PUBLIC', 'PRIVATE'] };
    }

    const annonces = await Annonce.find(filter)
      .sort({ datetime_annonce: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('id_utilisateur', 'nom prenom email');

    const total = await Annonce.countDocuments(filter);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      annonces
    });

  } catch (err) {
    console.error('Erreur récupération annonces:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;