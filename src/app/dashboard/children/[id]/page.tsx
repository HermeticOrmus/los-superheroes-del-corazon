'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Star,
  Shield,
  Trophy,
  Target,
  Calendar,
  Award,
  TrendingUp,
  Settings,
  Edit,
  AlertCircle
} from 'lucide-react';
import { childrenApi } from '@/lib/api';

interface Child {
  id: string;
  name: string;
  superheroName: string;
  age: number;
  luzPoints: number;
  rank: 'INICIADO' | 'VALIENTE' | 'SABIO' | 'MAESTRO';
  initiationCompleted: boolean;
  requiresParentAssistance: boolean;
  secretCode: string;
  archangel: {
    id: string;
    nameEs: string;
    power: string;
    colorHex: string;
    illustrationUrl?: string;
  };
  createdAt: string;
}

export default function ChildDetailPage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.id as string;

  const [child, setChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (childId) {
      fetchChildDetails();
    }
  }, [childId]);

  const fetchChildDetails = async () => {
    try {
      const data = await childrenApi.getById(childId);
      setChild(data);
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
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !child) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error || 'No se encontró el perfil'}</p>
          <Link href="/dashboard/children">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const getRankBadge = (rank: string) => {
    const badges = {
      INICIADO: { label: 'Iniciado', color: 'bg-gray-100 text-gray-700', next: 'Valiente' },
      VALIENTE: { label: 'Valiente', color: 'bg-red-100 text-red-700', next: 'Sabio' },
      SABIO: { label: 'Sabio', color: 'bg-blue-100 text-blue-700', next: 'Maestro' },
      MAESTRO: { label: 'Maestro', color: 'bg-gold-100 text-gold-700', next: null }
    };
    return badges[rank as keyof typeof badges] || badges.INICIADO;
  };

  const getAssistanceMode = (requiresAssistance: boolean, age: number) => {
    if (age <= 6) return { icon: '🔒', text: 'Modo Súper Seguro', color: 'text-red-600' };
    if (age <= 9) return { icon: '🛡️', text: 'Modo Seguro', color: 'text-orange-600' };
    if (age <= 12) return { icon: '⚡', text: 'Modo Independiente', color: 'text-blue-600' };
    return { icon: '🌟', text: 'Modo Completo', color: 'text-green-600' };
  };

  const rankBadge = getRankBadge(child.rank);
  const assistanceMode = getAssistanceMode(child.requiresParentAssistance, child.age);
  const memberSince = new Date(child.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/children">
        <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Hijos
        </Button>
      </Link>

      {/* Hero Card */}
      <Card className="overflow-hidden">
        <div
          className="h-3"
          style={{ backgroundColor: child.archangel.colorHex }}
        />
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-xl"
                style={{ backgroundColor: child.archangel.colorHex }}
              >
                {child.superheroName.charAt(0)}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {child.superheroName}
                  </h1>
                  <p className="text-lg text-gray-600">{child.name}</p>
                  <p className="text-sm text-gray-500">{child.age} años · Miembro desde {memberSince}</p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/dashboard/children/${child.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </Link>
                  <Link href={`/dashboard/children/${child.id}/safety`}>
                    <Button variant="outline" size="sm">
                      <Shield className="w-4 h-4 mr-2" />
                      Seguridad
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gold-50 rounded-lg p-4">
                  <div className="flex items-center text-gold-600 mb-2">
                    <Star className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Puntos Luz</span>
                  </div>
                  <p className="text-2xl font-bold text-gold-700">{child.luzPoints}</p>
                </div>

                <div className="bg-primary-50 rounded-lg p-4">
                  <div className="flex items-center text-primary-600 mb-2">
                    <Trophy className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Rango</span>
                  </div>
                  <p className="text-lg font-bold text-primary-700">{rankBadge.label}</p>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center text-blue-600 mb-2">
                    <Target className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Arcángel</span>
                  </div>
                  <p className="text-sm font-bold" style={{ color: child.archangel.colorHex }}>
                    {child.archangel.nameEs.split(' ')[1]}
                  </p>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center text-purple-600 mb-2">
                    <Award className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Iniciación</span>
                  </div>
                  <p className="text-sm font-bold text-purple-700">
                    {child.initiationCompleted ? 'Completada' : 'Pendiente'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Settings & Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Secret Code Card */}
          <Card className="p-6 bg-gradient-to-br from-primary-50 to-gold-50">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary-600" />
              Código Secreto
            </h3>
            <div className="bg-white rounded-lg p-4 text-center border-2 border-dashed border-primary-300">
              <p className="text-3xl font-mono font-bold text-primary-700 tracking-widest">
                {child.secretCode}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Comparte este código con tu hijo para que pueda ingresar
              </p>
            </div>
          </Card>

          {/* Safety Settings Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary-600" />
              Configuración de Seguridad
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Modo de Seguridad</span>
                <span className={`text-sm font-medium ${assistanceMode.color}`}>
                  {assistanceMode.icon} {assistanceMode.text}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Asistencia de Padres</span>
                <span className="text-sm font-medium">
                  {child.requiresParentAssistance ? 'Requerida' : 'No requerida'}
                </span>
              </div>
              <Link href={`/dashboard/children/${child.id}/safety`}>
                <Button variant="outline" className="w-full mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Gestionar Seguridad
                </Button>
              </Link>
            </div>
          </Card>

          {/* Archangel Card */}
          <Card className="p-6" style={{ borderTop: `4px solid ${child.archangel.colorHex}` }}>
            <h3 className="font-semibold text-gray-900 mb-3">
              Arcángel Protector
            </h3>
            <div className="text-center">
              <h4 className="text-xl font-bold mb-2" style={{ color: child.archangel.colorHex }}>
                {child.archangel.nameEs}
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Poder: {child.archangel.power}
              </p>
              {child.archangel.illustrationUrl && (
                <img
                  src={child.archangel.illustrationUrl}
                  alt={child.archangel.nameEs}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Activity & Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          {!child.initiationCompleted && (
            <Card className="p-6 bg-gradient-to-br from-gold-50 to-gold-100 border-gold-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-gold-500 rounded-full">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Ceremonia de Iniciación Pendiente
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    {child.superheroName} aún no ha completado su ceremonia de iniciación. Una vez completada, recibirá su primer insignia y 100 Puntos Luz de bienvenida.
                  </p>
                  <Link href={`/onboarding/${child.secretCode}`}>
                    <Button className="bg-gold-600 hover:bg-gold-700 text-white">
                      <Trophy className="w-4 h-4 mr-2" />
                      Comenzar Ceremonia
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {/* Current Mission Card */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Target className="w-6 h-6 mr-2 text-primary-600" />
              Misión Actual
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">
                Aún no hay progreso en la misión de este mes
              </p>
              <Button variant="outline">
                Ver Misiones Disponibles
              </Button>
            </div>
          </Card>

          {/* Recent Activity Card */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  No hay actividad reciente todavía
                </p>
              </div>
            </div>
          </Card>

          {/* Achievements Card */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-gold-600" />
              Logros y Recompensas
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  Aún no hay logros desbloqueados
                </p>
                <Button variant="outline">
                  Ver Catálogo de Recompensas
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
