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