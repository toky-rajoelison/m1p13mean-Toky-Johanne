use ecommerceDB

// ---------------- ROLES ----------------
db.createCollection("roles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["libelle"],
      properties: {
        libelle: { bsonType: "string", description: "Role is required" }
      }
    }
  }
})

// ---------------- UTILISATEURS ----------------
db.createCollection("utilisateurs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom","prenom","mot_de_passe","statut","id_role","datetime_creation"],
      properties: {
        nom: { bsonType: "string" },
        prenom: { bsonType: "string" },
        email: { bsonType: "string", pattern: "^.+@.+\\..+$" },
        mot_de_passe: { bsonType: "string" },
        telephone: { bsonType: "string" },
        statut: { enum: [1,2], description: "1=actif,2=bloqué" },
        id_role: { bsonType: "objectId" },
        datetime_creation: { bsonType: "date" }
      }
    }
  },
  validationAction: "warn"
})
db.utilisateurs.createIndex({ email: 1 }, { unique: true })

// ---------------- CENTRES COMMERCIAUX ----------------
db.createCollection("centres_commerciaux", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom","last_updated"],
      properties: {
        nom: { bsonType: "string" },
        adresse: { bsonType: "string" },
        ville: { bsonType: "string" },
        description: { bsonType: "string" },
        last_updated: { bsonType: "date" }
      }
    }
  }
})
db.centres_commerciaux.createIndex({ nom: 1 }, { unique: true })

// ---------------- ADMIN CENTRE ----------------
db.createCollection("admin_centre", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_utilisateur","id_centre","date_creation","last_updated"],
      properties: {
        id_utilisateur: { bsonType: "objectId" },
        id_centre: { bsonType: "objectId" },
        date_creation: { bsonType: "date" },
        last_updated: { bsonType: "date" }
      }
    }
  }
})

// ---------------- HORAIRES CENTRE ----------------
db.createCollection("horaires_centre", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_centre","id_jour","heure_ouverture","heure_fermeture"],
      properties: {
        id_centre: { bsonType: "objectId" },
        id_jour: { bsonType: "int", minimum: 1, maximum: 7 },
        heure_ouverture: { bsonType: "string" }, // store HH:MM format
        heure_fermeture: { bsonType: "string" }
      }
    }
  }
})

// ---------------- BOUTIQUES ----------------
db.createCollection("boutiques", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom","id_categorie_boutique","etage","emplacement","email","id_statut_boutique","id_centre","datetime_added"],
      properties: {
        nom: { bsonType: "string" },
        description: { bsonType: "string" },
        id_categorie_boutique: { bsonType: "objectId" },
        etage: { bsonType: "int" },
        emplacement: { bsonType: "int" },
        telephone: { bsonType: "string" },
        email: { bsonType: "string" },
        logo: { bsonType: "string" },
        id_statut_boutique: { bsonType: "objectId" },
        id_centre: { bsonType: "objectId" },
        datetime_added: { bsonType: "date" }
      }
    }
  }
})

// ---------------- ADMIN BOUTIQUE ----------------
db.createCollection("admin_boutique", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_utilisateur","id_boutique","last_updated"],
      properties: {
        id_utilisateur: { bsonType: "objectId" },
        id_boutique: { bsonType: "objectId" },
        last_updated: { bsonType: "date" }
      }
    }
  }
})

// ---------------- CATEGORIES BOUTIQUE ----------------
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
})

// ---------------- STATUS BOUTIQUE ----------------
db.createCollection("status_boutique", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom"],
      properties: { nom: { bsonType: "string" } }
    }
  }
})

// ---------------- LOYER EMPLACEMENT ----------------
db.createCollection("loyer_emplacement", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["emplacement","id_centre","montant","date_debut"],
      properties: {
        emplacement: { bsonType: "int" },
        id_centre: { bsonType: "objectId" },
        montant: { bsonType: "double" },
        date_debut: { bsonType: "date" },
        date_fin: { bsonType: "date" }
      }
    }
  }
})

// ---------------- CHARGES EMPLACEMENT ----------------
db.createCollection("charges_emplacement", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_admin_centre_utilisateur","id_boutique","id_type_charges","montant"],
      properties: {
        id_admin_centre_utilisateur: { bsonType: "objectId" },
        id_boutique: { bsonType: "objectId" },
        id_type_charges: { bsonType: "objectId" },
        montant: { bsonType: "double" },
        datetime_payment: { bsonType: "date" },
        commentaire: { bsonType: "string" }
      }
    }
  }
})

// ---------------- TYPES CHARGES ----------------
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
})

// ---------------- DEMANDE CENTRE ----------------
db.createCollection("demande_centre", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_centre","id_admin_boutique_utilisateur","datetime_demande"],
      properties: {
        id_centre: { bsonType: "objectId" },
        description: { bsonType: "string" },
        id_admin_boutique_utilisateur: { bsonType: "objectId" },
        datetime_demande: { bsonType: "date" },
        read_at: { bsonType: "date" },
        read_by: { bsonType: "string" }
      }
    }
  }
})

// ---------------- ANNONCE ----------------
db.createCollection("annonces", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["taget","id_utilisateur","datetime_annonce"],
      properties: {
        taget: { bsonType: "string" },
        id_utilisateur: { bsonType: "objectId" },
        datetime_annonce: { bsonType: "date" },
        photo: { bsonType: "string" }
      }
    }
  }
})

