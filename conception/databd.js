use ecommerceDB;

/* ================================
   CATEGORIE_PRODUIT
================================ */
db.categorie_produit.insertMany([
  {
    _id: ObjectId("680000000000000000000001"),
    libelle: "Électronique"
  },
  {
    _id: ObjectId("680000000000000000000002"),
    libelle: "Vêtements"
  }
]);

/* ================================
   SOUS_CATEGORIE
================================ */
db.sous_categorie.insertMany([
  {
    _id: ObjectId("680000000000000000000011"),
    nom: "Smartphones",
    id_categorie: ObjectId("680000000000000000000001")
  },
  {
    _id: ObjectId("680000000000000000000012"),
    nom: "Ordinateurs",
    id_categorie: ObjectId("680000000000000000000001")
  },
  {
    _id: ObjectId("680000000000000000000013"),
    nom: "T-shirts",
    id_categorie: ObjectId("680000000000000000000002")
  }
]);

/* ================================
   PRODUITS
================================ */
db.produits.insertMany([
  {
    _id: ObjectId("680000000000000000000021"),
    nom: "iPhone 15",
    id_sous_categorie: ObjectId("680000000000000000000011"),
    id_categorie: ObjectId("680000000000000000000001"),
    id_boutique: ObjectId("680000000000000000000101"),
    image: "iphone15.jpg",
    statut: 1,  // 1 = disponible
    last_updated: new Date()
  },
  {
    _id: ObjectId("680000000000000000000022"),
    nom: "MacBook Air M3",
    id_sous_categorie: ObjectId("680000000000000000000012"),
    id_categorie: ObjectId("680000000000000000000001"),
    id_boutique: ObjectId("680000000000000000000102"),
    image: "macbook_air_m3.jpg",
    statut: 1,
    last_updated: new Date()
  },
  {
    _id: ObjectId("680000000000000000000023"),
    nom: "T-shirt Nike Sport",
    id_sous_categorie: ObjectId("680000000000000000000013"),
    id_categorie: ObjectId("680000000000000000000002"),
    id_boutique: ObjectId("680000000000000000000103"),
    image: "nike_tshirt.jpg",
    statut: 1,
    last_updated: new Date()
  }
]);

/* ================================
   BOUTIQUES
================================ */
db.boutiques.insertMany([
  {
    _id: ObjectId("680000000000000000000031"),
    nom: "Tech Store",
    description: "Boutique spécialisée en produits électroniques",
    id_categorie_boutique: ObjectId("670000000000000000000001"),
    etage: 1,
    emplacement: 101,
    telephone: "0340000000",
    email: "tech@store.com",
    logo: "techstore.png",
    id_statut_boutique: ObjectId("670000000000000000000010"), // <-- champ corrigé
    id_centre: ObjectId("670000000000000000000020"),
    datetime_added: new Date()
  },
  {
    _id: ObjectId("680000000000000000000032"),
    nom: "Fashion Shop",
    description: "Boutique vêtements tendance",
    id_categorie_boutique: ObjectId("670000000000000000000002"),
    etage: 2,
    emplacement: 205,
    telephone: "0330000000",
    email: "fashion@shop.com",
    logo: "fashion.png",
    id_statut_boutique: ObjectId("670000000000000000000010"), // <-- champ corrigé
    id_centre: ObjectId("670000000000000000000020"),
    datetime_added: new Date()
  }
]);

/* ================================
   PRODUIT_BOUTIQUE
================================ */
db.produit_boutique.insertMany([
  {
    _id: ObjectId("680000000000000000000041"),
    id_produit: ObjectId("680000000000000000000021"),
    id_boutique: ObjectId("680000000000000000000031"),
    stock: 50,
    image: "iphone15.jpg",
    statut: 1,
    description: "iPhone 15 128GB",
    last_updated: new Date()
  },
  {
    _id: ObjectId("680000000000000000000042"),
    id_produit: ObjectId("680000000000000000000022"),
    id_boutique: ObjectId("680000000000000000000031"),
    stock: 20,
    image: "macbook.jpg",
    statut: 1,
    description: "MacBook Air M3 256GB",
    last_updated: new Date()
  },
  {
    _id: ObjectId("680000000000000000000043"),
    id_produit: ObjectId("680000000000000000000023"),
    id_boutique: ObjectId("680000000000000000000032"),
    stock: 100,
    image: "tshirt.jpg",
    statut: 1,
    description: "T-shirt Nike taille M",
    last_updated: new Date()
  }
]);

