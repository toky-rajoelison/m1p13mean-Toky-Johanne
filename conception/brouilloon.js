use ecommerceDB

db.admin_boutique.insertMany([
  {
    id_utilisateur: ObjectId("699d79b164292a3813eadab8"), 
    id_boutique: ObjectId("680000000000000000000031"),   
    last_updated: new Date()
  },
  {
    id_utilisateur: ObjectId("69a05537b6088a0dbb41d1ba"),  
    id_boutique: ObjectId("680000000000000000000032"),  
    last_updated: new Date()
  }
]);

db.admin_boutique.insertOne({
  id_utilisateur: ObjectId(''),
  id_boutique: ObjectId('680000000000000000000032'),     // Fashion Shop
  last_updated: new Date()
});