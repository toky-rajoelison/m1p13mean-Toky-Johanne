// routes/annonceRoutes.js
const express = require('express');
const router = express.Router();
const Annonce = require('../models/Annonce');
const Utilisateur = require('../models/Utilisateur');

// Middleware: example to get user from request (replace with your auth)
const getUser = async (req, res, next) => {
  // assume req.userId is set after login
  req.user = await Utilisateur.findById(req.userId);
  next();
};

// Create new announcement
router.post('/', getUser, async (req, res) => {
  try {
    const { target, contenu, photo } = req.body;

    // Only admin_centre or admin_boutique can create
    const roleLibelle = req.user.id_role.libelle; 
    if (!['ADMIN_CENTRE', 'ADMIN_BOUTIQUE'].includes(roleLibelle)) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const newAnnonce = new Annonce({
      target,
      contenu,
      photo,
      id_utilisateur: req.user._id
    });

    await newAnnonce.save();
    res.status(201).json(newAnnonce);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get announcements paginated (10 per page)
router.get('/', getUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    // Determine what the user can see
    const roleLibelle = req.user.id_role.libelle;

    let filter = {};
    if (roleLibelle === 'ACHETEUR') {
      filter.target = 'PUBLIC';
    } else if (['ADMIN_CENTRE', 'ADMIN_BOUTIQUE'].includes(roleLibelle)) {
      filter.target = { $in: ['PUBLIC', 'PRIVATE'] };
    }

    const annonces = await Annonce.find(filter)
      .sort({ datetime_annonce: -1 })
      .skip(skip)
      .limit(limit)
      .populate('id_utilisateur', 'nom prenom id_role');

    res.json(annonces);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;