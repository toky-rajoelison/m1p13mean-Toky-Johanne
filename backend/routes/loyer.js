const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Boutique = require('../models/Boutique');
const LoyerEmplacement = require('../models/LoyerEmplacement');
const LoyerPayment = require('../models/LoyerPayment');
const Utilisateur = require('../models/Utilisateur');

// Helper function to get status of a boutique
function getLoyerStatus(latestPaymentDate) {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  if (!latestPaymentDate) {
    return today > firstOfMonth ? 'behind' : 'upcoming';
  }

  const lastPayment = new Date(latestPaymentDate);

  const nextMonthDue = new Date(lastPayment.getFullYear(), lastPayment.getMonth() + 1, 1);
  const daysToNext = Math.floor((nextMonthDue - today) / (1000 * 60 * 60 * 24));

  if (today.toDateString() === nextMonthDue.toDateString()) return 'payment_today';
  if (daysToNext < 0) return 'behind';
  if (daysToNext <= 5) return 'upcoming';
  return 'on_track';
}

// ------------------------------
// GET: List boutiques with loyer status
// ------------------------------
router.get('/status', async (req, res) => {
  try {

    console.log("hoho");
    const { userId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: 'Invalid user ID' });

    const user = await Utilisateur.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    console.log("🔥 User info:", user);
    console.log("🛠 User role:", user.role);

    if (user.role === 'ADMIN_CENTRE') {
        // Just get all boutiques
        boutiques = await Boutique.find();
    } else if (user.role === 'ADMIN_BOUTIQUE') {
        // Only get the boutique this admin manages
        boutiques = await Boutique.find({ _id: user.id_boutique });
    } else {
        return res.status(403).json({ message: 'Access denied a' });
    }

    if (user.role === 'ADMIN_CENTRE') {
    // Just get all boutiques
    boutiques = await Boutique.find();
    } else if (user.role === 'ADMIN_BOUTIQUE') {
        // Only get the boutique this admin manages
        boutiques = await Boutique.find({ _id: user.id_boutique });
    } else {
        return res.status(403).json({ message: 'Access denied a' });
    }

    const result = await Promise.all(
      boutiques.map(async (b) => {
        const latestPayment = await LoyerPayment.find({ id_boutique: b._id })
          .sort({ year: -1, month: -1 })
          .limit(1);
        const status = getLoyerStatus(latestPayment[0]?.datetime_payment);
        return {
          boutique: b,
          status,
          lastPayment: latestPayment[0]?.datetime_payment || null
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ------------------------------
// GET: Payment history for a boutique
// ------------------------------
router.get('/history/:boutiqueId', async (req, res) => {
  try {
    const { boutiqueId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(boutiqueId))
      return res.status(400).json({ message: 'Invalid boutique ID' });

    const payments = await LoyerPayment.find({ id_boutique: boutiqueId })
      .sort({ year: -1, month: -1 });

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ------------------------------
// POST: Make a payment (admin centre only)
// ------------------------------
router.post('/pay', async (req, res) => {
  try {
    const { id_boutique, id_utilisateur_centre, month, year, amount, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id_boutique) || !mongoose.Types.ObjectId.isValid(id_utilisateur_centre)) {
      return res.status(400).json({ message: 'Invalid ID(s)' });
    }

    // Optional: check if user is admin centre
    const user = await Utilisateur.findById(id_utilisateur_centre);
    if (!user || !['ADMIN_CENTRE'].includes(user.role)) {
    return res.status(403).json({ message: 'Access denied b' });
    }

    const payment = new LoyerPayment({
      id_boutique,
      id_utilisateur_centre,
      month,
      year,
      amount,
      description,
      datetime_payment: new Date()
    });

    await payment.save();

    res.json({ message: 'Paiement enregistré', payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;