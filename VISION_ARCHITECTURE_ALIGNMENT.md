# Alineación: Visión de Fundadora → Arquitectura Técnica

## 🔍 Análisis de Diferencias

### Arquitectura Anterior (OBSOLETA)
- ❌ 7 niveles secuenciales basados en principios herméticos
- ❌ Enfoque en "completar niveles"
- ❌ Estructura de actividades (videos, quizzes, ejercicios)
- ❌ Avatares de superhéroes como selección estática

### Visión Real de la Fundadora
- ✅ Club de membresía con **misiones mensuales**
- ✅ **Códigos secretos** para acceso
- ✅ **Arcángel guardián** asignado a cada niño
- ✅ **Ceremonia de iniciación** con nombre de superhéroe
- ✅ 4 **retos semanales** por mes
- ✅ Sistema de **niveles por colores** (Blanco → Rojo → Azul → Dorado)
- ✅ Subida de **pruebas** (fotos, videos, audios)
- ✅ **Puntos "Luz"** y sistema de recompensas
- ✅ **Mapa mundial** interactivo
- ✅ Comunidad con eventos ceremoniales

---

## 🎯 Nueva Arquitectura Alineada

### 1. Modelo de Datos Actualizado

#### Usuarios y Perfiles
```sql
-- Sin cambios mayores, pero agregar:
children
├── id (uuid, PK)
├── parent_id (uuid, FK)
├── name (text)
├── age (int)
├── secret_code (text, unique) -- NUEVO: Código secreto del niño
├── superhero_name (text) -- NUEVO: "Corazón Valiente", etc.
├── archangel_id (int, FK) -- NUEVO: Arcángel guardián asignado
├── luz_points (int, default 0) -- NUEVO: Puntos Luz acumulados
├── rank (enum: 'iniciado', 'valiente', 'sabio', 'maestro') -- NUEVO
├── initiation_completed (boolean, default false) -- NUEVO
├── created_at (timestamp)
└── updated_at (timestamp)
```

#### Arcángeles (NUEVO)
```sql
archangels
├── id (int, PK)
├── name_es (text) -- "Arcángel Miguel"
├── name_en (text) -- "Archangel Michael"
├── power (text) -- "Valentía y Protección"
├── color_hex (text)
├── description_es (text)
├── description_en (text)
├── illustration_url (text)
└── order (int)
```

#### Misiones Mensuales (NUEVO)
```sql
monthly_missions
├── id (uuid, PK)
├── year (int)
├── month (int) -- 1-12
├── title_es (text) -- "Operación Abrazo Invisible"
├── title_en (text)
├── description_es (text)
├── description_en (text)
├── video_reveal_url (text) -- Video de la Comandante Corazón
├── archangel_id (int, FK, nullable) -- Arcángel relacionado
├── start_date (date)
├── end_date (date)
└── created_at (timestamp)
```

#### Retos Semanales (NUEVO)
```sql
weekly_challenges
├── id (uuid, PK)
├── mission_id (uuid, FK -> monthly_missions.id)
├── week_number (int) -- 1-4
├── title_es (text)
├── title_en (text)
├── description_es (text)
├── description_en (text)
├── difficulty_level (enum: 'blanco', 'rojo', 'azul', 'dorado')
├── luz_points_reward (int) -- Puntos por completar
├── required_proof_types (text[]) -- ['photo', 'video', 'audio']
└── order (int)
```

#### Progreso de Misiones (NUEVO)
```sql
child_mission_progress
├── id (uuid, PK)
├── child_id (uuid, FK)
├── mission_id (uuid, FK)
├── started_at (timestamp)
├── completed_at (timestamp, nullable)
└── completion_percentage (int) -- 0-100
```

#### Progreso de Retos (NUEVO)
```sql
child_challenge_completions
├── id (uuid, PK)
├── child_id (uuid, FK)
├── challenge_id (uuid, FK -> weekly_challenges.id)
├── proof_urls (text[]) -- URLs de archivos subidos
├── proof_type (enum: 'photo', 'video', 'audio')
├── submitted_at (timestamp)
├── reviewed_at (timestamp, nullable)
├── status (enum: 'pending', 'approved', 'rejected')
├── moderator_notes (text, nullable)
└── luz_points_awarded (int)
```

#### Sistema de Recompensas (ACTUALIZADO)
```sql
rewards
├── id (uuid, PK)
├── type (enum: 'badge', 'physical', 'digital', 'experience')
├── code (text, unique) -- 'monthly_mission_complete', 'graduation_cape', etc.
├── name_es (text)
├── name_en (text)
├── description_es (text)
├── description_en (text)
├── luz_points_cost (int) -- Costo en puntos Luz
├── icon_url (text)
├── rarity (enum: 'common', 'rare', 'epic', 'legendary')
├── is_redeemable (boolean) -- Si se puede canjear con puntos
└── stock_count (int, nullable) -- Para premios físicos limitados
```

