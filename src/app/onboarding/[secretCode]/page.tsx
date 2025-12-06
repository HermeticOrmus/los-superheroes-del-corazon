'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Sparkles,
  Shield,
  Star,
  Loader2,
  AlertCircle,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { archangelsApi, onboardingApi } from '@/lib/api';

type Step = 'welcome' | 'choose-archangel' | 'choose-name' | 'complete';

interface Archangel {
  id: string;
  nameEs: string;
  power: string;
  colorHex: string;
  illustrationUrl?: string;
  descriptionEs: string;
}

export default function OnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const secretCode = params.secretCode as string;

  const [step, setStep] = useState<Step>('welcome');
  const [archangels, setArchangels] = useState<Archangel[]>([]);
  const [selectedArchangel, setSelectedArchangel] = useState<string>('');
  const [superheroName, setSuperheroName] = useState('');
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArchangels();
  }, []);

  const fetchArchangels = async () => {
    try {
      const data = await archangelsApi.getAll();
      setArchangels(data);
    } catch (err: any) {
      setError('Error al cargar los arcángeles');
    }
  };

  const generateNameSuggestions = async (realName: string) => {
    try {
      const { suggestions } = await onboardingApi.generateSuperheroName({ realName });
      setNameSuggestions(suggestions);
    } catch (err) {
      // Fallback suggestions if API fails
      setNameSuggestions([
        'Corazón Valiente',
        'Luz del Corazón',
        'Guardián Luminoso',
        'Estrella del Alma'
      ]);
    }
  };

  const handleComplete = async () => {
    if (!selectedArchangel || !superheroName) {
      setError('Por favor completa todos los pasos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onboardingApi.completeOnboarding({
        secretCode,
        superheroName,
        archangelId: selectedArchangel
      });

      setStep('complete');
    } catch (err: any) {
      setError(err.message || 'Error al completar la iniciación');
    } finally {
      setLoading(false);
    }
  };

  // Welcome Step
  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-gold-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center">
          <div className="mb-8">
            <div className="inline-flex p-4 bg-primary-100 rounded-full mb-6">
              <Heart className="w-16 h-16 text-primary-600 fill-primary-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¡Bienvenido, Superhéroe!
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Estás a punto de comenzar una aventura extraordinaria. Eres parte de un equipo secreto internacional de niños que están cambiando el mundo desde el <span className="font-bold text-primary-600">corazón</span>.
            </p>
          </div>

          <div className="bg-gold-50 border-2 border-gold-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gold-900 mb-4 flex items-center justify-center">
              <Sparkles className="w-5 h-5 mr-2" />
              En esta ceremonia vas a:
            </h3>
            <ul className="text-left text-gold-800 space-y-2">
              <li className="flex items-start">
                <span className="mr-2">✨</span>
                <span>Elegir tu arcángel protector</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">⚡</span>
                <span>Crear tu nombre de superhéroe</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🏆</span>
                <span>Recibir tu primera insignia y 100 Puntos Luz</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => setStep('choose-archangel')}
            size="lg"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 text-lg font-bold"
          >
            Comenzar Mi Ceremonia
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Card>
      </div>
    );
  }

  // Choose Archangel Step
  if (step === 'choose-archangel') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-gold-50 to-blue-50 p-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Elige Tu Arcángel Protector
            </h2>
            <p className="text-lg text-gray-700">
              Cada arcángel tiene un poder especial que te guiará en tus misiones
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {archangels.map((archangel) => (
              <Card
                key={archangel.id}
                onClick={() => setSelectedArchangel(archangel.id)}
                className={`cursor-pointer transition-all hover:shadow-xl ${
                  selectedArchangel === archangel.id
                    ? 'ring-4 ring-primary-500 shadow-xl'
                    : 'hover:ring-2 hover:ring-primary-300'
                }`}
              >
                <div
                  className="h-3"
                  style={{ backgroundColor: archangel.colorHex }}
                />
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div
                      className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${archangel.colorHex}20` }}
                    >
                      <Shield className="w-10 h-10" style={{ color: archangel.colorHex }} />
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2" style={{ color: archangel.colorHex }}>
                      {archangel.nameEs}
                    </h3>
                    <p className="text-sm font-medium text-gray-600 mb-3">
                      {archangel.power}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {archangel.descriptionEs}
                    </p>
                  </div>
                  {selectedArchangel === archangel.id && (
                    <div className="bg-primary-50 rounded-lg p-3 text-center">
                      <p className="text-sm font-bold text-primary-700">
                        ✓ Seleccionado
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="max-w-md mx-auto">
            <Button
              onClick={() => {
                if (!selectedArchangel) {
                  setError('Por favor elige un arcángel');
                  return;
                }
                setError('');
                setStep('choose-name');
              }}
              disabled={!selectedArchangel}
              size="lg"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 text-lg font-bold"
            >
              Continuar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Choose Name Step
  if (step === 'choose-name') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-gold-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Elige Tu Nombre de Superhéroe
            </h2>
            <p className="text-lg text-gray-700">
              Este será tu nombre especial en el club
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Suggestions */}
            {nameSuggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Sugerencias mágicas para ti:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {nameSuggestions.map((name, index) => (
                    <button
                      key={index}
                      onClick={() => setSuperheroName(name)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        superheroName === name
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                O crea tu propio nombre:
              </label>
              <input
                type="text"
                value={superheroName}
                onChange={(e) => setSuperheroName(e.target.value)}
                maxLength={30}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg font-medium"
                placeholder="Ej: Corazón Valiente"
              />
              <p className="mt-1 text-xs text-gray-500">
                Máximo 30 caracteres
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => setStep('choose-archangel')}
                variant="outline"
                className="flex-1"
              >
                Volver
              </Button>
              <Button
                onClick={handleComplete}
                disabled={!superheroName || loading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Completando...
                  </>
                ) : (
                  <>
                    Completar Ceremonia
                    <Trophy className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Complete Step
  if (step === 'complete') {
    const selectedArch = archangels.find(a => a.id === selectedArchangel);

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-gold-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center">
          <div className="mb-8">
            <div className="inline-flex p-6 bg-gold-100 rounded-full mb-6 animate-pulse">
              <Trophy className="w-20 h-20 text-gold-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¡Bienvenido, {superheroName}!
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              Tu ceremonia de iniciación está completa
            </p>
          </div>

          <div className="bg-gradient-to-br from-gold-50 to-gold-100 border-2 border-gold-300 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-gold-900 mb-4 text-lg">
              Has recibido:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-3">
                <Star className="w-6 h-6 text-gold-600" />
                <span className="text-lg font-medium text-gold-900">100 Puntos Luz</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Trophy className="w-6 h-6 text-gold-600" />
                <span className="text-lg font-medium text-gold-900">Insignia "Iniciado"</span>
              </div>
              {selectedArch && (
                <div className="flex items-center justify-center space-x-3">
                  <Shield className="w-6 h-6" style={{ color: selectedArch.colorHex }} />
                  <span className="text-lg font-medium text-gold-900">
                    Protección de {selectedArch.nameEs}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => router.push('/child-dashboard')}
              size="lg"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-6 text-lg font-bold"
            >
              Ir a Mi Panel de Superhéroe
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-gray-600">
              ¡Tu aventura comienza ahora!
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
