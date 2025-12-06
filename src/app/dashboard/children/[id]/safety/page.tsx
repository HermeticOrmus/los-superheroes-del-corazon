'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Shield,
  AlertCircle,
  Loader2,
  Save,
  RotateCcw,
  Info
} from 'lucide-react';
import { safetyApi, childrenApi } from '@/lib/api';

interface SafetySettings {
  canAccessCommunity: boolean;
  canPostInCommunity: boolean;
  canCommentOnPosts: boolean;
  canViewOtherProfiles: boolean;
  canParticipateInEvents: boolean;
  requiresApproval: boolean;
  contentFilterLevel: 'STRICT' | 'MODERATE' | 'BASIC';
}

interface Child {
  name: string;
  superheroName: string;
  age: number;
}

export default function SafetySettingsPage() {
  const params = useParams();
  const childId = params.id as string;

  const [child, setChild] = useState<Child | null>(null);
  const [settings, setSettings] = useState<SafetySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (childId) {
      fetchData();
    }
  }, [childId]);

  const fetchData = async () => {
    try {
      const [childData, safetyData] = await Promise.all([
        childrenApi.getById(childId),
        safetyApi.getSettings(childId)
      ]);
      setChild(childData);
      setSettings(safetyData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await safetyApi.updateSettings(childId, settings);
      setSuccess('Configuración guardada exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setError('');
    setSuccess('');
    setResetting(true);

    try {
      const resetData = await safetyApi.resetToDefaults(childId);
      setSettings(resetData);
      setSuccess('Configuración restablecida a valores predeterminados');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al restablecer la configuración');
    } finally {
      setResetting(false);
    }
  };

  const updateSetting = (key: keyof SafetySettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  if (!child || !settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error || 'No se encontró la configuración'}</p>
          <Link href={`/dashboard/children/${childId}`}>
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const getAgeRecommendation = (age: number) => {
    if (age <= 6) return '🔒 Modo Súper Seguro (3-6 años)';
    if (age <= 9) return '🛡️ Modo Seguro (7-9 años)';
    if (age <= 12) return '⚡ Modo Independiente (10-12 años)';
    return '🌟 Modo Completo (13+ años)';
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href={`/dashboard/children/${childId}`}>
        <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Perfil
        </Button>
      </Link>

      {/* Header */}
      <Card className="p-6 bg-gradient-to-br from-primary-50 to-blue-50">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary-600 rounded-full">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Configuración de Seguridad
              </h1>
              <p className="text-gray-700">
                <strong>{child.superheroName}</strong> ({child.name}) · {child.age} años
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {getAgeRecommendation(child.age)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
          <Info className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {/* Community Access */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Acceso a Comunidad
        </h3>
        <div className="space-y-4">
          <ToggleSetting
            label="Puede acceder a la comunidad"
            description="Permite ver publicaciones de otros superhéroes"
            checked={settings.canAccessCommunity}
            onChange={(checked) => updateSetting('canAccessCommunity', checked)}
          />
          <ToggleSetting
            label="Puede publicar en la comunidad"
            description="Permite crear publicaciones propias"
            checked={settings.canPostInCommunity}
            onChange={(checked) => updateSetting('canPostInCommunity', checked)}
            disabled={!settings.canAccessCommunity}
          />
          <ToggleSetting
            label="Puede comentar publicaciones"
            description="Permite comentar en publicaciones de otros"
            checked={settings.canCommentOnPosts}
            onChange={(checked) => updateSetting('canCommentOnPosts', checked)}
            disabled={!settings.canAccessCommunity}
          />
          <ToggleSetting
            label="Puede ver otros perfiles"
            description="Permite ver perfiles de otros superhéroes"
            checked={settings.canViewOtherProfiles}
            onChange={(checked) => updateSetting('canViewOtherProfiles', checked)}
            disabled={!settings.canAccessCommunity}
          />
        </div>
      </Card>

      {/* Events & Moderation */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Eventos y Moderación
        </h3>
        <div className="space-y-4">
          <ToggleSetting
            label="Puede participar en eventos en vivo"
            description="Permite unirse a eventos y actividades especiales"
            checked={settings.canParticipateInEvents}
            onChange={(checked) => updateSetting('canParticipateInEvents', checked)}
          />
          <ToggleSetting
            label="Requiere aprobación parental"
            description="Todas las publicaciones necesitan tu aprobación antes de ser públicas"
            checked={settings.requiresApproval}
            onChange={(checked) => updateSetting('requiresApproval', checked)}
          />
        </div>
      </Card>

      {/* Content Filter */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Filtro de Contenido
        </h3>
        <div className="space-y-3">
          <RadioOption
            label="Estricto"
            description="Máxima protección - Solo contenido verificado y apropiado para la edad"
            value="STRICT"
            checked={settings.contentFilterLevel === 'STRICT'}
            onChange={() => updateSetting('contentFilterLevel', 'STRICT')}
          />
          <RadioOption
            label="Moderado"
            description="Protección balanceada - Contenido revisado con cierta flexibilidad"
            value="MODERATE"
            checked={settings.contentFilterLevel === 'MODERATE'}
            onChange={() => updateSetting('contentFilterLevel', 'MODERATE')}
          />
          <RadioOption
            label="Básico"
            description="Protección mínima - Solo filtra contenido inapropiado obvio"
            value="BASIC"
            checked={settings.contentFilterLevel === 'BASIC'}
            onChange={() => updateSetting('contentFilterLevel', 'BASIC')}
          />
        </div>
      </Card>

      {/* Important Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Información Importante
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Solo puedes hacer la configuración <strong>MÁS restrictiva</strong> que la predeterminada para la edad</li>
          <li>• Los cambios se aplican inmediatamente</li>
          <li>• Puedes restablecer a valores predeterminados en cualquier momento</li>
          <li>• Todas las publicaciones pasan por moderación automática antes de ser públicas</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={saving || resetting}
          className="flex-1"
        >
          {resetting ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Restableciendo...
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restablecer Predeterminados
            </>
          )}
        </Button>
        <Button
          onClick={handleSave}
          disabled={saving || resetting}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
        >
          {saving ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Toggle Setting Component
function ToggleSetting({
  label,
  description,
  checked,
  onChange,
  disabled = false
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-200">
      <div className="flex-1">
        <p className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
          {label}
        </p>
        <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          disabled
            ? 'bg-gray-300 cursor-not-allowed'
            : checked
            ? 'bg-primary-600'
            : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

// Radio Option Component
function RadioOption({
  label,
  description,
  value,
  checked,
  onChange
}: {
  label: string;
  description: string;
  value: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
        checked
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="radio"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
          />
        </div>
        <div className="ml-3">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </button>
  );
}
