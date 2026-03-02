const mongoose = require('mongoose');

const TypeChargeSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  }
});

module.exports = mongoose.model('TypeCharge', TypeChargeSchema, 'types_charges');