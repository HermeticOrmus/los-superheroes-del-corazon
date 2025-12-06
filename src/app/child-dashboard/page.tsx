'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { childrenApi, missionsApi, rewardsApi } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Heart,
  Star,
  Trophy,
  Sparkles,
  Target,
  Gift,
  Crown,
  Zap,
  Award,
  TrendingUp,
} from 'lucide-react';

interface ChildData {
  id: string;
  name: string;
  superheroName: string;
  age: number;
  luzPoints: number;
  rank: 'INICIADO' | 'VALIENTE' | 'SABIO' | 'MAESTRO';
  initiationCompleted: boolean;
  archangel: {
    nameEs: string;
    colorHex: string;
  };
}

interface MissionProgress {
  missionId: string;
  missionTitle: string;
  challengesCompleted: number;
  totalChallenges: number;
  startedAt: string;
}

interface Reward {
  id: string;
  nameEs: string;
  type: 'BADGE' | 'DIGITAL' | 'PHYSICAL';
  imageUrl?: string;
}

export default function ChildDashboard() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [child, setChild] = useState<ChildData | null>(null);
  const [missionProgress, setMissionProgress] = useState<MissionProgress | null>(null);
  const [badges, setBadges] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated as child
    if (!user || profile?.role !== 'CHILD') {
      router.push('/login');
      return;
    }

    loadChildData();
  }, [user, profile, router]);

  const loadChildData = async () => {
    try {
      // In a real implementation, we'd get the child ID from the auth context
      // For now, we'll use a mock child from session storage
      const childSession = localStorage.getItem('child_session');
      if (childSession) {
        const childData = JSON.parse(childSession);
        setChild(childData);

        // Load mission progress
        try {
          const progress = await missionsApi.getChildProgress(childData.id);
          if (progress && progress.length > 0) {
            setMissionProgress(progress[0]);
          }
        } catch (err) {
          console.log('No mission progress yet');
        }

        // Load badges
        try {
          const childRewards = await rewardsApi.getChildRewards(childData.id);
          const badgeRewards = childRewards.filter((r: Reward) => r.type === 'BADGE');
          setBadges(badgeRewards);
        } catch (err) {
          console.log('No badges yet');
        }
      }
    } catch (error) {
      console.error('Error loading child data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'MAESTRO':
        return <Crown className="w-6 h-6" />;
      case 'SABIO':
        return <Star className="w-6 h-6" />;
      case 'VALIENTE':
        return <Trophy className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'MAESTRO':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'SABIO':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      case 'VALIENTE':
        return 'bg-gradient-to-r from-orange-500 to-red-500';
      default:
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Cargando tu panel de superhéroe...</p>
        </div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
        <Card className="p-8 text-center max-w-md">
          <p className="text-lg text-gray-600 mb-4">No se pudo cargar tu perfil</p>
          <Button onClick={() => router.push('/login')}>Volver al inicio</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Hero Profile Card */}
        <Card
          className="p-8 text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${child.archangel.colorHex}15 0%, ${child.archangel.colorHex}30 100%)`,
            borderColor: child.archangel.colorHex,
            borderWidth: '3px',
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <Heart className="w-full h-full" style={{ color: child.archangel.colorHex }} />
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div
                className={`${getRankColor(child.rank)} p-6 rounded-full`}
              >
                {getRankIcon(child.rank)}
                <span className="sr-only">{child.rank}</span>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-2" style={{ color: child.archangel.colorHex }}>
              {child.superheroName}
            </h1>
            <p className="text-xl text-gray-600 mb-4">({child.name})</p>

            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <span className="text-3xl font-bold text-yellow-600">{child.luzPoints}</span>
                </div>
                <p className="text-sm text-gray-600">Puntos Luz</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-6 h-6 text-orange-500" />
                  <span className="text-2xl font-bold text-gray-700">{child.rank}</span>
                </div>
                <p className="text-sm text-gray-600">Rango</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-700">
              <Heart className="w-5 h-5" style={{ color: child.archangel.colorHex }} />
              <span className="font-medium">Protegido por {child.archangel.nameEs}</span>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Current Mission Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Misión Actual</h2>
                <p className="text-sm text-gray-600">Tu próximo desafío</p>
              </div>
            </div>

            {missionProgress ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {missionProgress.missionTitle}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
                        style={{
                          width: `${(missionProgress.challengesCompleted / missionProgress.totalChallenges) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {missionProgress.challengesCompleted}/{missionProgress.totalChallenges}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {missionProgress.challengesCompleted === missionProgress.totalChallenges
                      ? '¡Misión completada! 🎉'
                      : `${missionProgress.totalChallenges - missionProgress.challengesCompleted} desafíos restantes`}
                  </p>
                </div>
                <Button
                  className="w-full"
                  style={{
                    backgroundColor: child.archangel.colorHex,
                  }}
                >
                  Continuar Misión
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No tienes una misión activa</p>
                <Button
                  variant="outline"
                  style={{
                    borderColor: child.archangel.colorHex,
                    color: child.archangel.colorHex,
                  }}
                >
                  Explorar Misiones
                </Button>
              </div>
            )}
          </Card>

          {/* Badges Collection Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Mis Insignias</h2>
                <p className="text-sm text-gray-600">Logros desbloqueados</p>
              </div>
            </div>

            {badges.length > 0 ? (
              <div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {badges.slice(0, 8).map((badge) => (
                    <div
                      key={badge.id}
                      className="aspect-square bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-2 flex items-center justify-center border-2 border-yellow-300 hover:scale-105 transition-transform cursor-pointer"
                      title={badge.nameEs}
                    >
                      {badge.imageUrl ? (
                        <img src={badge.imageUrl} alt={badge.nameEs} className="w-full h-full object-contain" />
                      ) : (
                        <Star className="w-full h-full text-yellow-600" />
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">
                  Ver Todas ({badges.length})
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Aún no tienes insignias</p>
                <p className="text-sm text-gray-500">Completa misiones para ganar insignias</p>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-8 h-8 text-purple-600" />
              <h3 className="font-bold text-gray-800">Tienda de Recompensas</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Canjea tus Puntos Luz por premios increíbles
            </p>
            <Button
              size="sm"
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
            >
              Explorar
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-gray-800">Mi Progreso</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Ve cuánto has crecido como superhéroe
            </p>
            <Button
              size="sm"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Ver Estadísticas
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-8 h-8 text-green-600" />
              <h3 className="font-bold text-gray-800">Meditaciones</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Practica mindfulness y fortalece tu corazón
            </p>
            <Button
              size="sm"
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              Meditar Ahora
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
