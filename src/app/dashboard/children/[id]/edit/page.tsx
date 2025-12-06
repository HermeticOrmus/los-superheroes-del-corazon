'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, AlertCircle, Loader2, Save } from 'lucide-react';
import { childrenApi } from '@/lib/api';

interface Child {
  id: string;
  name: string;
  age: number;
  superheroName: string;
}

export default function EditChildPage() {
  const params = useParams();
  const router = useRouter();
  const childId = params.id as string;

  const [child, setChild] = useState<Child | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (childId) {
      fetchChild();
    }
  }, [childId]);

  const fetchChild = async () => {
    try {
      const data = await childrenApi.getById(childId);
      setChild(data);
      setFormData({
        name: data.name,
        age: data.age.toString(),
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);

    try {
      await childrenApi.update(childId, {
        name: formData.name,
        age: age,
      });

      // Redirect back to child detail
      router.push(`/dashboard/children/${childId}`);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil. Por favor intenta de nuevo.');
    } finally {
      setSaving(false);
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

  if (!child) {
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href={`/dashboard/children/${childId}`}>
        <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Perfil
        </Button>
      </Link>

      {/* Form Card */}
      <Card className="p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Editar Perfil
          </h1>
          <p className="text-gray-600">
            Actualiza la información de <strong>{child.superheroName}</strong>
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
                disabled={saving}
              />
            </div>
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
                disabled={saving}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Edad actual (entre 3 y 17 años)
            </p>
          </div>

          {/* Warning if age changed */}
          {formData.age && parseInt(formData.age) !== child.age && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 mb-2">
                ⚠️ Cambio de Edad Detectado
              </h4>
              <p className="text-sm text-yellow-800">
                Al cambiar la edad, la configuración de seguridad se ajustará automáticamente según la nueva edad. Puedes personalizarla después en la sección de Configuración de Seguridad.
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">
              Información Importante
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• El nombre de superhéroe no se puede cambiar aquí</li>
              <li>• Los cambios de edad ajustarán automáticamente la seguridad</li>
              <li>• El progreso y puntos Luz no se verán afectados</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Link href={`/dashboard/children/${childId}`} className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={saving}
              >
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
            >
              {saving ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Guardando...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
