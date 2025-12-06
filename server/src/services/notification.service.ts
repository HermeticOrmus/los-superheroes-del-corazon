/**
 * Notification Service
 * Creates and manages in-app and email notifications
 */

import { PrismaClient, NotificationType, NotificationRecipient } from '@prisma/client';
import { sendEmail, getEmailTemplate } from './email.service';

const prisma = new PrismaClient();

export interface CreateNotificationParams {
  userId: string;
  childId?: string;
  type: NotificationType;
  recipient: NotificationRecipient;
  titleEs: string;
  titleEn: string;
  messageEs: string;
  messageEn: string;
  actionUrl?: string;
  sendEmailNotification?: boolean;
  emailData?: any;
}

/**
 * Create a notification in the database and optionally send email
 */
export async function createNotification(params: CreateNotificationParams): Promise<void> {
  try {
    // Create in-app notification
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        childId: params.childId,
        type: params.type,
        recipient: params.recipient,
        titleEs: params.titleEs,
        titleEn: params.titleEn,
        messageEs: params.messageEs,
        messageEn: params.messageEn,
        actionUrl: params.actionUrl,
        isRead: false,
        emailSent: false
      }
    });

    // Send email if requested
    if (params.sendEmailNotification) {
      await sendNotificationEmail(notification.id, params.emailData);
    }

    console.log('✅ Notification created:', notification.id);
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    throw error;
  }
}

/**
 * Send email for an existing notification
 */
async function sendNotificationEmail(notificationId: string, emailData?: any): Promise<void> {
  try {
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        user: {
          include: {
            profile: true
          }
        },
        child: true
      }
    });

    if (!notification) {
      console.error('Notification not found:', notificationId);
      return;
    }

    // Get user's preferred language
    const language = notification.user.profile?.preferredLanguage === 'en' ? 'en' : 'es';

    // Get email template
    const template = getEmailTemplate(notification.type, emailData || {}, language);

    // Send email
    const emailSent = await sendEmail({
      to: notification.user.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });

    // Update notification to mark email as sent
    if (emailSent) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { emailSent: true }
      });
    }
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}

/**
 * Notify parent when a new monthly mission is released
 */
export async function notifyMissionReleased(params: {
  userId: string;
  childId: string;
  missionTitle: string;
  actionUrl?: string;
}): Promise<void> {
  const child = await prisma.child.findUnique({ where: { id: params.childId } });

  await createNotification({
    userId: params.userId,
    childId: params.childId,
    type: 'MISSION_RELEASED',
    recipient: 'BOTH',
    titleEs: '¡Nueva Misión del Mes!',
    titleEn: 'New Monthly Mission!',
    messageEs: `La Comandante Corazón ha revelado una nueva misión épica para ${child?.name}.`,
    messageEn: `Commander Heart has revealed a new epic mission for ${child?.name}.`,
    actionUrl: params.actionUrl || '/missions',
    sendEmailNotification: true,
    emailData: {
      childName: child?.name,
      missionTitle: params.missionTitle
    }
  });
}

/**
 * Notify parent when child completes a challenge
 */
export async function notifyChallengeCompleted(params: {
  userId: string;
  childId: string;
  challengeTitle: string;
  luzPoints: number;
  actionUrl?: string;
}): Promise<void> {
  const child = await prisma.child.findUnique({ where: { id: params.childId } });

  await createNotification({
    userId: params.userId,
    childId: params.childId,
    type: 'CHALLENGE_COMPLETED',
    recipient: 'PARENT',
    titleEs: `${child?.name} completó un reto`,
    titleEn: `${child?.name} completed a challenge`,
    messageEs: `${child?.name} completó "${params.challengeTitle}" y ganó ${params.luzPoints} puntos Luz.`,
    messageEn: `${child?.name} completed "${params.challengeTitle}" and earned ${params.luzPoints} Luz points.`,
    actionUrl: params.actionUrl || `/children/${params.childId}`,
    sendEmailNotification: true,
    emailData: {
      childName: child?.name,
      challengeTitle: params.challengeTitle
    }
  });
}

/**
 * Notify parent when child ranks up
 */