// ---------------- CATEGORIE PRODUIT ----------------
db.createCollection("categorie_produit", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["libelle"],
      properties: { libelle: { bsonType: "string" } }
    }
  }
})

// ---------------- PRODUIT ----------------
db.createCollection("produits", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom","image","statut","id_boutique","id_categorie"],
      properties: {
        nom: { bsonType: "string" },
        description: { bsonType: "string" },
        stock: { bsonType: "int", minimum: 0 },
        image: { bsonType: "string" },
        statut: { enum: [1,2], description: "1=disponible, 2=indisponible" },
        id_boutique: { bsonType: "objectId" },
        id_categorie: { bsonType: "objectId" },
        last_updated: { bsonType: "date" }
      }
    }
  }
})

// ---------------- PRIX PRODUIT ----------------
db.createCollection("prix_produit", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_produit","montant","datetime_changement"],
      properties: {
        id_produit: { bsonType: "objectId" },
        montant: { bsonType: "double" },
        datetime_changement: { bsonType: "date" }
      }
    }
  }
})

// ---------------- STOCK MOUVEMENT PRODUIT ----------------
db.createCollection("stock_mouvement_produit", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_produit","mouvement","nb_produit","datetime_mouvement"],
      properties: {
        id_produit: { bsonType: "objectId" },
        mouvement: { enum: [1,2], description: "1=in,2=out" },
        nb_produit: { bsonType: "int", minimum: 0 },
        datetime_mouvement: { bsonType: "date" }
      }
    }
  }
})

// ---------------- PANIER ----------------
db.createCollection("paniers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_utilisateur_client","datetime_creation","last_updated","statut","mode_paiement","type_livraison"],
      properties: {
        id_utilisateur_client: { bsonType: "objectId" },
        datetime_creation: { bsonType: "date" },
        last_updated: { bsonType: "date" },
        statut: { enum: [1,2,3], description: "1=en cours,2=payed,3=livrer" },
        prix_total: { bsonType: "double" },
        mode_paiement: { enum: [1,2], description: "1=cash,2=card" },
        type_livraison: { enum: [1,2], description: "1=sur place,2=deplacement" }
      }
    }
  }
})

// ---------------- DETAIL PANIER ----------------
db.createCollection("detail_panier", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_produit","quantite","id_pannier","datetime_added","price_per_item"],
      properties: {
        id_produit: { bsonType: "objectId" },
        quantite: { bsonType: "int", minimum: 1 },
        id_pannier: { bsonType: "objectId" },
        datetime_added: { bsonType: "date" },
        shipping_fee: { bsonType: "double" },
        price_per_item: { bsonType: "double" }
      }
    }
  }
})

// ---------------- PROMOTION ----------------
db.createCollection("promotions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nom","pourcentage","datetime_debut","datetime_fin"],
      properties: {
        nom: { bsonType: "string" },
        description: { bsonType: "string" },
        pourcentage: { bsonType: "int", minimum:1, maximum:100 },
        datetime_debut: { bsonType: "date" },
        datetime_fin: { bsonType: "date" }
      }
    }
  }
})

// ---------------- PRODUIT PROMOTION ----------------
db.createCollection("produit_promotion", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_produit","id_promotion","datetime_added"],
      properties: {
        id_produit: { bsonType: "objectId" },
        id_promotion: { bsonType: "objectId" },
        datetime_added: { bsonType: "date" }
      }
    }
  }
})

// ---------------- CARTE FIDELITE ----------------
db.createCollection("carte_fidelite", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["points","id_acheteur","datetime_added"],
      properties: {
        points: { bsonType: "int", minimum: 0 },
        id_acheteur: { bsonType: "objectId" },
        datetime_added: { bsonType: "date" }
      }
    }
  }
})

// ---------------- AVIS BOUTIQUE ----------------
db.createCollection("avis_boutique", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["note","datetime_avis","id_acheteur","id_boutique"],
      properties: {
        note: { bsonType: "int", minimum: 1, maximum: 10 },
        commentaire: { bsonType: "string" },
        datetime_avis: { bsonType: "date" },
        id_acheteur: { bsonType: "objectId" },
        id_boutique: { bsonType: "objectId" }
      }
    }
  }
})

// ---------------- AVIS PRODUIT ----------------
db.createCollection("avis_produit", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["note","datetime_avis","id_acheteur","id_produit"],
      properties: {
        note: { bsonType: "int", minimum: 1, maximum: 10 },
        commentaire: { bsonType: "string" },
        datetime_avis: { bsonType: "date" },
        id_acheteur: { bsonType: "objectId" },
        id_produit: { bsonType: "objectId" }
      }
    }
  }
})

// ---------------- HISTORIQUE FAVORIS ----------------
db.createCollection("historique_favoris", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id_utilisateur_client","id_produit","datetime_modif","status"],
      properties: {
        id_utilisateur_client: { bsonType: "objectId" },
        id_produit: { bsonType: "objectId" },
        datetime_modif: { bsonType: "date" },
        status: { enum: [1,2], description: "1=isFav,2=cancel" }
      }
    }
  }
})