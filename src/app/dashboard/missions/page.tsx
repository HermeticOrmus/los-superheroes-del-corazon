'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Target,
  Play,
  CheckCircle,
  Clock,
  Award,
  ArrowRight,
  Lock,
  Sparkles,
} from 'lucide-react';
import { missionsApi, childrenApi, challengesApi } from '@/lib/api';

interface Mission {
  id: string;
  title: string;
  description: string;
  valueLesson: string;
  videoUrl?: string;
  month: string;
  year: number;
  archangelId: string;
  luzPointsReward: number;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'TEXT';
  weekNumber: number;
  luzPointsReward: number;
}

interface ChildProgress {
  childId: string;
  childName: string;
  challengesCompleted: number;
  totalChallenges: number;
  started: boolean;
}

export default function MissionsPage() {
  const [currentMission, setCurrentMission] = useState<Mission | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [childrenProgress, setChildrenProgress] = useState<Record<string, ChildProgress>>({});
  const [loading, setLoading] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    loadMissionData();
  }, []);

  const loadMissionData = async () => {
    try {
      // Load current mission
      const mission = await missionsApi.getCurrentMission();
      setCurrentMission(mission);

      // Load challenges for this mission
      if (mission) {
        const missionChallenges = await challengesApi.getForMission(mission.id);
        setChallenges(missionChallenges.sort((a: Challenge, b: Challenge) => a.weekNumber - b.weekNumber));
      }

      // Load children
      const childrenData = await childrenApi.getAll();
      setChildren(childrenData);

      // Load progress for each child
      if (mission && childrenData.length > 0) {
        const progressData: Record<string, ChildProgress> = {};
        for (const child of childrenData) {
          const progress = await missionsApi.getChildProgress(child.id);
          const missionProgress = progress.find((p: any) => p.missionId === mission.id);
          progressData[child.id] = {
            childId: child.id,
            childName: child.name,
            challengesCompleted: missionProgress?.completedCount || 0,
            totalChallenges: challenges.length,
            started: !!missionProgress,
          };
        }
        setChildrenProgress(progressData);
      }
    } catch (error) {
      console.error('Error loading mission data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMission = async (childId: string) => {
    try {
      if (!currentMission) return;
      await missionsApi.startMission(currentMission.id, childId);
      loadMissionData(); // Reload to update progress
    } catch (error) {
      console.error('Error starting mission:', error);
      alert('Error al iniciar la misión');
    }
  };

  const getProgressColor = (completed: number, total: number) => {
    const percentage = (completed / total) * 100;
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando misión...</p>
        </div>
      </div>
    );
  }

  if (!currentMission) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center">
          <Target className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No hay misión activa</h2>
          <p className="text-gray-600 mb-6">
            La próxima misión estará disponible pronto
          </p>
          <Button variant="outline">Ver Misiones Pasadas</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Misión del Mes</h1>
        <p className="text-gray-600">
          <Calendar className="inline w-4 h-4 mr-1" />
          {currentMission.month} {currentMission.year}
        </p>
      </div>

      {/* Mission Hero Card */}
      <Card className="overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <Badge className="mb-3 bg-purple-100 text-purple-700">
                Misión {new Date().toLocaleDateString('es-ES', { month: 'long' })}
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{currentMission.title}</h2>
              <p className="text-lg text-gray-700 mb-4">{currentMission.description}</p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex items-start">
                  <Sparkles className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-800 mb-1">Lección de Valores:</p>
                    <p className="text-yellow-700">{currentMission.valueLesson}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center text-gray-600">
                  <Award className="w-5 h-5 mr-2 text-gold-600" />
                  <span className="font-semibold">{currentMission.luzPointsReward} Puntos Luz</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Target className="w-5 h-5 mr-2 text-blue-600" />
                  <span>{challenges.length} Desafíos Semanales</span>
                </div>
              </div>
            </div>

            {currentMission.videoUrl && (
              <Button
                onClick={() => setShowVideo(!showVideo)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Ver Video
              </Button>
            )}
          </div>

          {/* Video Player */}
          {showVideo && currentMission.videoUrl && (
            <div className="mb-6 rounded-lg overflow-hidden bg-black">
              <video
                controls
                className="w-full"
                src={currentMission.videoUrl}
              >
                Tu navegador no soporta video.
              </video>
            </div>
          )}
        </div>
      </Card>

      {/* Weekly Challenges */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Desafíos Semanales</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {challenges.map((challenge, index) => {
            const isCompleted = false; // We'll implement this based on child progress
            const isLocked = index > 0 && !isCompleted; // Lock challenges until previous is complete

            return (
              <Card
                key={challenge.id}
                className={`p-6 ${isLocked ? 'opacity-60' : 'hover:shadow-lg'} transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : isLocked ? (
                        <Lock className="w-6 h-6 text-gray-400" />
                      ) : (
                        <Target className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-1">
                        Semana {challenge.weekNumber}
                      </Badge>
                      <h4 className="font-bold text-lg text-gray-800">{challenge.title}</h4>
                    </div>
                  </div>
                  {!isLocked && (
                    <Badge className="bg-gold-100 text-gold-700">
                      +{challenge.luzPointsReward} Luz
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{challenge.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Tipo: {challenge.type === 'PHOTO' ? 'Foto' : challenge.type === 'VIDEO' ? 'Video' : challenge.type === 'AUDIO' ? 'Audio' : 'Texto'}
                  </div>

                  {!isLocked && !isCompleted && (
                    <Button size="sm" variant="outline">
                      Completar
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Children Progress */}
      <Card className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Progreso de los Superhéroes</h3>
        {children.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            <p>No hay niños registrados aún</p>
            <Button className="mt-4" variant="outline">Agregar Niño</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {children.map((child) => {
              const progress = childrenProgress[child.id] || {
                challengesCompleted: 0,
                totalChallenges: challenges.length,
                started: false,
              };
              const percentage = challenges.length > 0 ? (progress.challengesCompleted / challenges.length) * 100 : 0;

              return (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: child.archangel?.colorHex || '#3b82f6' }}
                      >
                        {child.superheroName?.[0] || child.name[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{child.superheroName || child.name}</h4>
                        <p className="text-sm text-gray-600">
                          {progress.started ? `${progress.challengesCompleted}/${challenges.length} completados` : 'No iniciada'}
                        </p>
                      </div>
                    </div>

                    {progress.started && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`${getProgressColor(progress.challengesCompleted, challenges.length)} h-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{Math.round(percentage)}%</span>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    {!progress.started ? (
                      <Button
                        onClick={() => handleStartMission(child.id)}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Iniciar Misión
                      </Button>
                    ) : percentage === 100 ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completada
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        Continuar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
