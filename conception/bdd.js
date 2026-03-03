use ecommerce;

// ROLE
db.createCollection("roles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["libelle"],
      properties: {
        libelle: { bsonType: "string" } // ADMIN, BOUTIQUE, ACHETEUR
      }
    }
  }
});

// UTILISATEUR
db.createCollection("utilisateurs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom", "prenom", "mot_de_passe", "statut", "id_role", "datetime_creation"],
      properties: {
        nom: { bsonType: "string" },
        prenom: { bsonType: "string" },
        email: { bsonType: "string" },
        mot_de_passe: { bsonType: "string" },
        telephone: { bsonType: "string" },
        statut: { enum: [1, 2] }, // 1=actif, 2=bloqué
        datetime_creation: { bsonType: "date" },
        id_role: { bsonType: "objectId" }
      }
    }
  }
});
db.utilisateurs.createIndex({ email: 1 }, { unique: true });

// CENTRE_COMMERCIAL
db.createCollection("centres_commerciaux", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom"],
      properties: {
        nom: { bsonType: "string" },
        adresse: { bsonType: "string" },
        ville: { bsonType: "string" },
        description: { bsonType: "string" },
        last_updated: { bsonType: "date" }
      }
    }
  }
});
db.centres_commerciaux.createIndex({ nom: 1 }, { unique: true });

// Horaires_Centre
db.createCollection("horaires_centre", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_centre", "id_jour", "heure_ouverture", "heure_fermeture"],
      properties: {
        id_centre: { bsonType: "objectId" },
        id_jour: { bsonType: "int", minimum: 1, maximum: 7 },
        heure_ouverture: { bsonType: "string" },
        heure_fermeture: { bsonType: "string" }
      }
    }
  }
});

// BOUTIQUE
db.createCollection("boutiques", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom", "id_categorie_boutique", "etage", "emplacement", "email", "statut", "datetime_added"],
      properties: {
        nom: { bsonType: "string" },
        description: { bsonType: "string" },
        id_categorie_boutique: { bsonType: "objectId" },
        etage: { bsonType: "int" },
        emplacement: { bsonType: "int" },
        telephone: { bsonType: "string" },
        email: { bsonType: "string" },
        logo: { bsonType: "string" },
        statut: { bsonType: "objectId" },
        id_centre: { bsonType: "objectId" },
        datetime_added: { bsonType: "date" }
      }
    }
  }
});

db.boutiques.createIndex(
  { emplacement: 1 },
  { unique: true, name: "unique_emplacement" }
)

// Admin_Boutique
db.createCollection("admin_boutique", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_utilisateur", "id_boutique"],
      properties: {
        id_utilisateur: { bsonType: "objectId" },
        id_boutique: { bsonType: "objectId" },
        last_updated: { bsonType: "date" }
      }
    }
  }
});

// Categorie_Boutique
db.createCollection("categorie_boutique", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom"],
      properties: {
        nom: { bsonType: "string" },
        description: { bsonType: "string" }
      }
    }
  }
});

// Emplacement - Loyer_Emplacement
db.createCollection("loyer_emplacement", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["emplacement", "montant", "date_debut"],
      properties: {
        emplacement: { bsonType: "int" },
        montant: { bsonType: "double" },
        date_debut: { bsonType: "date" }
      }
    }
  }
});

// Charges_Emplacement
// Types_Charges
db.createCollection("types_charges", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom"],
      properties: {
        nom: { bsonType: "string" },
        description: { bsonType: "string" }
      }
    }
  }
});

db.types_charges.insertMany([
  {
    _id: ObjectId("65f000000000000000000001"),
    nom: "LOYER",
    description: "Paiement mensuel fixe pour l’occupation du local"
  },
  {
    _id: ObjectId("65f000000000000000000002"),
    nom: "EAU",
    description: "Consommation d’eau facturée selon usage"
  },
  {
    _id: ObjectId("65f000000000000000000003"),
    nom: "ELECTRICITE",
    description: "Consommation électrique facturée selon compteur"
  },
  {
    _id: ObjectId("65f000000000000000000004"),
    nom: "SECURITE",
    description: "Frais de sécurité du centre (gardiennage, surveillance)"
  },
  {
    _id: ObjectId("65f000000000000000000005"),
    nom: "ENTRETIEN",
    description: "Nettoyage, maintenance, entretien des espaces communs"
  },
  {
    _id: ObjectId("65f000000000000000000006"),
    nom: "REPARATION",
    description: "Intervention technique ponctuelle (plomberie, électricité, etc.)"
  },
  {
    _id: ObjectId("65f000000000000000000007"),
    nom: "PENALITE",
    description: "Pénalité de retard ou non-respect de règlement"
  },
  {
    _id: ObjectId("65f000000000000000000008"),
    nom: "SERVICE",
    description: "Service spécifique demandé par une boutique"
  }
]);

