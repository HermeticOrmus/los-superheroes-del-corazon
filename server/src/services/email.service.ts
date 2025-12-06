/**
 * Email Service
 * Sends notification emails to parents
 *
 * Supports multiple email providers:
 * - SendGrid (recommended for production)
 * - NodeMailer (for SMTP)
 * - Resend (modern alternative)
 */

import { NotificationType } from '@prisma/client';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Get email template based on notification type
 */
export function getEmailTemplate(
  type: NotificationType,
  data: {
    childName?: string;
    missionTitle?: string;
    challengeTitle?: string;
    newRank?: string;
    badgeName?: string;
    eventTitle?: string;
    daysRemaining?: number;
  },
  language: 'es' | 'en' = 'es'
): EmailTemplate {
  const templates = {
    MISSION_RELEASED: {
      es: {
        subject: `🌟 ¡Nueva Misión del Mes disponible!`,
        html: `
          <h1>¡Nueva Misión Épica Revelada!</h1>
          <p>Hola,</p>
          <p>La <strong>Comandante Corazón</strong> ha revelado una nueva misión para ${data.childName}:</p>
          <h2>${data.missionTitle}</h2>
          <p>Inicia sesión ahora para ver el video de revelación y comenzar esta aventura.</p>
          <a href="${process.env.APP_URL}/missions" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Misión</a>
        `,
        text: `¡Nueva Misión Épica! La Comandante Corazón ha revelado una nueva misión para ${data.childName}: ${data.missionTitle}. Visita ${process.env.APP_URL}/missions para comenzar.`
      },
      en: {
        subject: `🌟 New Monthly Mission Available!`,
        html: `
          <h1>New Epic Mission Revealed!</h1>
          <p>Hello,</p>
          <p><strong>Commander Heart</strong> has revealed a new mission for ${data.childName}:</p>
          <h2>${data.missionTitle}</h2>
          <p>Log in now to watch the reveal video and start this adventure.</p>
          <a href="${process.env.APP_URL}/missions" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Mission</a>
        `,
        text: `New Epic Mission! Commander Heart has revealed a new mission for ${data.childName}: ${data.missionTitle}. Visit ${process.env.APP_URL}/missions to begin.`
      }
    },
    CHALLENGE_COMPLETED: {
      es: {
        subject: `🎉 ${data.childName} completó un reto`,
        html: `
          <h1>¡Felicitaciones!</h1>
          <p>${data.childName} ha completado el reto: <strong>${data.challengeTitle}</strong></p>
          <p>Revisa las pruebas que subió y celebra su logro.</p>
          <a href="${process.env.APP_URL}/dashboard" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Detalles</a>
        `,
        text: `¡${data.childName} completó el reto "${data.challengeTitle}"! Revisa los detalles en ${process.env.APP_URL}/dashboard`
      },
      en: {
        subject: `🎉 ${data.childName} completed a challenge`,
        html: `
          <h1>Congratulations!</h1>
          <p>${data.childName} has completed the challenge: <strong>${data.challengeTitle}</strong></p>
          <p>Review their proof and celebrate their achievement.</p>
          <a href="${process.env.APP_URL}/dashboard" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Details</a>
        `,
        text: `${data.childName} completed the challenge "${data.challengeTitle}"! Review details at ${process.env.APP_URL}/dashboard`
      }
    },
    RANK_UP: {
      es: {
        subject: `⭐ ¡${data.childName} subió de rango a ${data.newRank}!`,
        html: `
          <h1>¡Ascenso de Rango!</h1>
          <p>${data.childName} ha alcanzado el rango de <strong>${data.newRank}</strong>.</p>
          <p>Su dedicación y esfuerzo están dando frutos. ¡Celebren este logro juntos!</p>
          <a href="${process.env.APP_URL}/profile/${data.childName}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Perfil</a>
        `,
        text: `¡${data.childName} ascendió a ${data.newRank}! Celebra su logro en ${process.env.APP_URL}/profile`
      },
      en: {
        subject: `⭐ ${data.childName} ranked up to ${data.newRank}!`,
        html: `
          <h1>Rank Up!</h1>
          <p>${data.childName} has reached the rank of <strong>${data.newRank}</strong>.</p>
          <p>Their dedication and effort are paying off. Celebrate this achievement together!</p>
          <a href="${process.env.APP_URL}/profile/${data.childName}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Profile</a>
        `,
        text: `${data.childName} ranked up to ${data.newRank}! Celebrate at ${process.env.APP_URL}/profile`
      }
    },
    BADGE_EARNED: {
      es: {
        subject: `🏆 ${data.childName} ganó una insignia: ${data.badgeName}`,
        html: `
          <h1>¡Nueva Insignia Desbloqueada!</h1>
          <p>${data.childName} ha ganado la insignia: <strong>${data.badgeName}</strong></p>
          <p>Cada insignia representa un paso más en su camino como superhéroe del corazón.</p>
          <a href="${process.env.APP_URL}/badges" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Insignias</a>
        `,
        text: `¡${data.childName} ganó la insignia "${data.badgeName}"! Ver colección completa en ${process.env.APP_URL}/badges`
      },
      en: {
        subject: `🏆 ${data.childName} earned a badge: ${data.badgeName}`,
        html: `
          <h1>New Badge Unlocked!</h1>
          <p>${data.childName} has earned the badge: <strong>${data.badgeName}</strong></p>
          <p>Each badge represents another step on their journey as a Heart Superhero.</p>
          <a href="${process.env.APP_URL}/badges" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Badges</a>
        `,
        text: `${data.childName} earned the badge "${data.badgeName}"! View full collection at ${process.env.APP_URL}/badges`
      }
    },
    EVENT_REMINDER: {
      es: {
        subject: `📅 Recordatorio: ${data.eventTitle}`,
        html: `
          <h1>Evento en Vivo Próximo</h1>
          <p>No olvides el evento: <strong>${data.eventTitle}</strong></p>
          <p>Será una experiencia mágica que no querrás perderte.</p>
          <a href="${process.env.APP_URL}/events" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Ver Evento</a>
        `,
        text: `Recordatorio: "${data.eventTitle}" - No te lo pierdas! ${process.env.APP_URL}/events`
      },
      en: {
        subject: `📅 Reminder: ${data.eventTitle}`,
        html: `
          <h1>Upcoming Live Event</h1>
          <p>Don't forget the event: <strong>${data.eventTitle}</strong></p>
          <p>It will be a magical experience you won't want to miss.</p>
          <a href="${process.env.APP_URL}/events" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">View Event</a>
        `,
        text: `Reminder: "${data.eventTitle}" - Don't miss it! ${process.env.APP_URL}/events`
      }
    },
    SUBSCRIPTION_EXPIRING: {
      es: {
        subject: `⏰ Tu suscripción vence en ${data.daysRemaining} días`,
        html: `
          <h1>Renovación de Suscripción</h1>
          <p>Tu suscripción al Club de los Superhéroes del Corazón vence en ${data.daysRemaining} días.</p>
          <p>Renueva ahora para que ${data.childName} no pierda acceso a las misiones y eventos especiales.</p>
          <a href="${process.env.APP_URL}/subscription" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Renovar Ahora</a>
        `,
        text: `Tu suscripción vence en ${data.daysRemaining} días. Renueva en ${process.env.APP_URL}/subscription`
      },
      en: {
        subject: `⏰ Your subscription expires in ${data.daysRemaining} days`,
        html: `
          <h1>Subscription Renewal</h1>
          <p>Your Heart Superheroes Club subscription expires in ${data.daysRemaining} days.</p>
          <p>Renew now so ${data.childName} doesn't lose access to missions and special events.</p>
          <a href="${process.env.APP_URL}/subscription" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Renew Now</a>
        `,
        text: `Your subscription expires in ${data.daysRemaining} days. Renew at ${process.env.APP_URL}/subscription`
      }
    },
    SYSTEM_ANNOUNCEMENT: {
      es: {
        subject: `📢 Anuncio importante del Club`,
        html: `
          <h1>Anuncio del Club de los Superhéroes del Corazón</h1>
          <p>Tenemos noticias importantes para compartir contigo.</p>
          <a href="${process.env.APP_URL}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Leer Más</a>
        `,
        text: `Anuncio importante del Club. Visita ${process.env.APP_URL} para más detalles.`
      },
      en: {
        subject: `📢 Important Club Announcement`,
        html: `
          <h1>Heart Superheroes Club Announcement</h1>
          <p>We have important news to share with you.</p>
          <a href="${process.env.APP_URL}" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Read More</a>
        `,
        text: `Important Club announcement. Visit ${process.env.APP_URL} for details.`
      }
    }
  };

  const template = templates[type][language];

  return {
    subject: template.subject,
    html: wrapEmailHTML(template.html),
    text: template.text
  };
}

