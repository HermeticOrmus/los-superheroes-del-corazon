# Club de los Superhéroes del Corazón 🔥

> **"Donde los niños descubren que su mayor superpoder está dentro de su propio corazón"**

## 🎯 Estado del Proyecto

### ✅ Completado

1. **Visión Alineada**
   - `FOUNDER_VISION.md` - Visión completa de la fundadora
   - `VISION_ARCHITECTURE_ALIGNMENT.md` - Arquitectura alineada con la visión

2. **Frontend (Next.js 14)**
   - TypeScript + Tailwind CSS
   - Landing page en español
   - Sistema de diseño con colores del club
   - **URL**: http://localhost:3000

3. **Backend (Node.js + Express)**
   - TypeScript
   - API REST
   - **URL**: http://localhost:4000
   - Health check: http://localhost:4000/health

4. **Base de Datos (Neon + Prisma)**
   - PostgreSQL serverless
   - Schema completo desplegado
   - 15 tablas con todas las relaciones
   - Prisma Client generado

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

### Frontend (Next.js)
```bash
npm run dev
# Abre http://localhost:3000
```

### Backend (API)
```bash
cd server
npm run build && node dist/index.js
# API en http://localhost:4000
```

### Base de Datos
```bash
cd server
npx prisma studio
# Abre Prisma Studio para ver/editar datos
```

---

## 🔑 Variables de Entorno

### Frontend (`.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (`server/.env`)
```env
DATABASE_URL="postgresql://..."     # Neon Postgres
JWT_SECRET="..."                    # Para autenticación
STRIPE_SECRET_KEY="..."             # Pagos
CLOUDINARY_API_KEY="..."            # Subida de archivos
```

---

## 🎨 Características Principales

### Ya Implementadas ✅
- Landing page responsive
- API servidor funcionando
- Base de datos completa con schema

### Próximas a Implementar 🚧
1. **Autenticación**
   - Registro de padres
   - Login con JWT
   - Códigos secretos para niños

2. **Ceremonia de Iniciación**
   - Bienvenida épica
   - Asignación de Arcángel
   - Generación de nombre de superhéroe
   - Código secreto

3. **Misiones & Retos**
   - Vista de misión del mes
   - Retos semanales
   - Subida de pruebas

4. **Gamificación**
   - Sistema de puntos Luz
   - Badges y medallas
   - Tienda de recompensas

5. **Comunidad**
   - Mapa mundial interactivo
   - Foro moderado
   - Eventos en vivo

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

## 📝 Siguientes Pasos

1. Implementar autenticación con códigos secretos
2. Crear ceremonia de iniciación
3. Sistema de misiones y retos
4. Gamificación (puntos Luz)
5. Mapa mundial
6. Integración con Stripe

---

## 🤝 Equipo

- **Fundadora**: Visión y concepto
- **Developer**: Arquitectura e implementación

---

**Estado**: 🚧 En desarrollo activo - MVP Foundation Complete

**Última actualización**: 5 de diciembre, 2025
