# Club de los Superhéroes del Corazón 🔥

> **"Donde los niños descubren que su mayor superpoder está dentro de su propio corazón"**

## 🎯 Estado del Proyecto

**Frontend:** ⚡ 85% Complete - Production Ready Core Features
**Backend:** ✅ 100% Complete - All API endpoints functional
**Deployment:** ✅ LIVE on Vercel
**Dev Mode:** ✅ ENABLED - Full mock authentication and data

### 🔗 Enlaces Importantes

- **Producción:** https://los-superheroes-del-corazon-ewionmwpl-hermetic-ormus-projects.vercel.app
- **Repositorio:** https://github.com/HermeticOrmus/los-superheroes-del-corazon
- **Dev Mode Guide:** [DEV_MODE.md](./DEV_MODE.md)
- **Frontend Status:** [FRONTEND_BUILD_STATUS.md](./FRONTEND_BUILD_STATUS.md)
- **Backend Status:** [server/BUILD_STATUS.md](./server/BUILD_STATUS.md)

### ✅ Completado (85%)

1. **Autenticación Completa**
   - ✅ Registro de padres
   - ✅ Login de padres (email/password)
   - ✅ Login de niños (código secreto)
   - ✅ JWT token management
   - ✅ Protección de rutas
   - ✅ Dev mode con mock data

2. **Dashboard de Padres**
   - ✅ Vista general con estadísticas
   - ✅ Gestión de hijos (crear, editar, eliminar)
   - ✅ Perfiles individuales de niños
   - ✅ Configuración de seguridad por edad
   - ✅ Centro de notificaciones
   - ✅ Sistema de códigos secretos

3. **Ceremonia de Iniciación**
   - ✅ Wizard de 4 pasos
   - ✅ Selección de arcángel protector
   - ✅ Generación de nombre de superhéroe
   - ✅ Pantalla de finalización con recompensas
   - ✅ Integración completa con API

4. **Backend (Node.js + Express)**
   - ✅ 40+ endpoints REST
   - ✅ Autenticación JWT
   - ✅ Prisma ORM + Neon PostgreSQL
   - ✅ Cloudinary para media
   - ✅ SendGrid para emails
   - ✅ Sistema de suscripciones
   - ✅ **URL**: http://localhost:4000

5. **Base de Datos (Neon + Prisma)**
   - ✅ PostgreSQL serverless
   - ✅ Schema completo desplegado
   - ✅ 15 tablas con todas las relaciones
   - ✅ Prisma Client generado
   - ✅ Seeds para arcángeles y recompensas

### 🚧 En Progreso (15%)

1. **Misiones y Retos**
   - ⏳ Página de misión del mes
   - ⏳ Interfaz de envío de pruebas
   - ⏳ Revisión de submissions por padres

2. **Catálogo de Recompensas**
   - ⏳ Vista de todas las recompensas
   - ⏳ Sistema de canje con Puntos Luz
   - ⏳ Gestión de direcciones de envío

3. **Dashboard de Niños**
   - ⏳ Interfaz kid-friendly
   - ⏳ Vista de misión actual
   - ⏳ Colección de insignias
   - ⏳ Perfil de superhéroe

### 📊 Schema de Base de Datos

#### Usuarios & Autenticación
- `users` - Padres/Admin
- `profiles` - Perfiles de usuario
- `children` - Niños con códigos secretos

#### Misiones & Retos
- `monthly_missions` - Misiones mensuales con videos
- `weekly_challenges` - 4 retos semanales por misión
- `child_mission_progress` - Progreso por misión
- `child_challenge_completions` - Pruebas subidas (fotos/videos/audio)

#### Gamificación
- `archangels` - Guardianes arcángeles
- `rewards` - Recompensas (badges, físicas, digitales)
- `child_rewards` - Recompensas ganadas/canjeadas

#### Comunidad
- `live_events` - Eventos en vivo (meditaciones, cuentos, etc.)
- `event_participants` - Participación en eventos
- `community_posts` - Posts moderados de niños

#### Pagos
- `subscriptions` - Suscripciones (FREE/PREMIUM)
- `payment_history` - Historial de pagos Stripe

---

## 🚀 Arquitectura

