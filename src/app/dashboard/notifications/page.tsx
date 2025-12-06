'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bell,
  Check,
  CheckCheck,
  Trophy,
  Star,
  Target,
  Calendar,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { notificationsApi } from '@/lib/api';

interface Notification {
  id: string;
  type: 'MISSION_RELEASED' | 'CHALLENGE_COMPLETED' | 'RANK_UP' | 'BADGE_EARNED' | 'EVENT_REMINDER' | 'SUBSCRIPTION_EXPIRING' | 'SYSTEM_ANNOUNCEMENT';
  titleEs: string;
  messageEs: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  childName?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.getAll();
      setNotifications(data.notifications);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      MISSION_RELEASED: Target,
      CHALLENGE_COMPLETED: Trophy,
      RANK_UP: Star,
      BADGE_EARNED: Trophy,
      EVENT_REMINDER: Calendar,
      SUBSCRIPTION_EXPIRING: AlertCircle,
      SYSTEM_ANNOUNCEMENT: Bell
    };
    return icons[type] || Bell;
  };

  const getNotificationColor = (type: Notification['type']) => {
    const colors = {
      MISSION_RELEASED: 'bg-blue-100 text-blue-600',
      CHALLENGE_COMPLETED: 'bg-green-100 text-green-600',
      RANK_UP: 'bg-gold-100 text-gold-600',
      BADGE_EARNED: 'bg-purple-100 text-purple-600',
      EVENT_REMINDER: 'bg-primary-100 text-primary-600',
      SUBSCRIPTION_EXPIRING: 'bg-red-100 text-red-600',
      SYSTEM_ANNOUNCEMENT: 'bg-gray-100 text-gray-600'
    };
    return colors[type] || colors.SYSTEM_ANNOUNCEMENT;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Hace menos de 1 hora';
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;

    return date.toLocaleDateString('es-ES', { month: 'long', day: 'numeric' });
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err: any) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    // Note: Delete endpoint not implemented in backend yet
    // For now, just remove from local state
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0
              ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`
              : 'No tienes notificaciones sin leer'
            }
          </p>
        </div>

        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              className="border-primary-300 text-primary-700 hover:bg-primary-50"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            filter === 'all'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            filter === 'unread'
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Sin leer ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay notificaciones
              </h3>
              <p className="text-gray-600">
                {filter === 'unread'
                  ? 'No tienes notificaciones sin leer en este momento'
                  : 'No tienes notificaciones todavía'
                }
              </p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);

            return (
              <Card
                key={notification.id}
                className={`p-4 hover:shadow-md transition-all ${
                  !notification.isRead ? 'border-l-4 border-l-primary-500 bg-primary-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${colorClass} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {notification.titleEs}
                        </h3>
                        <p className="text-gray-700 text-sm mb-2">
                          {notification.messageEs}
                        </p>
                        {notification.childName && (
                          <p className="text-primary-600 text-sm font-medium mb-2">
                            {notification.childName}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Marcar como leída"
                          >
                            <Check className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Action Button */}
                    {notification.actionUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 border-primary-300 text-primary-700 hover:bg-primary-50"
                        onClick={() => window.location.href = notification.actionUrl!}
                      >
                        Ver Detalles
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