export async function notifyRankUp(params: {
  userId: string;
  childId: string;
  newRank: string;
  actionUrl?: string;
}): Promise<void> {
  const child = await prisma.child.findUnique({ where: { id: params.childId } });

  await createNotification({
    userId: params.userId,
    childId: params.childId,
    type: 'RANK_UP',
    recipient: 'BOTH',
    titleEs: `¡${child?.name} subió de rango!`,
    titleEn: `${child?.name} ranked up!`,
    messageEs: `${child?.name} alcanzó el rango de ${params.newRank}. ¡Celebren juntos este logro!`,
    messageEn: `${child?.name} reached the rank of ${params.newRank}. Celebrate this achievement together!`,
    actionUrl: params.actionUrl || `/children/${params.childId}`,
    sendEmailNotification: true,
    emailData: {
      childName: child?.name,
      newRank: params.newRank
    }
  });
}

/**
 * Notify parent when child earns a badge
 */
export async function notifyBadgeEarned(params: {
  userId: string;
  childId: string;
  badgeName: string;
  actionUrl?: string;
}): Promise<void> {
  const child = await prisma.child.findUnique({ where: { id: params.childId } });

  await createNotification({
    userId: params.userId,
    childId: params.childId,
    type: 'BADGE_EARNED',
    recipient: 'BOTH',
    titleEs: `¡Nueva insignia desbloqueada!`,
    titleEn: 'New badge unlocked!',
    messageEs: `${child?.name} ganó la insignia "${params.badgeName}".`,
    messageEn: `${child?.name} earned the badge "${params.badgeName}".`,
    actionUrl: params.actionUrl || `/badges`,
    sendEmailNotification: true,
    emailData: {
      childName: child?.name,
      badgeName: params.badgeName
    }
  });
}

/**
 * Remind about upcoming live event
 */
export async function notifyEventReminder(params: {
  userId: string;
  childId?: string;
  eventTitle: string;
  scheduledAt: Date;
  actionUrl?: string;
}): Promise<void> {
  await createNotification({
    userId: params.userId,
    childId: params.childId,
    type: 'EVENT_REMINDER',
    recipient: params.childId ? 'BOTH' : 'PARENT',
    titleEs: `Recordatorio: ${params.eventTitle}`,
    titleEn: `Reminder: ${params.eventTitle}`,
    messageEs: `El evento "${params.eventTitle}" comienza pronto. ¡No te lo pierdas!`,
    messageEn: `The event "${params.eventTitle}" starts soon. Don't miss it!`,
    actionUrl: params.actionUrl || '/events',
    sendEmailNotification: true,
    emailData: {
      eventTitle: params.eventTitle
    }
  });
}

/**
 * Notify about expiring subscription
 */
export async function notifySubscriptionExpiring(params: {
  userId: string;
  daysRemaining: number;
  actionUrl?: string;
}): Promise<void> {
  await createNotification({
    userId: params.userId,
    type: 'SUBSCRIPTION_EXPIRING',
    recipient: 'PARENT',
    titleEs: `Tu suscripción vence pronto`,
    titleEn: 'Your subscription expires soon',
    messageEs: `Tu suscripción vence en ${params.daysRemaining} días. Renueva ahora para mantener el acceso.`,
    messageEn: `Your subscription expires in ${params.daysRemaining} days. Renew now to maintain access.`,
    actionUrl: params.actionUrl || '/subscription',
    sendEmailNotification: true,
    emailData: {
      daysRemaining: params.daysRemaining
    }
  });
}

/**
 * Send system announcement
 */
export async function notifySystemAnnouncement(params: {
  userId: string;
  titleEs: string;
  titleEn: string;
  messageEs: string;
  messageEn: string;
  actionUrl?: string;
}): Promise<void> {
  await createNotification({
    userId: params.userId,
    type: 'SYSTEM_ANNOUNCEMENT',
    recipient: 'PARENT',
    titleEs: params.titleEs,
    titleEn: params.titleEn,
    messageEs: params.messageEs,
    messageEn: params.messageEn,
    actionUrl: params.actionUrl,
    sendEmailNotification: true
  });
}

/**
 * Get unread notifications for a user
 */
export async function getUnreadNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: {
      userId,
      isRead: false
    },
    include: {
      child: {
        select: {
          name: true,
          superheroName: true,
          avatarUrl: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

/**
 * Get all notifications for a user (paginated)
 */
export async function getNotifications(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      include: {
        child: {
          select: {
            name: true,
            superheroName: true,
            avatarUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    }),
    prisma.notification.count({ where: { userId } })
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date()
    }
  });
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: {
      isRead: true,
      readAt: new Date()
    }
  });
}
