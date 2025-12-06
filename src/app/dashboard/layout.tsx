'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Bell, Settings, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Panel General', href: '/dashboard', icon: Home },
    { name: 'Mis Hijos', href: '/dashboard/children', icon: Users },
    { name: 'Notificaciones', href: '/dashboard/notifications', icon: Bell },
    { name: 'Configuración', href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-100 via-cream-50 to-primary-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Heart className="w-8 h-8 text-primary-600 fill-primary-600" />
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-primary-600 to-gold-600 bg-clip-text text-transparent">
                Club de Superhéroes
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-gray-700">
                  Hola, {user.name.split(' ')[0]}
                </span>
              )}
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 rounded-lg font-medium transition-all
                    ${active
                      ? 'bg-primary-100 text-primary-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 ${active ? 'text-primary-600' : 'text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-4 py-6 border-t border-gray-200">
            <div className="bg-gradient-to-br from-primary-50 to-gold-50 rounded-lg p-4">
              <h3 className="font-semibold text-primary-900 mb-1">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-sm text-primary-700 mb-3">
                Consulta nuestra guía de padres
              </p>
              <button className="w-full bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Ver Guía
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