/* ================================
   PRIX_PRODUIT
================================ */
db.prix_produit.insertMany([
  {
    id_produit: ObjectId("680000000000000000000041"),
    montant: 4500000.01,   // force le type double
    datetime_changement: new Date()
  },
  {
    id_produit: ObjectId("680000000000000000000042"),
    montant: 6200000.01,
    datetime_changement: new Date()
  },
  {
    id_produit: ObjectId("680000000000000000000043"),
    montant: 80000.01,
    datetime_changement: new Date()
  }
]);

/* ================================
   STOCK_MOUVEMENT_PRODUIT
================================ */
db.stock_mouvement_produit.insertMany([
  {
    id_produit: ObjectId("680000000000000000000041"), // nom exact attendu
    mouvement: 1,
    nb_produit: 50,
    datetime_mouvement: new Date()
  },
  {
    id_produit: ObjectId("680000000000000000000042"),
    mouvement: 1,
    nb_produit: 20,
    datetime_mouvement: new Date()
  },
  {
    id_produit: ObjectId("680000000000000000000043"),
    mouvement: 1,
    nb_produit: 100,
    datetime_mouvement: new Date()
  }
]);

/* ================================
   ANNONCES
================================ */
db.annonces.insertMany([
  {
    target: "CLIENT",
    id_utilisateur: ObjectId("670000000000000000000099"),
    datetime_annonce: new Date(),
    photo: "promo.jpg"
  }
]);





//--------------------------------------

db.avis_produit.insertMany([

  // ===== iPhone 15 =====
  {
    note: 10,
    commentaire: "Téléphone ultra rapide, autonomie excellente !",
    datetime_avis: ISODate("2026-02-27T22:00:00Z"),
    id_acheteur: ObjectId("69a1f93da3ee642f0ded3387"), 
    id_produit_boutique: ObjectId("680000000000000000000041")
  },
  {
    note: 8,
    commentaire: "Très bon smartphone mais un peu cher.",
    datetime_avis: ISODate("2026-02-27T22:05:00Z"),
    id_acheteur: ObjectId("69a1f951a3ee642f0ded338a"), 
    id_produit_boutique: ObjectId("680000000000000000000041")
  },

  // ===== MacBook Air M3 =====
  {
    note: 9,
    commentaire: "Super léger et très performant pour le travail.",
    datetime_avis: ISODate("2026-02-27T22:10:00Z"),
    id_acheteur: ObjectId("69a1f93da3ee642f0ded3387"), 
    id_produit_boutique: ObjectId("680000000000000000000042")
  },
  {
    note: 7,
    commentaire: "Bonne machine mais stockage un peu limité.",
    datetime_avis: ISODate("2026-02-27T22:15:00Z"),
    id_acheteur: ObjectId("69a1f951a3ee642f0ded338a"), 
    id_produit_boutique: ObjectId("680000000000000000000042")
  },

  // ===== T-shirt Nike =====
  {
    note: 9,
    commentaire: "Très confortable et bonne qualité du tissu.",
    datetime_avis: ISODate("2026-02-27T22:20:00Z"),
    id_acheteur: ObjectId("69a1f93da3ee642f0ded3387"), 
    id_produit_boutique: ObjectId("680000000000000000000043")
  },
  {
    note: 6,
    commentaire: "Correct mais la taille est un peu petite.",
    datetime_avis: ISODate("2026-02-27T22:25:00Z"),
    id_acheteur: ObjectId("69a1f951a3ee642f0ded338a"), 
    id_produit_boutique: ObjectId("680000000000000000000043")
  },

  // ===== Avis supplémentaires variés =====
  {
    note: 5,
    commentaire: "Livraison un peu lente mais produit conforme.",
    datetime_avis: ISODate("2026-02-27T22:30:00Z"),
    id_acheteur: ObjectId("69a1f93da3ee642f0ded3387"), 
    id_produit_boutique: ObjectId("680000000000000000000043")
  },
  {
    note: 10,
    commentaire: "Parfait ! Je recommande sans hésiter.",
    datetime_avis: ISODate("2026-02-27T22:35:00Z"),
    id_acheteur: ObjectId("69a1f951a3ee642f0ded338a"), 
    id_produit_boutique: ObjectId("680000000000000000000041")
  }
]);
db.promotions.insertMany([
  {
    nom: "Promo Été 2026",
    description: "Remise spéciale été sur produits sélectionnés",
    pourcentage: 20,
    datetime_debut: ISODate("2026-03-01T00:00:00Z"),
    datetime_fin: ISODate("2026-03-31T23:59:59Z")
  },
  {
    nom: "Black Friday 2026",
    description: "Promotion exceptionnelle Black Friday",
    pourcentage: 40,
    datetime_debut: ISODate("2026-11-25T00:00:00Z"),
    datetime_fin: ISODate("2026-11-30T23:59:59Z")
  },
  {
    nom: "Promo Lancement",
    description: "Offre spéciale lancement produit",
    pourcentage: 15,
    datetime_debut: ISODate("2026-02-27T00:00:00Z"),
    datetime_fin: ISODate("2026-03-10T23:59:59Z")
  }
])

