const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/Utilisateur');
const Role = require('../models/Role');

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, telephone, role } = req.body;

    // Check role exists
    const roleDoc = await Role.findOne({ libelle: role });
    if (!roleDoc) return res.status(400).json({ message: "Role not found" });

    // Hash password
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Create user
    const user = new Utilisateur({
      nom,
      prenom,
      email,
      mot_de_passe: hashedPassword,
      telephone,
      id_role: roleDoc._id
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// const jwt = require('jsonwebtoken'); // optional if you want tokens later 

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Find user by email
    const user = await Utilisateur.findOne({ email }).populate('id_role');
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    // Optional: return user info (you can also generate token here)
    res.json({
      message: "Login successful",
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.id_role.libelle,
        statut: user.statut
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});