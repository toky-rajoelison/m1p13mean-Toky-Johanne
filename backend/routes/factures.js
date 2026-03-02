const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { createNotifications } = require('../services/notification.service');

const Notification = require('../models/Notification'); // adjust path
const Facture = require('../models/Facture');
const TypeCharge = require('../models/TypeCharge');
const Utilisateur = require('../models/Utilisateur');
const Role = require('../models/Role');
const Boutique = require('../models/Boutique');
const Admin_Boutique = require('../models/AdminBoutique');

// ------------------------
// CREATE FACTURE (ADMIN_CENTRE ONLY)
// ------------------------
router.post('/', async (req, res) => {
  try {
    const {
      id_utilisateur,
      id_boutique,
      id_type_charge,
      categorie,
      mois,
      annee,
      montant,
      description,
      date_echeance
    } = req.body;

    // Presence validation
    if (
      !id_utilisateur ||
      !id_boutique ||
      !id_type_charge ||
      !categorie ||
      mois == null ||
      annee == null ||
      montant == null ||
      !date_echeance
    ) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    // Type parsing
    const moisInt = parseInt(mois);
    const anneeInt = parseInt(annee);
    const montantDouble = parseFloat(montant);
    const dateEcheanceObj = new Date(date_echeance);

    if (
      isNaN(moisInt) ||
      isNaN(anneeInt) ||
      isNaN(montantDouble) ||
      isNaN(dateEcheanceObj.getTime())
    ) {
      return res.status(400).json({ 
        message: 'Types invalides (mois, année, montant ou date_echeance)' 
      });
    }

    const user = await Utilisateur.findById(id_utilisateur);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const role = await Role.findById(user.id_role);
    if (role.libelle !== 'ADMIN_CENTRE') {
      return res.status(403).json({ message: 'Seul ADMIN_CENTRE peut facturer' });
    }


    const typeCharge = await TypeCharge.findById(id_type_charge);
    if (!typeCharge) return res.status(404).json({ message: 'Type de charge introuvable' });

    const facture = new Facture({
      id_boutique,
      id_type_charge,
      categorie,
      mois: moisInt,
      annee: anneeInt,
      montant: montantDouble,
      description: description || '',
      date_facturation: new Date(),
      date_echeance: dateEcheanceObj,
      statut: 'EN_ATTENTE'
    });

    await facture.save();

    // ✅ Create notification for the admins of that boutique
    await Notification.create({
      type: 'FACTURE',
      event: 'FACTURE_CREATED',
      source_user_id: user._id,
      target_roles: ['ADMIN_BOUTIQUE'],
      target_boutiques: [id_boutique],
      message: `Nouvelle facture créée pour votre boutique (Type: ${typeCharge.nom}, Catégorie: ${categorie}, Mois: ${moisInt}, Année: ${anneeInt}, Montant: ${montantDouble})`,
      created_at: new Date()
    });

    res.status(201).json({ message: 'Facture créée', facture });

  } catch (err) {
    console.error('Erreur création facture:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// ------------------------
// GET FACTURES (ROLE BASED)
// ------------------------
router.get('/', async (req, res) => {
  try {
    const {
      userId,
      page = 1,
      limit = 10,
      mois,
      annee,
      categorie,
      id_type_charge,
      id_boutique
    } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    const user = await Utilisateur.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const role = await Role.findById(user.id_role);
    if (!role) return res.status(403).json({ message: 'Rôle introuvable' });

    let filter = {};

    // ROLE FILTER
    if (role.libelle === 'ADMIN_CENTRE') {
      filter = {};
    } 
    else if (role.libelle === 'ADMIN_BOUTIQUE') {
      const adminBoutique = await Admin_Boutique.findOne({ id_utilisateur: user._id });
      if (!adminBoutique) return res.status(404).json({ message: 'Boutique introuvable pour cet admin' });
      filter.id_boutique = adminBoutique.id_boutique;

    } 
    else {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // OPTIONAL FILTERS
    if (mois) filter.mois = parseInt(mois);
    if (annee) filter.annee = parseInt(annee);
    if (categorie) filter.categorie = categorie;
    if (id_type_charge) filter.id_type_charge = id_type_charge;
    if (id_boutique && role.libelle === 'ADMIN_CENTRE') filter.id_boutique = id_boutique;

    const factures = await Facture.find(filter)
      .sort({ date_facturation: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('id_boutique', 'nom')
      .populate('id_type_charge', 'nom description');

    const total = await Facture.countDocuments(filter);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      factures
    });

  } catch (err) {
    console.error('Erreur récupération factures:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ------------------------
// PAY FACTURE (ADMIN_CENTRE ONLY)
// ------------------------
router.post('/payer/:id_facture', async (req, res) => {
  try {
    const { id_facture } = req.params;
    const { id_utilisateur } = req.body;

    const user = await Utilisateur.findById(id_utilisateur);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const role = await Role.findById(user.id_role);
    if (role.libelle !== 'ADMIN_CENTRE') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const facture = await Facture.findById(id_facture);
    if (!facture) return res.status(404).json({ message: 'Facture introuvable' });

    facture.statut = 'PAYEE';
    facture.date_paiement = new Date();

    await facture.save();
    
    const typeCharge = await TypeCharge.findById(facture.id_type_charge);
    if (!typeCharge) return res.status(404).json({ message: 'Type de charge introuvable' });

    await Notification.create({
      type: 'FACTURE',
      event: 'FACTURE_PAYEE',
      source_user_id: user._id,
      target_roles: ['ADMIN_BOUTIQUE'],
      target_boutiques: [facture.id_boutique],
      message: `La facture pour votre boutique a été payée (Type: ${typeCharge.nom}, Catégorie: ${facture.categorie}, Mois: ${facture.mois}, Année: ${facture.annee}, Montant: ${facture.montant})`,
      created_at: new Date()
    });

    res.json({ message: 'Facture payée', facture });

  } catch (err) {
    console.error('Erreur paiement facture:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.get('/retard', async (req, res) => {
  try {
    const {
      userId,
      page = 1,
      limit = 10,
      mois,
      annee,
      categorie,
      id_type_charge,
      id_boutique
    } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'ID utilisateur invalide' });
    }

    const user = await Utilisateur.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const role = await Role.findById(user.id_role);
    if (!role) return res.status(403).json({ message: 'Rôle introuvable' });

    let filter = {};

    // ROLE FILTER
    if (role.libelle === 'ADMIN_CENTRE') {
      filter = {};
    } 
    else if (role.libelle === 'ADMIN_BOUTIQUE') {
      const adminBoutique = await Admin_Boutique.findOne({ id_utilisateur: user._id });
      if (!adminBoutique) return res.status(404).json({ message: 'Boutique introuvable pour cet admin' });
      filter.id_boutique = adminBoutique.id_boutique;
    } 
    else {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // OPTIONAL FILTERS
    if (mois) filter.mois = parseInt(mois);
    if (annee) filter.annee = parseInt(annee);
    if (categorie) filter.categorie = categorie;
    if (id_type_charge) filter.id_type_charge = id_type_charge;
    if (id_boutique && role.libelle === 'ADMIN_CENTRE') filter.id_boutique = id_boutique;

    // ADD FILTER FOR PAST DUE FACTURES
    const today = new Date();
    filter.date_echeance = { $lt: today }; // due before today
    filter.statut = { $ne: 'PAYEE' };      // not yet paid

    const factures = await Facture.find(filter)
      .sort({ date_facturation: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('id_boutique', 'nom')
      .populate('id_type_charge', 'nom description');

    const total = await Facture.countDocuments(filter);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
      factures
    });

  } catch (err) {
    console.error('Erreur récupération factures:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/today', async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const factures = await Facture.find({
      date_paiement: { $gte: start, $lte: end },
      statut: 'PAYEE'
    })
      .sort({ date_paiement: -1 })
      .populate('id_boutique', 'nom')
      .populate('id_type_charge', 'nom description');

    res.json({ factures });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



module.exports = router;