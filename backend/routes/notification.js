const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Notification = require('../models/Notification');
const NotificationRead = require('../models/NotificationRead');
const Utilisateur = require('../models/Utilisateur');
const Role = require('../models/Role');

// ------------------------
// Middleware to get current user ID
// ------------------------
async function getUser(req, res, next) {
  const userId = req.query.userId || req.body.userId;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'ID utilisateur invalide' });
  }

  const user = await Utilisateur.findById(userId).populate('id_role');
  if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

  req.user = user;
  next();
}

// ------------------------
// GET /api/notifications
// Get all notifications for a user, including read/unread state
// ------------------------
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const userObjId = new mongoose.Types.ObjectId(userId);

    // Fetch notifications with read info
    const notifications = await Notification.aggregate([
      {
        $lookup: {
          from: 'notification_reads',
          let: { notifId: '$_id' },
          pipeline: [
            { $match: { $expr: { $and: [
              { $eq: ['$notification_id', '$$notifId'] },
              { $eq: ['$utilisateur_id', userObjId] }
            ] } } }
          ],
          as: 'read_info'
        }
      },
      {
        $addFields: {
          read: { $cond: [{ $gt: [{ $size: '$read_info' }, 0] }, true, false] }
        }
      },
      {
        $project: {
          message: 1,
          type: 1,
          event: 1,
          created_at: 1,
          read: 1
        }
      },
      { $sort: { created_at: -1 } }
    ]);

    res.json(notifications);

  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ------------------------
// POST /api/notifications/:id/read
// Mark a notification as read
// ------------------------
router.post('/:id/read', async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.body.userId;

    if (!mongoose.Types.ObjectId.isValid(notificationId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid IDs' });
    }

    await NotificationRead.findOneAndUpdate(
      { 
        notification_id: new mongoose.Types.ObjectId(notificationId), 
        utilisateur_id: new mongoose.Types.ObjectId(userId) 
      },
      { $set: { read_at: new Date() } }, // mark as read
      { new: true }
    );

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    console.error('Erreur marquer notification comme lue:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;