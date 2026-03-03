const Notification = require('../models/Notification');
const NotificationRead = require('../models/NotificationRead');

/**
 * Create notifications for multiple users
 * @param {Object} params
 * @param {String} params.type - DEMANDE | FACTURE | ANNONCE | COMMENTAIRE
 * @param {String} params.message - notification message
 * @param {String} params.context_type - DEMANDE | FACTURE | ANNONCE
 * @param {ObjectId} params.context_id - related object id
 * @param {ObjectId[]} params.userIds - users to notify
 */
async function createNotifications({ type, message, context_type, context_id, userIds }) {
  if (!userIds || userIds.length === 0) return;

  // 1) create notifications
  const notifications = userIds.map(id_user => ({
    type,
    message,
    id_utilisateur: id_user,
    context_type,
    context_id
  }));

  const insertedNotifications = await Notification.insertMany(notifications);

  // 2) create read states
  const reads = insertedNotifications.map(n => ({
    id_notification: n._id,
    id_utilisateur: n.id_utilisateur,
    read: false,
    read_at: null
  }));

  await NotificationRead.insertMany(reads);
}

/**
 * Mark notification as read
 */
async function markAsRead(notificationId, userId) {
  await NotificationRead.findOneAndUpdate(
    { notification_id: notificationId, utilisateur_id: userId },
    { $set: { read_at: new Date() } },
    { new: true }
  );
}

/**
 * Get notifications for a user
 */
async function getUserNotifications(userId) {
  return NotificationRead.find({ id_utilisateur: userId })
    .populate('id_notification')
    .sort({ 'id_notification.created_at': -1 });
}

module.exports = {
  createNotifications,
  markAsRead,
  getUserNotifications
};