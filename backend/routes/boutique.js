const express = require('express');
const router = express.Router();

const AdminBoutique = require('../models/AdminBoutique');
const Boutique = require('../models/Boutique');
const ProduitBoutique = require('../models/ProduitBoutique');
const PrixProduit = require('../models/PrixProduit');
require('../models/Produit');

const mongoose = require('mongoose');

router.get('/me/:userId', async (req, res) => {
  console.log("=======================================");
  console.log("🔥 ROUTE /admin-boutique/me HIT");

  try {
    const { userId } = req.params;

    console.log("🆔 userId reçu:", userId);
    
    console.log("Type userId:", typeof userId);
    
    console.log("🧠 Conversion en ObjectId...");
    const admin = await AdminBoutique.findOne({
      id_utilisateur: new mongoose.Types.ObjectId(userId)
    });

    // console.log("👤 Admin trouvé:", admin);

    if (!admin) {
      console.log("❌ Aucun admin_boutique trouvé pour cet utilisateur");
      return res.status(404).json({ message: "No boutique assigned" });
    }

    const boutique = await Boutique.findById(admin.id_boutique);
    // console.log("🏪 Boutique trouvée:", boutique);

    if (!boutique) {
      console.log("❌ Boutique introuvable avec id:", admin.id_boutique);
      return res.status(404).json({ message: "Boutique not found" });
    }

    const produits = await ProduitBoutique.find({ id_boutique: boutique._id })
      .populate('id_produit');

    console.log(`📦 ${produits.length} produits trouvés`);

    const produitsAvecPrix = await Promise.all(
      produits.map(async (p, index) => {
        console.log(`🔎 Recherche prix pour produit ${index + 1} - ID:`, p._id);

        const prix = await PrixProduit.findOne({ id_produit_boutique: p._id })
          .sort({ datetime_changement: -1 });

        // console.log("💰 Prix trouvé:", prix);

        return {
          ...p.toObject(),
          prix: prix ? prix.montant : null
        };
      })
    );

    console.log("✅ Envoi de la réponse finale");

    res.json({
      boutique,
      produits: produitsAvecPrix
    });

  } catch (err) {
    console.error("💥 ERREUR SERVEUR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;