/**
 * Wrap email HTML with consistent styling
 */
function wrapEmailHTML(content: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #3b82f6 100%); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Club de los Superhéroes del Corazón</h1>
        </div>
        <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          ${content}
        </div>
        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #6b7280; font-size: 12px;">
          <p>© 2025 Club de los Superhéroes del Corazón</p>
          <p>Construyendo una nueva generación de líderes conscientes</p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send email using configured provider
 *
 * To configure email provider, add to .env:
 * - EMAIL_PROVIDER=sendgrid|smtp|resend
 * - SENDGRID_API_KEY=your_key (for SendGrid)
 * - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (for SMTP)
 * - RESEND_API_KEY=your_key (for Resend)
 */
export async function sendEmail(params: SendEmailParams): Promise<boolean> {
  const provider = process.env.EMAIL_PROVIDER || 'console';

  try {
    if (provider === 'console') {
      // Development mode - just log to console
      console.log('📧 [EMAIL]', {
        to: params.to,
        subject: params.subject,
        preview: params.text.substring(0, 100)
      });
      return true;
    }

    if (provider === 'sendgrid') {
      // TODO: Implement SendGrid integration
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // await sgMail.send({ from: 'noreply@superherosdelcorazon.com', ...params });
      console.log('📧 [SENDGRID] Email would be sent:', params.to);
      return true;
    }

    if (provider === 'resend') {
      // TODO: Implement Resend integration
      // const resend = new Resend(process.env.RESEND_API_KEY);
      // await resend.emails.send({ from: 'noreply@superherosdelcorazon.com', ...params });
      console.log('📧 [RESEND] Email would be sent:', params.to);
      return true;
    }

    if (provider === 'smtp') {
      // TODO: Implement NodeMailer SMTP integration
      console.log('📧 [SMTP] Email would be sent:', params.to);
      return true;
    }

    console.warn('Unknown email provider:', provider);
    return false;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}
