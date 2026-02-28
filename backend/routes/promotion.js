const express = require('express');
const router = express.Router();

const Promotion = require('../models/Promotions');
const PromotionProduit = require('../models/PromotionProduit');
const ProduitBoutique = require('../models/ProduitBoutique');
require('../models/Produit');

const mongoose = require('mongoose');

router.post('/create', async (req, res) => {
  console.log("=======================================");
  console.log("🔥 ROUTE /create HIT");

  try {
    const { nom, description, pourcentage, datetime_debut, datetime_fin } = req.body;

    console.log("📥 Données reçues :", req.body);

    if (!nom || !pourcentage || !datetime_debut || !datetime_fin) {
      console.log("❌ Champs obligatoires manquants");
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    if (pourcentage < 1 || pourcentage > 100) {
      console.log("❌ Pourcentage invalide");
      return res.status(400).json({ message: "Pourcentage invalide" });
    }

    const promotion = new Promotion({
      nom,
      description,
      pourcentage,
      datetime_debut,
      datetime_fin
    });

    await promotion.save();

    console.log("✅ Promotion créée :", promotion._id);

    res.status(201).json({
      message: "Promotion créée avec succès",
      promotion
    });

  } catch (error) {
    console.error("💥 ERREUR CREATE PROMOTION:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.post('/apply', async (req, res) => {
  console.log("=======================================");
  console.log("🔥 ROUTE /apply HIT");

  try {
    const { id_produit_boutique, id_promotion } = req.body;

    console.log("📥 Données reçues :", req.body);

    if (!mongoose.Types.ObjectId.isValid(id_produit_boutique) ||
        !mongoose.Types.ObjectId.isValid(id_promotion)) {

      console.log("❌ ID invalide");
      return res.status(400).json({ message: "ID invalide" });
    }

    const produit = await ProduitBoutique.findById(id_produit_boutique);
    if (!produit) {
      console.log("❌ Produit introuvable");
      return res.status(404).json({ message: "Produit introuvable" });
    }

    const promotion = await Promotion.findById(id_promotion);
    if (!promotion) {
      console.log("❌ Promotion introuvable");
      return res.status(404).json({ message: "Promotion introuvable" });
    }

    const exist = await PromotionProduit.findOne({
      id_produit_boutique,
      id_promotion
    });

    if (exist) {
      console.log("⚠️ Promotion déjà appliquée à ce produit");
      return res.status(400).json({ message: "Promotion déjà appliquée" });
    }

    const promotionProduit = new PromotionProduit({
      id_produit_boutique,
      id_promotion
    });

    await promotionProduit.save();

    console.log("✅ Promotion appliquée au produit");

    res.status(201).json({
      message: "Promotion appliquée avec succès",
      promotionProduit
    });

  } catch (error) {
    console.error("💥 ERREUR APPLY PROMOTION:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get('/produit/:idProduitBoutique', async (req, res) => {
  try {
    const { idProduitBoutique } = req.params;

    if (!mongoose.Types.ObjectId.isValid(idProduitBoutique)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const promotions = await PromotionProduit.find({
      id_produit_boutique: idProduitBoutique
    }).populate('id_promotion');

    res.json({
      total: promotions.length,
      promotions
    });

  } catch (error) {
    console.error("Erreur récupération promotions produit:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.get('/all', async (req, res) => {
  console.log("=======================================");
  console.log("🔥 ROUTE /promotion/all HIT");

  try {
    const promotions = await Promotion.find().sort({ datetime_debut: -1 });

    console.log(`🎯 ${promotions.length} promotions trouvées`);

    res.json({ promotions });

  } catch (error) {
    console.error("💥 ERREUR GET PROMOTIONS:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;