```
┌─────────────────────────────────────────────┐
│         FRONTEND (Next.js 14)               │
│         localhost:3000                      │
│  ├─ Landing Page (español)                  │
│  ├─ Dashboard (coming soon)                 │
│  └─ Ceremonia de iniciación (coming soon)   │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTP/REST
                   │
┌──────────────────▼──────────────────────────┐
│         BACKEND (Node.js/Express)           │
│         localhost:4000                      │
│  ├─ JWT Authentication                      │
│  ├─ API Routes                              │
│  └─ File Upload (Cloudinary)                │
└──────────────────┬──────────────────────────┘
                   │
                   │ Prisma ORM
                   │
┌──────────────────▼──────────────────────────┐
│         DATABASE (Neon Postgres)            │
│  ├─ 15 tablas desplegadas                   │
│  ├─ Relaciones configuradas                 │
│  └─ Serverless                              │
└─────────────────────────────────────────────┘
```

---

## 📁 Estructura del Proyecto

```
los-superheroes-del-corazon/
├── src/                          # Frontend Next.js
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing page
│   ├── components/ui/
│   └── lib/
│       └── utils.ts
│
├── server/                       # Backend Node.js
│   ├── src/
│   │   └── index.ts              # Express server
│   ├── prisma/
│   │   └── schema.prisma         # Database schema
│   ├── .env
│   └── package.json
│
├── FOUNDER_VISION.md
├── VISION_ARCHITECTURE_ALIGNMENT.md
├── TECHNICAL_ARCHITECTURE.md
└── README.md (este archivo)
```

---

## 🏃‍♂️ Cómo Ejecutar

### Opción 1: Dev Mode (Sin Backend) - Recomendado para Testing

**Mejor para:** Probar la UI/UX sin configurar backend

```bash
# 1. Instalar dependencias
npm install

# 2. Dev mode ya está habilitado en .env.local
# NEXT_PUBLIC_DEV_MODE=true

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir navegador
open http://localhost:3000

# 5. Login con credenciales de prueba
# Padre: cualquier email/contraseña
# Niño: SOFIA123, DIEGO456, o BELLA789
```

📖 **Guía completa de Dev Mode:** [DEV_MODE.md](./DEV_MODE.md)

### Opción 2: Full Stack (Backend + Frontend)

**Mejor para:** Probar integración completa

```bash
# Terminal 1 - Backend
cd server
npm install
npm run db:push        # Desplegar schema
npm run seed           # Poblar arcángeles y recompensas
npm run dev            # http://localhost:4000

# Terminal 2 - Frontend
npm install
# Establecer NEXT_PUBLIC_DEV_MODE=false en .env.local
npm run dev            # http://localhost:3000
```

### Base de Datos (Prisma Studio)
```bash
cd server
npx prisma studio
# Abre Prisma Studio en http://localhost:5555
# Ver y editar datos directamente
```

---

## 🔑 Variables de Entorno

### Frontend (`.env.local`)
```env
# Supabase (para features futuros)
NEXT_PUBLIC_SUPABASE_URL=https://pubzoswjrbvmkbuxhfzg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here

# Dev Mode Toggle
NEXT_PUBLIC_DEV_MODE=true

# API URL (cuando se usa backend real)
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Backend (`server/.env`)
```env
# Database
DATABASE_URL="postgresql://..."     # Neon Postgres

# Authentication
JWT_SECRET="..."                    # Para JWT tokens

# Payments
STRIPE_SECRET_KEY="..."             # Stripe pagos
STRIPE_WEBHOOK_SECRET="..."         # Stripe webhooks

