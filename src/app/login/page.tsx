'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Mail, Lock, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type LoginMode = 'parent' | 'child';

export default function LoginPage() {
  const { login, loginChild } = useAuth();
  const [mode, setMode] = useState<LoginMode>('parent');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    secretCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'parent') {
      // Parent login validation
      if (!formData.email || !formData.password) {
        setError('Por favor ingresa tu email y contraseña');
        return;
      }
    } else {
      // Child login validation
      if (!formData.secretCode) {
        setError('Por favor ingresa tu código secreto');
        return;
      }
      if (formData.secretCode.length !== 6) {
        setError('El código secreto debe tener 6 caracteres');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'parent') {
        await login(formData.email, formData.password);
      } else {
        await loginChild(formData.secretCode.toUpperCase());
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-2xl shadow-lg">
              <Heart className="w-12 h-12 text-primary-600 fill-primary-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-gold-600 bg-clip-text text-transparent mb-2">
            Club de Superhéroes del Corazón
          </h1>
          <p className="text-gray-600">
            Bienvenido de vuelta
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex space-x-2 mb-6 bg-white rounded-lg p-1 shadow-md">
          <button
            type="button"
            onClick={() => {
              setMode('parent');
              setError('');
              setFormData({ email: '', password: '', secretCode: '' });
            }}
            className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
              mode === 'parent'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Soy Padre/Madre
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('child');
              setError('');
              setFormData({ email: '', password: '', secretCode: '' });
            }}
            className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
              mode === 'child'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Soy Superhéroe
          </button>
        </div>

        {/* Login Card */}
        <Card className="p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {mode === 'parent' ? (
              <>
                {/* Parent Login Fields */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="tu@email.com"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Tu contraseña"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Child Login Field */}
                <div>
                  <label htmlFor="secretCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Código Secreto
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <KeyRound className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="secretCode"
                      type="text"
                      required
                      maxLength={6}
                      value={formData.secretCode}
                      onChange={(e) => setFormData({ ...formData, secretCode: e.target.value.toUpperCase() })}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-center text-2xl tracking-widest font-bold uppercase"
                      placeholder="ABC123"
                      disabled={loading}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Pregúntale a tu mamá o papá por tu código secreto
                  </p>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>
        </Card>

        {/* Register Link (only for parents) */}
        {mode === 'parent' && (
          <p className="text-center mt-6 text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              Regístrate aquí
            </Link>
          </p>
        )}

        {/* Help Text for Children */}
        {mode === 'child' && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-center">
              💡 <strong>Tip:</strong> Si no tienes tu código secreto, pídele ayuda a tus padres
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
