const express = require('express');
const router = express.Router();

const TypeCharge = require('../models/TypeCharge');
const Utilisateur = require('../models/Utilisateur');
const Role = require('../models/Role');

// ------------------------
// Create type charge (ADMIN_CENTRE only)
// ------------------------
router.post('/', async (req, res) => {
  try {
    const { id_utilisateur, nom, description } = req.body;

    if (!id_utilisateur || !nom) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const user = await Utilisateur.findById(id_utilisateur);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const role = await Role.findById(user.id_role);
    if (role.libelle !== 'ADMIN_CENTRE') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const exists = await TypeCharge.findOne({ nom });
    if (exists) {
      return res.status(409).json({ message: 'Type de charge déjà existant' });
    }

    const typeCharge = new TypeCharge({
      nom,
      description: description || ''
    });

    await typeCharge.save();

    res.status(201).json({ message: 'Type de charge créé', typeCharge });

  } catch (err) {
    console.error('Erreur création type charge:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ------------------------
// Get all types charges
// ------------------------
router.get('/', async (req, res) => {
  try {
    const types = await TypeCharge.find().sort({ nom: 1 });
    res.json(types);
  } catch (err) {
    console.error('Erreur récupération types charges:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;