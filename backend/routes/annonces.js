const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Annonce = require('../models/Annonce');
const Utilisateur = require('../models/Utilisateur');
const Role = require('../models/Role'); // your roles collection
const Boutique = require('../models/Boutique');
const Notification = require('../models/Notification');

// ------------------------
// Create a new announcement
// ------------------------
// ROUTER: POST /annonces
router.post('/', async (req, res) => {
  try {
    const { id_utilisateur, target, contenu, photo } = req.body;

    // 1️⃣ Validate required fields
    if (!id_utilisateur || !target || !contenu) {
      return res.status(400).json({ message: 'Champs manquants' });
    }
    if (!['PUBLIC', 'PRIVATE'].includes(target)) {
      return res.status(400).json({ message: 'Target invalide' });
    }

    // 2️⃣ Check if user exists
    const user = await Utilisateur.findById(id_utilisateur);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    // 3️⃣ Check if user is admin
    const role = await Role.findById(user.id_role);
    if (!['ADMIN_CENTRE', 'ADMIN_BOUTIQUE'].includes(role.libelle)) {
      return res.status(403).json({ message: 'Vous n\'avez pas la permission' });
    }

    // 4️⃣ Create the annonce
    const annonce = new Annonce({
      target,
      id_utilisateur,
      contenu,
      photo: photo || ''
    });
    await annonce.save();

    // 5️⃣ Prepare notification logic
    let targetRoles = [];
    let targetBoutiques = [];

    // PUBLIC or PRIVATE target determines roles to notify
    if (target === 'PUBLIC') {
      targetRoles = ['ADMIN_CENTRE', 'ADMIN_BOUTIQUE', 'ACHETEUR'];
    } else if (target === 'PRIVATE') {
      targetRoles = ['ADMIN_CENTRE', 'ADMIN_BOUTIQUE'];
    }

    // Remove creator's role from notification
    targetRoles = targetRoles.filter(r => r !== role.libelle);

    // Determine target boutiques if annonce made by admin centre
    if (role.libelle === 'ADMIN_CENTRE') {
      const boutiques = await Boutique.find({});
      targetBoutiques = boutiques.map(b => b._id);
    }

    // If annonce made by boutique admin, notify admin centre only
    if (role.libelle === 'ADMIN_BOUTIQUE') {
      targetRoles = targetRoles.filter(r => r === 'ADMIN_CENTRE'); // only center admins
      targetBoutiques = []; // no boutique filtering needed
    }

    // 6️⃣ Create notification
    const notif = new Notification({
      type: 'ANNONCE',
      event: 'NOUVELLE_ANNONCE',
      source_user_id: id_utilisateur,
      target_roles: targetRoles,
      target_boutiques: targetBoutiques.length ? targetBoutiques : null,
      message: contenu,
      created_at: new Date()
    });

    await notif.save();

    // 7️⃣ Response
    return res.status(201).json({
      message: 'Annonce créée et notifications envoyées',
      annonce,
      notification: notif
    });

  } catch (err) {
    console.error('Erreur création annonce:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
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