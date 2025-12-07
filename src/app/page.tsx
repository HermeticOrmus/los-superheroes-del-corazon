import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Heart,
  Globe,
  Star,
  Zap,
  Shield,
  Trophy,
  Users
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Bright gradient with animation */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-gold-50 to-red-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary-200 opacity-20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gold-200 opacity-20 blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-red-200 opacity-20 blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="gap-1.5 px-4 py-2 text-base font-semibold bg-gold-500 text-white hover:bg-gold-600">
                <Sparkles className="h-4 w-4" />
                Club Internacional de Niños
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight">
              <span className="block text-primary-600 drop-shadow-sm">
                Club de los
              </span>
              <span className="block mt-2 bg-gradient-to-r from-primary-600 via-gold-500 to-red-500 bg-clip-text text-transparent">
                Superhéroes del Corazón
              </span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto max-w-3xl text-xl sm:text-2xl lg:text-3xl font-medium text-gray-700 leading-relaxed">
              Donde los niños descubren que su{" "}
              <span className="relative inline-block">
                <span className="relative z-10 font-bold text-primary-600">
                  mayor superpoder
                </span>
                <span className="absolute bottom-1 left-0 h-3 w-full bg-gold-200 -z-0" />
              </span>{" "}
              está dentro de su propio corazón
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="group relative h-14 px-8 text-lg font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
                >
                  <Heart className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Únete al Club
                  <Zap className="ml-2 h-5 w-5 group-hover:animate-bounce" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg font-semibold border-2 border-primary-500 text-primary-700 hover:bg-primary-50 hover:text-primary-900 hover:border-primary-600 hover:scale-105 transition-all duration-200"
                >
                  Iniciar Sesión
                  <Star className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-600" />
                <span className="font-semibold">+500 Superhéroes</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-red-500" />
                <span className="font-semibold">12 Países</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary-200 text-primary-700">
              Cómo Funciona
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">
              Tu aventura empieza aquí
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card className="group p-8 border-2 hover:border-primary-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-primary-50">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500 shadow-lg group-hover:scale-110 transition-transform">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Misiones Mensuales
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Cada mes, la <span className="font-semibold text-primary-600">Comandante Corazón</span> revela una nueva misión épica con video exclusivo y retos emocionantes.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="group p-8 border-2 hover:border-gold-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-gold-50">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500 shadow-lg group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Retos Familiares
              </h3>
              <p className="text-gray-600 leading-relaxed">
                4 retos semanales diseñados para hacer en familia. Sube fotos, videos o audios de tus <span className="font-semibold text-gold-600">hazañas completadas</span>.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="group p-8 border-2 hover:border-red-300 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-red-50">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500 shadow-lg group-hover:scale-110 transition-transform">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Puntos Luz y Premios
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Gana <span className="font-semibold text-gold-600">puntos Luz</span> por cada reto. Canjéalos por cartas especiales, pulseras, diplomas y más sorpresas.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24 bg-gradient-to-r from-primary-600 via-gold-500 to-red-500">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            ¿Listo para descubrir tu superpoder?
          </h2>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 font-medium">
            Únete a niños de todo el mundo que están iluminando el planeta desde el corazón
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-bold bg-white text-primary-600 hover:bg-gray-100 hover:text-primary-700 shadow-2xl hover:scale-105 transition-all"
              >
                Comenzar Ahora
                <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg font-semibold border-2 border-white text-white hover:bg-white/10 hover:text-white hover:border-white"
              >
                Área de Padres
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-gray-900 text-gray-400">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-8">
            {/* La Gran Obra Attribution */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-gray-500 font-handwritten">Un proyecto de</p>
              <a
                href="https://www.youtube.com/@lagranobraviva"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src="/la-gran-obra-logo.png"
                  alt="La Gran Obra - La magia de tener un corazón"
                  width={200}
                  height={80}
                  className="h-20 w-auto"
                />
              </a>
              <p className="text-xs text-gray-600">
                <a
                  href="https://instagram.com/lagranobra_edcova"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-500 transition-colors"
                >
                  @lagranobra_edcova
                </a>
              </p>
            </div>

            {/* Copyright */}
            <div className="text-center border-t border-gray-800 pt-6 w-full">
              <p className="text-sm">
                © 2025 Club de los Superhéroes del Corazón.
                <span className="block mt-2 text-xs">
                  Construyendo una nueva generación de líderes conscientes.
                </span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
