'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Star,
  Shield,
  Eye,
  Settings,
  TrendingUp,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { childrenApi } from '@/lib/api';

interface Child {
  id: string;
  name: string;
  superheroName: string;
  age: number;
  avatarUrl?: string;
  luzPoints: number;
  rank: 'INICIADO' | 'VALIENTE' | 'SABIO' | 'MAESTRO';
  initiationCompleted: boolean;
  requiresParentAssistance: boolean;
  archangel: {
    nameEs: string;
    colorHex: string;
  };
}

export default function ChildrenPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const data = await childrenApi.getAll();
      setChildren(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: string) => {
    const badges = {
      INICIADO: { label: 'Iniciado', color: 'bg-gray-100 text-gray-700' },
      VALIENTE: { label: 'Valiente', color: 'bg-red-100 text-red-700' },
      SABIO: { label: 'Sabio', color: 'bg-blue-100 text-blue-700' },
      MAESTRO: { label: 'Maestro', color: 'bg-gold-100 text-gold-700' }
    };
    return badges[rank as keyof typeof badges] || badges.INICIADO;
  };

  const getAssistanceMode = (requiresAssistance: boolean, age: number) => {
    if (age <= 6) return { icon: '🔒', text: 'Modo Súper Seguro' };
    if (age <= 9) return { icon: '🛡️', text: 'Modo Seguro' };
    if (age <= 12) return { icon: '⚡', text: 'Modo Independiente' };
    return { icon: '🌟', text: 'Modo Completo' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Hijos</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los perfiles de tus superhéroes del corazón
          </p>
        </div>
        <Link href="/dashboard/children/new">
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Agregar Hijo
          </Button>
        </Link>
      </div>

      {/* Children Grid */}
      {children.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aún no has agregado ningún hijo
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando a tu primer superhéroe del corazón para que pueda iniciar su aventura
            </p>
            <Link href="/dashboard/children/new">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Agregar Primer Hijo
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => {
            const rankBadge = getRankBadge(child.rank);
            const assistanceMode = getAssistanceMode(child.requiresParentAssistance, child.age);

            return (
              <Card key={child.id} className="overflow-hidden hover:shadow-xl transition-all">
                {/* Card Header with Archangel Color */}
                <div
                  className="h-2"
                  style={{ backgroundColor: child.archangel.colorHex }}
                />

                <div className="p-6">
                  {/* Avatar & Name */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                        style={{ backgroundColor: child.archangel.colorHex }}
                      >
                        {child.superheroName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">
                          {child.superheroName}
                        </h3>
                        <p className="text-sm text-gray-600">{child.name}</p>
                        <p className="text-xs text-gray-500">{child.age} años</p>
                      </div>
                    </div>
                  </div>

                  {/* Rank & Points */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Rango:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rankBadge.color}`}>
                        {rankBadge.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Puntos Luz:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-gold-500 mr-1" />
                        <span className="font-bold text-gold-600">{child.luzPoints}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Arcángel:</span>
                      <span className="text-sm font-medium" style={{ color: child.archangel.colorHex }}>
                        {child.archangel.nameEs}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Seguridad:</span>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                        {assistanceMode.icon} {assistanceMode.text}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/children/${child.id}`} className="flex-1">
                      <Button variant="outline" className="w-full border-gray-300 hover:border-primary-500 hover:bg-primary-50 text-gray-700 hover:text-primary-700">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>
                    <Link href={`/dashboard/children/${child.id}/safety`}>
                      <Button variant="outline" size="icon" className="border-gray-300 hover:border-primary-500 hover:bg-primary-50 text-gray-700 hover:text-primary-700">
                        <Shield className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Progress Bar */}
                {!child.initiationCompleted && (
                  <div className="bg-gold-50 px-6 py-3 border-t border-gold-100">
                    <div className="flex items-center text-sm">
                      <Award className="w-4 h-4 text-gold-600 mr-2" />
                      <span className="text-gold-700 font-medium">
                        Iniciación pendiente
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats Summary */}
      {children.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-primary-50 to-gold-50">
          <h3 className="font-semibold text-gray-900 mb-4">Resumen General</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-lg">
                <Star className="w-6 h-6 text-gold-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Puntos Luz Totales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {children.reduce((sum, child) => sum + child.luzPoints, 0)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hijos Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {children.filter(c => c.initiationCompleted).length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-lg">
                <Shield className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Con Asistencia</p>
                <p className="text-2xl font-bold text-gray-900">
                  {children.filter(c => c.requiresParentAssistance).length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
