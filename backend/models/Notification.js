const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['DEMANDE', 'FACTURE', 'ANNONCE'],
    required: true
  },
  event: {
    type: String,
    required: true
  },
  source_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  target_roles: {
    type: [String],
    enum: ['ADMIN_CENTRE', 'ADMIN_BOUTIQUE', 'ACHETEUR'],
    required: true
  },
  target_boutiques: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Boutique',
    default: []
  },
  message: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notification', NotificationSchema);