#### Recompensas Ganadas (ACTUALIZADO)
```sql
child_rewards
├── id (uuid, PK)
├── child_id (uuid, FK)
├── reward_id (uuid, FK)
├── earned_at (timestamp)
├── redeemed_at (timestamp, nullable)
├── redemption_status (enum: 'pending', 'shipped', 'delivered')
├── shipping_info (jsonb, nullable)
└── metadata (jsonb)
```

#### Eventos en Vivo (NUEVO)
```sql
live_events
├── id (uuid, PK)
├── title_es (text)
├── title_en (text)
├── description_es (text)
├── description_en (text)
├── event_type (enum: 'meditation', 'storytelling', 'ceremony', 'special_guest')
├── scheduled_at (timestamp)
├── duration_minutes (int)
├── video_url (text, nullable) -- Para streaming
├── is_recorded (boolean)
├── recording_url (text, nullable)
└── max_participants (int, nullable)
```

#### Participación en Eventos (NUEVO)
```sql
event_participants
├── id (uuid, PK)
├── event_id (uuid, FK)
├── child_id (uuid, FK)
├── registered_at (timestamp)
├── attended (boolean, default false)
└── luz_points_awarded (int, default 0)
```

#### Comunidad (Forum mejorado)
```sql
community_posts
├── id (uuid, PK)
├── author_id (uuid, FK) -- child_id
├── content (text)
├── media_urls (text[])
├── post_type (enum: 'experience', 'question', 'celebration')
├── moderation_status (enum: 'pending', 'approved', 'rejected')
├── moderated_at (timestamp, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)
```

#### Mapa Mundial (NUEVO)
```sql
-- Se genera dinámicamente desde child_challenge_completions
-- Cada vez que un niño completa un reto, se "ilumina" su ubicación

child_locations (opcional para privacidad)
├── id (uuid, PK)
├── child_id (uuid, FK)
├── country_code (text) -- 'ES', 'MX', 'US', etc.
├── approximate_lat (decimal, nullable)
├── approximate_lng (decimal, nullable)
└── created_at (timestamp)
```

---

## 2. Flujos de Usuario Actualizados

### A. Ceremonia de Iniciación (Primera Vez)

```
1. Parent registra cuenta → Email/Password
2. Parent crea perfil de niño → Nombre + Edad
3. Sistema inicia ceremonia:
   ├── Pantalla de bienvenida épica
   ├── "Elige tu símbolo sagrado" → Avatar
   ├── Asignación de Arcángel (automático o por quiz)
   ├── Generación de nombre de superhéroe (sugerencias + custom)
   ├── Generación de código secreto único
   └── Video de bienvenida de la Comandante Corazón
4. Niño recibe:
   ├── Código secreto (para compartir con amigos)
   ├── Primer misión del mes actual
   └── 100 puntos Luz de bienvenida
```

### B. Flujo Mensual de Misión

```
Día 1 del mes:
├── Nueva misión se "revela"
├── Email/notificación a todos los miembros
├── Video épico de la Comandante en plataforma
└── 4 retos semanales disponibles

Semana 1-4:
├── Niño ve reto de la semana
├── Realiza actividad en familia
├── Sube prueba (foto/video/audio)
├── Sistema envía a moderación
├── Moderador aprueba → Puntos Luz + Badge
└── Mapa mundial se ilumina en ubicación del niño

Fin de mes:
├── Si completó 4/4 retos → Medalla de completitud
├── Ranking de país/global
└── Certificado mensual descargable
```

### C. Sistema de Recompensas

```
Puntos Luz:
├── Completar reto semanal: 50-200 puntos (según dificultad)
├── Participar en evento en vivo: 100 puntos
├── Primer reto del mes: +50 bonus
└── Completar misión completa: +500 bonus

Canje de puntos:
├── 500 puntos → Carta manuscrita de la Comandante
├── 1000 puntos → Pulsera con piedra energética
├── 2000 puntos → Diploma firmado
├── 5000 puntos → Videollamada especial
└── 12 meses completos → Capa física bordada (graduación)
```

---

## 3. Páginas y Rutas Actualizadas