db.runCommand({
  collMod: "factures",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "id_boutique",
        "id_type_charge",
        "categorie",
        "mois",
        "annee",
        "montant",
        "date_facturation",
        "date_echeance",   // ✅ REQUIRED
        "statut"
      ],
      properties: {
        id_boutique: { bsonType: "objectId" },
        id_type_charge: { bsonType: "objectId" },

        categorie: { enum: ["FIXE", "VARIABLE", "PONCTUEL"] },

        mois: { bsonType: "int", minimum: 1, maximum: 12 },
        annee: { bsonType: "int" },

        montant: { bsonType: "number" },

        date_facturation: { bsonType: "date" },

        // ✅ NEW REQUIRED FIELD (French name)
        date_echeance: { bsonType: "date" },

        description: { bsonType: "string" },

        statut: { enum: ["EN_ATTENTE", "PAYEE", "EN_RETARD"] },

        date_paiement: { bsonType: ["date", "null"] }
      }
    }
  },
  validationLevel: "strict",   // now strict since old docs removed
  validationAction: "error"
});


// Demande_Centre
db.createCollection("demande_centre", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_admin_boutique_utilisateur", "datetime_demande"],
      properties: {
        description: { bsonType: "string" },
        id_admin_boutique_utilisateur: { bsonType: "objectId" },
        datetime_demande: { bsonType: "date" },
      }
    }
  }
});
db.createCollection("commentaire_demande", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_demande", "id_utilisateur", "commentaire", "datetime_commentaire"],
      properties: {
        id_demande: {
          bsonType: "objectId",
          description: "Reference to demande_centre _id"
        },
        id_utilisateur: {
          bsonType: "objectId",
          description: "Reference to utilisateur _id"
        },
        commentaire: {
          bsonType: "string"
        },
        datetime_commentaire: {
          bsonType: "date"
        }
      }
    }
  }
});

// Annonce
db.createCollection("annonces", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["target", "id_utilisateur", "datetime_annonce"],
      properties: {
        target: { bsonType: "string" },
        id_utilisateur: { bsonType: "objectId" },
        datetime_annonce: { bsonType: "date" },
        photo: { bsonType: "string" }
      }
    }
  }
});

db.runCommand({
  collMod: "annonces",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["target", "id_utilisateur", "datetime_annonce"],
      properties: {
        target: { 
          enum: ["PUBLIC", "PRIVATE"]   // 🔒 restriction
        },
        id_utilisateur: { bsonType: "objectId" },
        datetime_annonce: { bsonType: "date" },
        photo: { bsonType: "string" }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});

// CATEGORIE_PRODUIT
db.createCollection("categorie_produit", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["libelle"],
      properties: {
        libelle: { bsonType: "string" }
      }
    }
  }
});

// Sous_categorie
db.createCollection("sous_categorie", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_categorie"],
      properties: {
        nom: { bsonType: "string" },
        id_categorie: { bsonType: "objectId" }
      }
    }
  }
});

// PRODUIT
db.createCollection("produits", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom", "id_sous_categorie"],
      properties: {
        nom: { bsonType: "string" },
        id_sous_categorie: { bsonType: "objectId" },
        last_updated: { bsonType: "date" }
      }
    }
  }
});

// Produit_boutique
db.createCollection("produit_boutique", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_boutique", "id_produit_boutique", "stock", "image", "statut"],
      properties: {
        id_produit_boutique: { bsonType: "objectId" },
        id_produit: { bsonType: "objectId" },
        id_boutique: { bsonType: "objectId" },
        stock: { bsonType: "int", minimum: 0 },
        image: { bsonType: "string" },
        statut: { enum: [1, 2] },
        description: { bsonType: "string" },
        last_updated: { bsonType: "date" }
      }
    }
  }
});

// Prix_Produit
db.createCollection("prix_produit", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_produit_boutique", "montant", "datetime_changement"],
      properties: {
        id_produit_boutique: { bsonType: "objectId" },
        montant: { bsonType: "double" },
        datetime_changement: { bsonType: "date" }
      }
    }
  }
});

// Stock_Mouvement_Produit
db.createCollection("stock_mouvement_produit", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_produit_boutique", "mouvement", "nb_produit", "datetime_mouvement"],
      properties: {
        id_produit_boutique: { bsonType: "objectId" },
        mouvement: { enum: [1, 2] }, // 1=in, 2=out
        nb_produit: { bsonType: "int", minimum: 0 },
        datetime_mouvement: { bsonType: "date" }
      }
    }
  }
});

// Panier
db.createCollection("panier", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_utilisateur_client", "datetime_creation", "last_updated", "statut", "mode_paiement", "type_livraison"],
      properties: {
        id_utilisateur_client: { bsonType: "objectId" },
        datetime_creation: { bsonType: "date" },
        last_updated: { bsonType: "date" },
        statut: { enum: [1, 2, 3, 4] }, // en cours, confirmé, payed, livrer
        prix_total: { bsonType: "double" },
        mode_paiement: { enum: [1, 2] },
        type_livraison: { enum: [1, 2] }
      }
    }
  }
});

