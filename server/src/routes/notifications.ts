/**
 * Notifications API Routes
 * For parents to view and manage their notifications
 */

import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getUnreadNotifications,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../services/notification.service';

const router = Router();

/**
 * GET /api/notifications/unread
 * Get all unread notifications for the authenticated user
 */
router.get('/unread', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const notifications = await getUnreadNotifications(req.user.userId);

    res.json({
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Get unread notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch unread notifications' });
  }
});

/**
 * GET /api/notifications
 * Get all notifications for the authenticated user (paginated)
 * Query params: page (default: 1), limit (default: 20)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await getNotifications(req.user.userId, page, limit);

    res.json(result);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

/**
 * PUT /api/notifications/:id/read
 * Mark a specific notification as read
 */
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const notification = await markNotificationAsRead(id);

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

/**
 * PUT /api/notifications/read-all
 * Mark all notifications as read for the authenticated user
 */
router.put('/read-all', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await markAllNotificationsAsRead(req.user.userId);

    res.json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

export default router;
