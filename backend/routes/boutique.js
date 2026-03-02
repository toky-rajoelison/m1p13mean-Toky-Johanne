const express = require('express');
const router = express.Router();

const AdminBoutique = require('../models/AdminBoutique');
const Boutique = require('../models/Boutique');
const ProduitBoutique = require('../models/ProduitBoutique');
const PrixProduit = require('../models/PrixProduit');
const AvisBoutique = require('../models/AvisBoutique');
const AvisProduit = require('../models/AvisProduit');
require('../models/Produit');
require('../models/Utilisateur');

const mongoose = require('mongoose');

router.get('/produits/:idBoutique', async (req, res) => {
  console.log("=======================================");
  console.log("🔥 ROUTE /produits/:idBoutique HIT");

  try {
    const { idBoutique } = req.params;

    console.log("📦 ID Boutique reçu :", idBoutique);

    if (!mongoose.Types.ObjectId.isValid(idBoutique)) {
      console.log("❌ ID Boutique invalide");
      return res.status(400).json({ message: "ID boutique invalide" });
    }

    const produits = await ProduitBoutique.find({
      id_boutique: new mongoose.Types.ObjectId(idBoutique)
    }).populate('id_produit');

    console.log(`📦 ${produits.length} produits trouvés`);

    res.json({ produits });

  } catch (error) {
    console.error("💥 ERREUR GET PRODUITS:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

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

router.get('/avis/:idBoutique', async (req, res) => {
  try {
    const { idBoutique } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idBoutique)) {
      return res.status(400).json({ message: "ID boutique invalide" });
    }

    const avis = await AvisBoutique.find({
      id_boutique: new mongoose.Types.ObjectId(idBoutique)
    })
    .populate({
      path: "id_acheteur",
      select: "nom prenom email"
    })
    .sort({ datetime_avis: -1 });

    res.json({
      total: avis.length,
      avis
    });

  } catch (error) {
    console.error("Erreur récupération avis boutique:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get('/avis-produit/:idProduitBoutique', async (req, res) => {
  console.log("=======================================");
  console.log("🔥 ROUTE /avis-produit HIT");

  try {
    const { idProduitBoutique } = req.params;

    console.log("📦 ID produit reçu :", idProduitBoutique);
    console.log("📦 Type ID :", typeof idProduitBoutique);

    if (!mongoose.Types.ObjectId.isValid(idProduitBoutique)) {
      console.log("❌ ID produit invalide");
      return res.status(400).json({ message: "ID produit invalide" });
    }

    console.log("🧠 Conversion en ObjectId...");
    const objectId = new mongoose.Types.ObjectId(idProduitBoutique);

    console.log("🔎 Recherche des avis en base...");

    const avis = await AvisProduit.find({
      id_produit_boutique: objectId
    })
    .populate({
      path: "id_acheteur",
      select: "nom prenom email"
    })
    .sort({ datetime_avis: -1 });

    console.log(`✅ ${avis.length} avis trouvés`);

    if (avis.length > 0) {
      console.log("📝 Exemple avis :", {
        note: avis[0].note,
        commentaire: avis[0].commentaire,
        acheteur: avis[0].id_acheteur
      });
    }

    const moyenne =
      avis.length > 0
        ? (avis.reduce((sum, a) => sum + a.note, 0) / avis.length).toFixed(2)
        : 0;

    console.log("⭐ Moyenne calculée :", moyenne);

    console.log("📤 Envoi de la réponse JSON");

    res.json({
      total: avis.length,
      moyenne,
      avis
    });

    console.log("✅ Réponse envoyée avec succès");

  } catch (error) {
    console.error("💥 ERREUR SERVEUR /avis-produit :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET all boutiques (for ADMIN_CENTRE)
router.get('/', async (req, res) => {
  try {
    const boutiques = await Boutique.find();
    res.json(boutiques);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;