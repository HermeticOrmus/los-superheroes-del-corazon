'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  TrendingUp,
  Award,
  Bell,
  Plus,
  Shield,
  Star,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { dashboardApi } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalLuzPoints: 0,
    completedChallenges: 0,
    unreadNotifications: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, activityData] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentActivity()
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Hijos Registrados',
      value: stats.totalChildren,
      icon: Users,
      color: 'bg-primary-100 text-primary-600',
      trend: null
    },
    {
      title: 'Puntos Luz Totales',
      value: stats.totalLuzPoints,
      icon: Star,
      color: 'bg-gold-100 text-gold-600',
      trend: '+120 esta semana'
    },
    {
      title: 'Retos Completados',
      value: stats.completedChallenges,
      icon: Target,
      color: 'bg-blue-100 text-blue-600',
      trend: '+3 esta semana'
    },
    {
      title: 'Notificaciones',
      value: stats.unreadNotifications,
      icon: Bell,
      color: 'bg-red-100 text-red-600',
      trend: null
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel General
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido al Club de los Superhéroes del Corazón
          </p>
        </div>
        <Link href="/dashboard/children/new">
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Agregar Hijo
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              {stat.trend && (
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.trend}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Actividad Reciente
            </h2>
            <Link href="/dashboard/notifications">
              <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                Ver Todo
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="p-2 bg-primary-100 rounded-full">
                  <Award className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {activity.childName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.action}
                  </p>
                  {activity.points && (
                    <p className="text-sm font-semibold text-gold-600 mt-1">
                      +{activity.points} Puntos Luz
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {activity.time}
                </span>
              </div>
            ))}

            {recentActivity.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay actividad reciente
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Acciones Rápidas
          </h2>

          <div className="space-y-3">
            <Link href="/dashboard/children">
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">
                    Ver Mis Hijos
                  </span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </Link>

            <Link href="/dashboard/children/new">
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <div className="flex items-center">
                  <Plus className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">
                    Agregar Nuevo Hijo
                  </span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </Link>

            <Link href="/dashboard/settings">
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">
                    Configuración de Seguridad
                  </span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </Link>

            <Link href="/dashboard/notifications">
              <button className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-all">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="font-medium text-gray-900">
                    Ver Notificaciones
                  </span>
                </div>
                {stats.unreadNotifications > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {stats.unreadNotifications}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