// DETAIL_Pannier
db.createCollection("detail_panier", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_produit_boutique", "quantite", "id_pannier", "datetime_added", "price_per_item"],
      properties: {
        id_produit_boutique: { bsonType: "objectId" },
        quantite: { bsonType: "int", minimum: 0 },
        id_pannier: { bsonType: "objectId" },
        datetime_added: { bsonType: "date" },
        shipping_fee: { bsonType: "double" },
        price_per_item: { bsonType: "double" }
      }
    }
  }
});

// PROMOTION
db.createCollection("promotions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom", "pourcentage", "datetime_debut", "datetime_fin"],
      properties: {
        nom: { bsonType: "string" },
        description: { bsonType: "string" },
        pourcentage: { bsonType: "int", minimum: 1, maximum: 100 },
        datetime_debut: { bsonType: "date" },
        datetime_fin: { bsonType: "date" }
      }
    }
  }
});

// PRODUIT_PROMOTION
db.createCollection("produit_promotion", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_produit_boutique", "id_promotion", "datetime_added"],
      properties: {
        id_produit_boutique: { bsonType: "objectId" },
        id_promotion: { bsonType: "objectId" },
        datetime_added: { bsonType: "date" }
      }
    }
  }
});

// CARTE_FIDELITE
db.createCollection("carte_fidelite", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["points", "id_acheteur", "datetime_added"],
      properties: {
        id_boutique: { bsonType: "objectId" },
        points: { bsonType: "int", minimum: 0 },
        id_acheteur: { bsonType: "objectId" },
        datetime_added: { bsonType: "date" }
      }
    }
  }
});

// AVIS_Boutique
db.createCollection("avis_boutique", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["note", "datetime_avis", "id_acheteur", "id_boutique"],
      properties: {
        note: { bsonType: "int", minimum: 1, maximum: 10 },
        commentaire: { bsonType: "string" },
        datetime_avis: { bsonType: "date" },
        id_acheteur: { bsonType: "objectId" },
        id_boutique: { bsonType: "objectId" }
      }
    }
  }
});

// AVIS_Produit
db.createCollection("avis_produit", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["note", "datetime_avis", "id_acheteur", "id_produit_boutique"],
      properties: {
        note: { bsonType: "int", minimum: 1, maximum: 10 },
        commentaire: { bsonType: "string" },
        datetime_avis: { bsonType: "date" },
        id_acheteur: { bsonType: "objectId" },
        id_produit_boutique: { bsonType: "objectId" }
      }
    }
  }
});

// Historique_Favoris
db.createCollection("historique_favoris", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_utilisateur_client", "id_produit_boutique", "datetime_modif", "status"],
      properties: {
        id_utilisateur_client: { bsonType: "objectId" },
        id_produit_boutique: { bsonType: "objectId" },
        datetime_modif: { bsonType: "date" },
        status: { enum: [1, 2] }
      }
    }
  }
});

db.createCollection("loyer_payments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_utilisateur_centre", "id_boutique", "datetime_payment", "month", "year", "amount"],
      properties: {
        id_utilisateur_centre: { bsonType: "objectId" },
        id_boutique: { bsonType: "objectId" },
        description: { bsonType: "string" },
        datetime_payment: { bsonType: "date" },
        month: { bsonType: "int", minimum: 1, maximum: 12 },
        year: { bsonType: "int" },
        amount: { bsonType: "double", minimum: 0 }
      }
    }
  }
});

db.createCollection("notifications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "type",
        "event",
        "source_user_id",
        "target_roles",
        "message",
        "created_at"
      ],
      properties: {
        type: {
          bsonType: "string",
          enum: ["DEMANDE", "FACTURE", "ANNONCE"]
        },
        event: {
          bsonType: "string"
        },
        source_user_id: {
          bsonType: "objectId"
        },
        target_roles: {
          bsonType: "array",
          items: {
            bsonType: "string",
            enum: ["ADMIN_CENTRE", "ADMIN_BOUTIQUE", "ACHETEUR"]
          }
        },
        target_boutiques: {
          bsonType: ["array", "null"],
          items: {
            bsonType: "objectId"
          }
        },
        message: {
          bsonType: "string"
        },
        created_at: {
          bsonType: "date"
        }
      }
    }
  }
});


db.createCollection("notification_reads", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "notification_id",
        "utilisateur_id",
        "read_at"
      ],
      properties: {

        notification_id: {
          bsonType: "objectId"
        },

        utilisateur_id: {
          bsonType: "objectId"
        },

        read_at: {
          bsonType: "date"
        }
      }
    }
  }
});