```
/app
├── (auth)
│   ├── /login
│   ├── /registro
│   └── /codigo-secreto (ingreso con código)
│
├── (marketing)
│   ├── / (landing)
│   ├── /club (qué es el club)
│   ├── /arcangeles (conoce a los arcángeles)
│   ├── /mision-actual (preview de misión del mes)
│   ├── /blog
│   └── /precios
│
├── (platform) - Requiere auth
│   ├── /dashboard
│   │   ├── Misión del mes actual
│   │   ├── Retos de la semana
│   │   ├── Puntos Luz
│   │   └── Próximos eventos
│   │
│   ├── /ceremonia (solo primera vez)
│   │   ├── /bienvenida
│   │   ├── /elegir-simbolo
│   │   ├── /conocer-arcangel
│   │   ├── /nombre-superheroe
│   │   └── /codigo-secreto
│   │
│   ├── /mision/[misionId]
│   │   ├── Video de revelación
│   │   ├── 4 retos semanales
│   │   └── Progreso
│   │
│   ├── /reto/[retoId]
│   │   ├── Descripción
│   │   ├── Subir prueba
│   │   └── Ver pruebas de la comunidad (moderadas)
│   │
│   ├── /mi-arcangel
│   │   ├── Historia del arcángel
│   │   ├── Misiones relacionadas
│   │   └── Poderes desbloqueados
│   │
│   ├── /recompensas
│   │   ├── Mis puntos Luz
│   │   ├── Medallas y badges
│   │   ├── Tienda de canje
│   │   └── Historial de premios
│   │
│   ├── /mapa-mundial
│   │   ├── Mapa interactivo
│   │   ├── Luces por misiones completadas
│   │   └── Ranking por país
│   │
│   ├── /comunidad
│   │   ├── Foro (moderado)
│   │   ├── Eventos en vivo
│   │   └── Patrullas (grupos)
│   │
│   ├── /eventos
│   │   ├── Próximos eventos
│   │   ├── Registrarse
│   │   └── Grabaciones
│   │
│   └── /mi-perfil
│       ├── Código secreto
│       ├── Cambiar avatar
│       └── Configuración
│
└── (admin) - Solo staff
    ├── /admin/misiones (crear/editar)
    ├── /admin/retos (crear/editar)
    ├── /admin/moderacion (aprobar pruebas)
    ├── /admin/eventos (gestionar)
    └── /admin/recompensas (envíos físicos)
```

---

## 4. Componentes Clave

### Nuevos Componentes Necesarios

```typescript
// Ceremonia
<CeremoniaIniciacion />
  <BienvenidaEpica />
  <AsignacionArcangel />
  <GeneradorNombreSuperheroe />
  <CodigoSecretoReveal />

// Misiones
<MisionDelMes mision={...} />
  <VideoRevelacion url={...} />
  <RetosSemanales retos={...} />
  <ProgresoMision progreso={...} />

// Retos
<RetoCard reto={...} />
  <SubidaDePrueba onUpload={...} />
  <GaleriaDeProofs proofs={...} /> // Moderadas

// Gamificación
<PuntosLuz cantidad={...} animacion={true} />
<MedallasDisplay medallas={...} />
<TiendaDeRecompensas />

// Comunidad
<MapaMundial completions={...} />
<EventoEnVivo evento={...} />
<ForoModerado posts={...} />

// Arcángeles
<ArcangelGuardian archangel={...} />
<PoderDesbloqueado poder={...} />
```

---

## 5. Prioridades de Desarrollo

### Sprint 1: Base (Semana 1-2)
- [ ] Nueva estructura de base de datos
- [ ] Autenticación con códigos secretos
- [ ] Ceremonia de iniciación completa
- [ ] Panel básico de dashboard

### Sprint 2: Misiones (Semana 3-4)
- [ ] CRUD de misiones mensuales (admin)
- [ ] CRUD de retos semanales (admin)
- [ ] Sistema de subida de pruebas
- [ ] Panel de moderación básico

### Sprint 3: Gamificación (Semana 5-6)
- [ ] Sistema de puntos Luz
- [ ] Sistema de medallas/badges
- [ ] Tienda de recompensas
- [ ] Canje de puntos

### Sprint 4: Comunidad (Semana 7-8)
- [ ] Mapa mundial interactivo
- [ ] Foro con moderación
- [ ] Sistema de eventos en vivo
- [ ] Registro y asistencia

### Sprint 5: Polish (Semana 9-10)
- [ ] Animaciones épicas
- [ ] Videos de comandante
- [ ] Emails automatizados
- [ ] Mobile optimization

---

## 6. Migraciones Necesarias

### De arquitectura antigua → nueva

```sql
-- La tabla "superheroes" se convierte en "archangels"
-- La tabla "levels" se elimina → reemplaza con "monthly_missions"
-- La tabla "activities" se elimina → reemplaza con "weekly_challenges"
-- La tabla "child_progress" se reemplaza con "child_mission_progress"
-- La tabla "activity_completions" se reemplaza con "child_challenge_completions"
```

---

## ✅ Arquitectura Alineada

La nueva arquitectura:
- ✅ Soporta misiones mensuales con video reveals
- ✅ Sistema de códigos secretos
- ✅ Arcángeles como guardianes permanentes
- ✅ Ceremonia de iniciación inmersiva
- ✅ Retos semanales familiares
- ✅ Sistema de niveles por colores
- ✅ Subida de pruebas con moderación
- ✅ Puntos Luz y recompensas canjeables
- ✅ Mapa mundial interactivo
- ✅ Eventos ceremoniales en vivo
- ✅ Comunidad moderada y segura
- ✅ Graduación con capa física

**Esta es la arquitectura que construiremos.** 🔥
