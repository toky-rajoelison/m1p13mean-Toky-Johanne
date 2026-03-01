const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const DemandeCentre = require('../models/DemandeCentre');
const CommentaireDemande = require('../models/CommentaireDemande');
const Utilisateur = require('../models/Utilisateur');
const Role = require('../models/Role');
const AdminBoutique = require('../models/AdminBoutique');


// ============================
// CREATE DEMANDE (ADMIN_BOUTIQUE ONLY)
// ============================
router.post('/', async (req, res) => {
  try {
    const { id_utilisateur, description } = req.body;

    if (!id_utilisateur) {
      return res.status(400).json({ message: 'Missing user id' });
    }

    const user = await Utilisateur.findById(id_utilisateur);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const role = await Role.findById(user.id_role);
    if (!role || role.libelle !== 'ADMIN_BOUTIQUE') {
      return res.status(403).json({ message: 'Only ADMIN_BOUTIQUE can create demandes' });
    }

    // check admin_boutique relation
    const adminBoutique = await AdminBoutique.findOne({ id_utilisateur });
    if (!adminBoutique) {
      return res.status(403).json({ message: 'User is not linked to any boutique' });
    }

    const demande = new DemandeCentre({
      description,
      id_admin_boutique_utilisateur: id_utilisateur
    });

    await demande.save();

    res.status(201).json({ message: 'Demande created', demande });

  } catch (err) {
    console.error('Create demande error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ============================
// GET DEMANDES (PAGINATED)
// ============================
router.get('/', async (req, res) => {
  try {
    const { userId, page = 1, limit = 10 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user id' });
    }

    const user = await Utilisateur.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const role = await Role.findById(user.id_role);
    if (!role) return res.status(403).json({ message: 'Role not found' });

    let filter = {};

    // ADMIN_CENTRE → all demandes
    if (role.libelle === 'ADMIN_CENTRE') {
      filter = {};
    }

    // ADMIN_BOUTIQUE → only his demandes
    else if (role.libelle === 'ADMIN_BOUTIQUE') {
      filter = { id_admin_boutique_utilisateur: user._id };
    }

    else {
      return res.status(403).json({ message: 'Access denied' });
    }

    const demandes = await DemandeCentre.find(filter)
      .sort({ datetime_demande: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('id_admin_boutique_utilisateur', 'nom prenom email');

    // attach comments
    const demandesWithComments = await Promise.all(
      demandes.map(async (d) => {
        const commentaires = await CommentaireDemande.find({ id_demande: d._id })
          .sort({ datetime_commentaire: 1 })
          .populate('id_utilisateur', 'nom prenom email');

        return {
          ...d.toObject(),
          commentaires
        };
      })
    );

    const total = await DemandeCentre.countDocuments(filter);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      demandes: demandesWithComments
    });

  } catch (err) {
    console.error('Get demandes error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ============================
// ADD COMMENT TO DEMANDE
// ============================
router.post('/commentaire', async (req, res) => {
  try {
    const { id_demande, id_utilisateur, commentaire } = req.body;

    if (!id_demande || !id_utilisateur || !commentaire) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const user = await Utilisateur.findById(id_utilisateur);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const role = await Role.findById(user.id_role);
    if (!['ADMIN_CENTRE', 'ADMIN_BOUTIQUE'].includes(role.libelle)) {
      return res.status(403).json({ message: 'Not allowed to comment' });
    }

    const demande = await DemandeCentre.findById(id_demande);
    if (!demande) return res.status(404).json({ message: 'Demande not found' });

    const comment = new CommentaireDemande({
      id_demande,
      id_utilisateur,
      commentaire
    });

    await comment.save();

    res.status(201).json({ message: 'Comment added', comment });

  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;