db.produit_promotion.insertMany([
  {
    id_produit_boutique: ObjectId("680000000000000000000041"), // iPhone 15
    id_promotion: ObjectId("700000000000000000000001"), // Promo Été
    datetime_added: new Date()
  },
  {
    id_produit_boutique: ObjectId("680000000000000000000042"), // MacBook
    id_promotion: ObjectId("700000000000000000000002"), // Black Friday
    datetime_added: new Date()
  },
  {
    id_produit_boutique: ObjectId("680000000000000000000043"), // T-shirt
    id_promotion: ObjectId("700000000000000000000001"), // Promo Été
    datetime_added: new Date()
  },
  {
    id_produit_boutique: ObjectId("69a0c2fa2309485ca4cb0cec"), // Produit A
    id_promotion: ObjectId("700000000000000000000003"), // Promo Lancement
    datetime_added: new Date()
  }
])

// PANIER acheteur1
db.panier.insertOne({
  id_utilisateur_client: ObjectId("69a1f93da3ee642f0ded3387"),
  datetime_creation: new Date(),
  last_updated: new Date(),
  statut: 1, // en cours
  prix_total: 0.01,
  mode_paiement: 1, // ex: mobile money
  type_livraison: 1 // ex: livraison standard
});

// PANIER acheteur2
db.panier.insertOne({
  id_utilisateur_client: ObjectId("69a1f951a3ee642f0ded338a"),
  datetime_creation: new Date(),
  last_updated: new Date(),
  statut: 2, // confirmé
  prix_total: 0.01,
  mode_paiement: 2, // ex: carte bancaire
  type_livraison: 2 // ex: retrait boutique
});

db.detail_panier.insertMany([
  {
    id_produit_boutique: ObjectId("69a0c2fa2309485ca4cb0cec"),
    quantite: 2,
    id_pannier: ObjectId("69a335b625d28d1c297c2918"),
    datetime_added: new Date(),
    shipping_fee: 5000.01,
    price_per_item: 20000.01
  },
  {
    id_produit_boutique: ObjectId("680000000000000000000041"),
    quantite: 1,
    id_pannier: ObjectId("69a335b625d28d1c297c2918"),
    datetime_added: new Date(),
    shipping_fee: 5000.01,
    price_per_item: 4500000.01
  }
]);

db.detail_panier.insertMany([
  {
    id_produit_boutique: ObjectId("680000000000000000000042"),
    quantite: 1,
    id_pannier: ObjectId("69a335b725d28d1c297c2919"),
    datetime_added: new Date(),
    shipping_fee: 10000.01,
    price_per_item: 6000000.01
  },
  {
    id_produit_boutique: ObjectId("680000000000000000000043"),
    quantite: 3,
    id_pannier: ObjectId("69a335b725d28d1c297c2919"),
    datetime_added: new Date(),
    shipping_fee: 10000.01,
    price_per_item: 80000.01
  }
]);