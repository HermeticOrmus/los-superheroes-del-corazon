'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { childrenApi } from '@/lib/api';

export default function NewChildPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.age) {
      setError('Todos los campos son requeridos');
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 3 || age > 17) {
      setError('La edad debe estar entre 3 y 17 años');
      return;
    }

    setLoading(true);

    try {
      const child = await childrenApi.create({
        name: formData.name,
        age: age,
      });

      // Redirect to child detail page
      router.push(`/dashboard/children/${child.id}`);
    } catch (err: any) {
      setError(err.message || 'Error al crear el perfil. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/dashboard/children">
        <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Hijos
        </Button>
      </Link>

      {/* Form Card */}
      <Card className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agregar Nuevo Hijo
          </h1>
          <p className="text-gray-600">
            Crea un perfil para que tu hijo pueda comenzar su aventura como Superhéroe del Corazón
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Ej: María González"
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              El nombre real de tu hijo
            </p>
          </div>

          {/* Age Field */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Edad <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="age"
                type="number"
                required
                min="3"
                max="17"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Ej: 8"
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Edad actual (entre 3 y 17 años)
            </p>
          </div>

          {/* Age-based info */}
          {formData.age && parseInt(formData.age) >= 3 && parseInt(formData.age) <= 17 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                Configuración de Seguridad Automática
              </h4>
              <p className="text-sm text-blue-800">
                {parseInt(formData.age) <= 6 && (
                  <>🔒 <strong>Modo Súper Seguro</strong> - Requiere asistencia de padres para todas las actividades</>
                )}
                {parseInt(formData.age) >= 7 && parseInt(formData.age) <= 9 && (
                  <>🛡️ <strong>Modo Seguro</strong> - Puede explorar con supervisión parental</>
                )}
                {parseInt(formData.age) >= 10 && parseInt(formData.age) <= 12 && (
                  <>⚡ <strong>Modo Independiente</strong> - Mayor autonomía con moderación activa</>
                )}
                {parseInt(formData.age) >= 13 && (
                  <>🌟 <strong>Modo Completo</strong> - Acceso completo con moderación</>
                )}
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-gold-50 border border-gold-200 rounded-lg p-4">
            <h4 className="font-semibold text-gold-900 mb-2">
              ¿Qué sucede después?
            </h4>
            <ul className="text-sm text-gold-800 space-y-1">
              <li>• Se generará un <strong>código secreto</strong> único para tu hijo</li>
              <li>• Tu hijo completará una <strong>ceremonia de iniciación</strong> interactiva</li>
              <li>• Elegirá su <strong>nombre de superhéroe</strong> y arcángel protector</li>
              <li>• Recibirá <strong>100 Puntos Luz</strong> de bienvenida y su primera insignia</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Link href="/dashboard/children" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creando perfil...
                </div>
              ) : (
                'Crear Perfil'
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Help Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Nota:</strong> Puedes agregar hasta 5 hijos a tu cuenta. Cada uno tendrá su propio perfil, progreso y configuración de seguridad personalizada.
        </p>
      </div>
    </div>
  );
}
