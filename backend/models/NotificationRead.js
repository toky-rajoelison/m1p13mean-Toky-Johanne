const mongoose = require('mongoose');

const NotificationReadSchema = new mongoose.Schema({
  id_notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true
  },

  id_utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },

  read: {
    type: Boolean,
    default: false
  },

  read_at: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('NotificationRead', NotificationReadSchema, 'notification_reads');