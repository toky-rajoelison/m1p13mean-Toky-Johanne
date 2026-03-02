mongo

use mean_test_db

db.createCollection("roles", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["libelle"],s
      properties: {
        libelle: { bsonType: "string" } // ADMIN, BOUTIQUE, ACHETEUR
      }
    }
  }
});

db.roles.insertMany([
  { libelle: "ADMIN_CENTRE" },
  { libelle: "ADMIN_BOUTIQUE" },
  { libelle: "ACHETEUR" }
]);

// Change 'ADMIN' to 'ADMIN_CENTRE'
db.roles.updateOne(
  { libelle: "ADMIN" },
  { $set: { libelle: "ADMIN_CENTRE" } }
);

// Change 'BOUTIQUE' to 'ADMIN_BOUTIQUE'
db.roles.updateOne(
  { libelle: "BOUTIQUE" },
  { $set: { libelle: "ADMIN_BOUTIQUE" } }
);

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