# File Upload
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Email
SENDGRID_API_KEY="..."              # SendGrid
FROM_EMAIL="noreply@superheroes.com"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
PORT=4000
```

---

## 🎨 Características Principales

### Ya Implementadas ✅

1. **Autenticación Completa**
   - ✅ Registro de padres con validación
   - ✅ Login de padres (email/password)
   - ✅ Login de niños con códigos secretos
   - ✅ Gestión de tokens JWT
   - ✅ Protección de rutas por rol
   - ✅ Mock authentication para dev mode

2. **Ceremonia de Iniciación**
   - ✅ Bienvenida épica de 4 pasos
   - ✅ Selección de arcángel protector (7 opciones)
   - ✅ Generación de nombre de superhéroe
   - ✅ Otorgamiento de código secreto
   - ✅ Recompensas iniciales (100 Puntos Luz + Badge Iniciado)

3. **Dashboard de Padres**
   - ✅ Vista general con estadísticas
   - ✅ Gestión completa de hijos (CRUD)
   - ✅ Perfiles detallados de cada niño
   - ✅ Controles de seguridad por edad
   - ✅ Centro de notificaciones con filtros
   - ✅ Sistema de códigos secretos únicos

4. **Gamificación Base**
   - ✅ Sistema de Puntos Luz
   - ✅ Rangos (Iniciado, Valiente, Sabio, Maestro)
   - ✅ Sistema de badges
   - ✅ Progresión visible

5. **API Completa**
   - ✅ 40+ endpoints REST
   - ✅ Autenticación y autorización
   - ✅ Gestión de usuarios y niños
   - ✅ Sistema de notificaciones
   - ✅ Onboarding y ceremonias
   - ✅ Gestión de seguridad

### Próximas a Implementar 🚧

1. **Misiones Mensuales**
   - ⏳ Página de misión actual con video
   - ⏳ Archivo de misiones pasadas
   - ⏳ Sistema de inicio de misión

2. **Retos Semanales**
   - ⏳ Vista de reto actual
   - ⏳ Interfaz de subida de pruebas (foto/video/audio)
   - ⏳ Sistema de revisión por padres
   - ⏳ Otorgamiento de puntos

3. **Tienda de Recompensas**
   - ⏳ Catálogo completo (badges, físicas, digitales)
   - ⏳ Sistema de canje con Puntos Luz
   - ⏳ Gestión de direcciones de envío
   - ⏳ Historial de canjes

4. **Dashboard de Niños**
   - ⏳ Interfaz kid-friendly
   - ⏳ Vista de misión actual
   - ⏳ Perfil de superhéroe
   - ⏳ Colección de badges
   - ⏳ Progreso y estadísticas

5. **Comunidad (Futuro)**
   - ⏳ Mapa mundial interactivo
   - ⏳ Foro moderado
   - ⏳ Eventos en vivo
   - ⏳ Galerías de superhéroes

---

## 📊 Modelo de Negocio

### Plan FREE
- Acceso limitado
- 1 misión de prueba
- Comunidad básica

### Plan PREMIUM ($9.99/mes)
- Todas las misiones mensuales
- 4 retos semanales
- Eventos en vivo
- Recompensas físicas
- Mapa mundial

---

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: Neon (Serverless Postgres) + Prisma ORM
- **Auth**: JWT
- **Payments**: Stripe
- **File Upload**: Cloudinary
- **Hosting**: Vercel (Frontend) + Railway/Render (Backend)

---

## 🧪 Testing (Dev Mode)

### Credenciales de Prueba

**Cuenta de Padre:**
- Email: amoryvida@gmail.com (o cualquier email)
- Password: cualquier contraseña

**Códigos Secretos de Niños:**
- `AMAR333` - Amor (8 años, Valiente, ceremonia completada)
- `DIEGO456` - Diego (11 años, Sabio, ceremonia completada)
- `BELLA789` - Isabella (5 años, Iniciado, ceremonia pendiente)

### Flujos de Testing

1. **Parent Dashboard**
   - Login → Ver hijos → Gestionar configuración de seguridad

2. **Child Login**
   - Usar código secreto → (Dashboard de niño próximamente)

3. **Onboarding**
   - Navegar a `/onboarding/BELLA789` → Completar ceremonia de 4 pasos

4. **Notificaciones**
   - Ver → Filtrar → Marcar como leída

📖 **Guía completa:** [DEV_MODE.md](./DEV_MODE.md)

---

## 📊 Documentación

| Documento | Descripción |
|-----------|-------------|
| [FRONTEND_BUILD_STATUS.md](./FRONTEND_BUILD_STATUS.md) | Checklist completo de features del frontend (85%) |
| [DEV_MODE.md](./DEV_MODE.md) | Guía de testing con mock data |
| [server/BUILD_STATUS.md](./server/BUILD_STATUS.md) | Documentación de API del backend (100%) |
| [FOUNDER_VISION.md](./FOUNDER_VISION.md) | Visión completa de la fundadora |
| [VISION_ARCHITECTURE_ALIGNMENT.md](./VISION_ARCHITECTURE_ALIGNMENT.md) | Alineación arquitectura-visión |

---

## 📝 Próximas Prioridades

1. ✅ ~~Dev mode con mock authentication~~ - **COMPLETADO**
2. ⏳ Página de misión actual con video reveal
3. ⏳ Interfaz de envío de pruebas (retos)
4. ⏳ Catálogo de recompensas
5. ⏳ Dashboard de niños
6. ⏳ Testing end-to-end
7. ⏳ Optimización SEO
8. ⏳ Analytics (PostHog/Mixpanel)

---

## 🤝 Equipo

- **Fundadora**: Visión y concepto espiritual
- **Developer**: Arquitectura e implementación técnica

---

**Estado**: ⚡ 85% Complete - Core features production-ready

**Última actualización**: 6 de diciembre, 2025

---

**Construido con ❤️ para empoderar el crecimiento espiritual de los niños**

Generated with [Claude Code](https://claude.ai/code)
via [Happy](https://happy.engineering)
