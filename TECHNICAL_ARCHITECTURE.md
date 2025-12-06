# Los Superhéroes del Corazón - Arquitectura Técnica Completa

**Fecha**: 4 de Diciembre, 2025
**Versión**: 1.0
**Estado**: Planificación

---

## 🎯 Requisitos Técnicos

### Funcionales
- ✅ Sitio web multiidioma (español primario, inglés futuro)
- ✅ Sistema de autenticación (niños/padres)
- ✅ Plataforma de aprendizaje interactiva (7 niveles)
- ✅ Sistema de progreso y badges
- ✅ Pagos recurrentes (membresía premium)
- ✅ CMS para contenido educativo
- ✅ Video streaming optimizado
- ✅ Descarga de recursos (PDFs, worksheets)
- ✅ Comunidad/foro (futuro)
- ✅ Panel de administración

### No Funcionales
- ⚡ **Performance**: < 3s carga inicial
- 📱 **Responsive**: Mobile-first (niños en tablets)
- 🔒 **Seguridad**: COPPA compliant (datos de niños)
- 🌍 **SEO**: Optimizado para búsqueda orgánica
- ♿ **Accesibilidad**: WCAG 2.1 AA mínimo
- 📊 **Analytics**: Tracking sin invasión
- 🚀 **Escalabilidad**: Soportar 10K+ usuarios

---

## 🏗️ Stack Tecnológico

### Frontend

#### Core Framework
```
Next.js 14+ (App Router)
├── React 18+
├── TypeScript
└── Server Components + Client Components
```

**Por qué Next.js**:
- SSR/SSG para SEO (crítico para discovery)
- Image optimization automática
- API routes para serverless functions
- Edge functions para performance
- Vercel deployment nativo

#### Styling & UI
```
Tailwind CSS 3+
├── Custom Design System (7 colores de superhéroes)
├── Framer Motion (animaciones)
└── Radix UI (componentes accesibles)
```

**Design System**:
- 7 colores primarios (superhéroes)
- Dorado (alquimia/transformación)
- Tipografía clara para niños
- Iconografía personalizada

#### Animaciones & Interactividad
```
Framer Motion
├── Page transitions
├── Superhéroe reveal animations
└── Interactive game components

Lottie
├── Superhéroe character animations
└── Badge/certificate animations

React Spring (opcional)
└── Physics-based interactions
```

#### State Management
```
Zustand (simple, performante)
├── User progress state
├── Auth state
├── UI state (modals, sidebars)
└── Offline sync state

React Query (TanStack Query)
├── Server state management
├── Cache optimization
└── Optimistic updates
```

---

### Backend

#### Backend as a Service
```
Supabase (PostgreSQL + Auth + Storage + Realtime)
├── Auth: Email/password, OAuth (Google)
├── Database: PostgreSQL 15+
├── Storage: Media files, PDFs, videos
├── Realtime: Live progress updates
└── Edge Functions: Serverless logic
```

**Por qué Supabase**:
- Open source (no vendor lock-in)
- PostgreSQL real (queries complejas)
- Row Level Security (RLS) nativo
- Realtime subscriptions
- Auth built-in
- Precio escalable

#### Database Schema (PostgreSQL)

```sql
-- USERS & AUTH
users (Supabase Auth)
├── id (uuid, PK)
├── email (text, unique)
├── created_at (timestamp)
└── metadata (jsonb)

profiles
├── id (uuid, PK, FK -> users.id)
├── role (enum: 'parent', 'child', 'educator', 'admin')
├── full_name (text)
├── avatar_url (text)
├── preferred_language (text, default 'es')
├── timezone (text)
├── created_at (timestamp)
└── updated_at (timestamp)

children
├── id (uuid, PK)
├── parent_id (uuid, FK -> profiles.id)
├── name (text)
├── age (int)
├── avatar_superhero (enum: 7 superhéroes)
├── created_at (timestamp)
└── updated_at (timestamp)

-- CONTENT STRUCTURE
superheroes
├── id (int, PK)
├── slug (text, unique) -- 'mentalia', 'speculum', etc.
├── name_es (text)
├── name_en (text)
├── principle (text) -- 'Mentalismo', 'Correspondencia', etc.
├── color_hex (text)
├── mascot (text)
├── description_es (text)
├── description_en (text)
├── order (int) -- 1-7
└── illustration_url (text)

levels
├── id (uuid, PK)
├── superhero_id (int, FK -> superheroes.id)
├── level_number (int) -- 1-7
├── title_es (text)
├── title_en (text)
├── description_es (text)
├── description_en (text)
├── is_free (boolean) -- Nivel 1 = true
├── estimated_duration_minutes (int)
└── order (int)

activities
├── id (uuid, PK)
├── level_id (uuid, FK -> levels.id)
├── type (enum: 'video', 'game', 'reading', 'exercise', 'quiz')
├── title_es (text)
├── title_en (text)
├── content_url (text)
├── duration_minutes (int)
├── order (int)
└── metadata (jsonb) -- Activity-specific data

-- PROGRESS TRACKING
child_progress
├── id (uuid, PK)
├── child_id (uuid, FK -> children.id)
├── level_id (uuid, FK -> levels.id)
├── started_at (timestamp)
├── completed_at (timestamp, nullable)
├── completion_percentage (int)
└── last_activity_id (uuid, nullable)

activity_completions
├── id (uuid, PK)
├── child_id (uuid, FK -> children.id)
├── activity_id (uuid, FK -> activities.id)
├── completed_at (timestamp)
├── score (int, nullable) -- For quizzes/games
└── time_spent_seconds (int)

badges
├── id (uuid, PK)
├── code (text, unique) -- 'level_1_complete', 'all_7_complete', etc.
├── name_es (text)
├── name_en (text)
├── description_es (text)
├── description_en (text)
├── icon_url (text)
└── rarity (enum: 'common', 'rare', 'epic', 'legendary')

child_badges
├── id (uuid, PK)
├── child_id (uuid, FK -> children.id)
├── badge_id (uuid, FK -> badges.id)
├── earned_at (timestamp)
└── metadata (jsonb) -- Context of earning

-- SUBSCRIPTIONS & PAYMENTS
subscriptions
├── id (uuid, PK)
├── parent_id (uuid, FK -> profiles.id)
├── stripe_customer_id (text)
├── stripe_subscription_id (text)
├── status (enum: 'active', 'canceled', 'past_due')
├── plan (enum: 'free', 'premium')
├── current_period_start (timestamp)
├── current_period_end (timestamp)
├── cancel_at_period_end (boolean)
└── created_at (timestamp)

payment_history
├── id (uuid, PK)
├── subscription_id (uuid, FK -> subscriptions.id)
├── stripe_invoice_id (text)
├── amount_cents (int)
├── currency (text)
├── status (enum: 'paid', 'failed', 'pending')
├── paid_at (timestamp)
└── created_at (timestamp)

-- CONTENT MANAGEMENT
blog_posts
├── id (uuid, PK)
├── slug (text, unique)
├── title_es (text)
├── title_en (text)
├── excerpt_es (text)
├── excerpt_en (text)
├── content_es (text) -- Markdown
├── content_en (text) -- Markdown
├── cover_image_url (text)
├── author_id (uuid, FK -> profiles.id)
├── published_at (timestamp, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)

resources
├── id (uuid, PK)
├── title_es (text)
├── title_en (text)
├── description_es (text)
├── description_en (text)
├── type (enum: 'pdf', 'worksheet', 'coloring', 'guide')
├── file_url (text)
├── thumbnail_url (text)
├── is_free (boolean)
├── download_count (int)
└── created_at (timestamp)

-- COMMUNITY (Futuro Fase 3)
forum_posts
├── id (uuid, PK)
├── author_id (uuid, FK -> profiles.id)
├── title (text)
├── content (text)
├── created_at (timestamp)
└── updated_at (timestamp)

forum_comments
├── id (uuid, PK)
├── post_id (uuid, FK -> forum_posts.id)
├── author_id (uuid, FK -> profiles.id)
├── content (text)
├── created_at (timestamp)
└── updated_at (timestamp)
```

#### Row Level Security (RLS) Examples

```sql
-- Ejemplo: Solo padres pueden ver sus propios hijos
CREATE POLICY "Parents can view their own children"
  ON children
  FOR SELECT
  USING (parent_id = auth.uid());

-- Ejemplo: Niños solo ven su propio progreso
CREATE POLICY "Children can view their own progress"
  ON child_progress
  FOR SELECT
  USING (child_id IN (
    SELECT id FROM children WHERE parent_id = auth.uid()
  ));

-- Ejemplo: Contenido gratuito visible para todos
CREATE POLICY "Free levels visible to all"
  ON levels
  FOR SELECT
  USING (is_free = true);

-- Ejemplo: Contenido premium solo para suscriptores
CREATE POLICY "Premium levels for subscribers"
  ON levels
  FOR SELECT
  USING (
    is_free = true OR
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE parent_id = auth.uid()
      AND status = 'active'
      AND plan = 'premium'
    )
  );
```

---

### Storage & Media

#### Supabase Storage Buckets
```
avatars/
├── profiles/{user_id}/
└── children/{child_id}/

superheroes/
├── illustrations/
├── animations/
└── assets/

activities/
├── videos/{activity_id}/
├── games/{activity_id}/
└── exercises/{activity_id}/

resources/
├── pdfs/
├── worksheets/
└── coloring/

certificates/
└── {child_id}/

blog/
└── {post_slug}/
```

#### Video Optimization
```
Cloudinary (alternative superior para video)
├── Automatic transcoding
├── Adaptive bitrate streaming
├── Thumbnail generation
├── CDN global
└── Transformations on-the-fly
```

**Videos**:
- 720p máximo (niños no necesitan 4K)
- Subtítulos en español siempre
- 5-7 minutos por video (atención infantil)
- Progressive loading
- Offline download (PWA)

---

### Payments

#### Stripe Integration
```
Stripe Checkout
├── Subscription management
├── Payment methods
├── Invoices
└── Customer portal

Webhooks
├── subscription.created
├── subscription.updated
├── subscription.deleted
├── invoice.paid
└── invoice.payment_failed
```

**Plans**:
```javascript
const PLANS = {
  free: {
    name: 'Gratis',
    price: 0,
    features: [
      'Nivel 1: El Despertar (completo)',
      'Conoce a los 7 superhéroes',
      'Recursos básicos descargables',
      'Comunidad de padres'
    ]
  },
  premium: {
    name: 'Superhéroe Completo',
    price: 9.99, // USD/mes
    priceId: 'price_xxx', // Stripe Price ID
    features: [
      'Los 7 niveles completos',
      'Videos exclusivos de cada superhéroe',
      'Certificados personalizados',
      'Recursos premium descargables',
      'Acceso a la comunidad privada',
      'Soporte prioritario',
      'Actualizaciones de contenido constantes'
    ]
  }
};
```

**Flujo de Pago**:
1. Usuario en Nivel 1 gratis
2. CTA a premium en múltiples puntos
3. Stripe Checkout hosted
4. Webhook confirma pago
5. Desbloqueo automático de niveles 2-7
6. Email de bienvenida premium

---

### API Architecture

#### Next.js API Routes
```
/api
├── /auth
│   ├── /login
│   ├── /logout
│   └── /register
├── /children
│   ├── GET /api/children (list)
│   ├── POST /api/children (create)
│   └── GET /api/children/[id] (detail)
├── /progress
│   ├── GET /api/progress/[childId]
│   ├── POST /api/progress/activity (mark complete)
│   └── GET /api/progress/[childId]/badges
├── /levels
│   ├── GET /api/levels (list all)
│   └── GET /api/levels/[id] (detail with activities)
├── /subscription
│   ├── POST /api/subscription/create-checkout
│   ├── POST /api/subscription/create-portal
│   └── POST /api/webhook/stripe
└── /resources
    ├── GET /api/resources (list)
    └── GET /api/resources/[id]/download
```

#### Supabase Edge Functions
```
/supabase/functions
├── /send-certificate-email
├── /generate-certificate-pdf
├── /process-badge-unlock
└── /send-progress-report
```

---

### Authentication & Authorization

#### User Roles
```typescript
enum UserRole {
  PARENT = 'parent',      // Cuenta principal, maneja niños y pagos
  CHILD = 'child',        // Perfil de niño (sin email propio)
  EDUCATOR = 'educator',  // Maestros/terapeutas (futuro)
  ADMIN = 'admin'         // Staff interno
}
```

#### Auth Flow
```
1. Parent Registration
   ├── Email/password or Google OAuth
   ├── Profile creation
   └── Redirect to onboarding

2. Child Profile Creation
   ├── Parent adds child
   ├── Name + age + avatar selection
   └── Child progress initialized

3. Multi-Child Support
   ├── Switch between children
   ├── Individual progress per child
   └── Shared parent subscription

4. Session Management
   ├── JWT tokens (Supabase)
   ├── Refresh token rotation
   └── Secure httpOnly cookies
```

#### COPPA Compliance (Niños < 13)
- ✅ No email de niños
- ✅ Parental consent required
- ✅ Minimal data collection
- ✅ No targeted ads
- ✅ No third-party data sharing
- ✅ Privacy policy clara
- ✅ Parental access to child data

---

### Frontend Architecture

#### Folder Structure
```
/app
├── (auth)
│   ├── login/
│   ├── registro/
│   └── layout.tsx
├── (marketing)
│   ├── page.tsx (landing)
│   ├── superheroes/
│   │   └── [slug]/
│   ├── recursos/
│   ├── blog/
│   └── layout.tsx
├── (platform)
│   ├── dashboard/
│   ├── nivel/[id]/
│   │   ├── page.tsx
│   │   └── actividad/[activityId]/
│   ├── progreso/
│   ├── certificados/
│   └── layout.tsx (auth required)
└── api/
    └── [various routes]

/components
├── /ui (design system)
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   └── ...
├── /superhero
│   ├── SuperheroCard.tsx
│   ├── SuperheroAvatar.tsx
│   └── SuperheroAnimation.tsx
├── /activity
│   ├── VideoActivity.tsx
│   ├── GameActivity.tsx
│   ├── QuizActivity.tsx
│   └── ExerciseActivity.tsx
├── /progress
│   ├── ProgressBar.tsx
│   ├── BadgeDisplay.tsx
│   └── LevelUnlock.tsx
└── /layout
    ├── Navigation.tsx
    ├── Sidebar.tsx
    └── Footer.tsx

/lib
├── /supabase
│   ├── client.ts
│   ├── server.ts
│   └── types.ts (generated)
├── /stripe
│   ├── client.ts
│   └── webhook.ts
├── /utils
│   ├── cn.ts (class merge)
│   ├── date.ts
│   └── progress.ts
└── /hooks
    ├── useAuth.ts
    ├── useProgress.ts
    ├── useSubscription.ts
    └── useChildren.ts

/content
├── /superheroes
│   ├── mentalia.md
│   ├── speculum.md
│   └── ...
├── /blog
│   └── [posts in markdown]
└── /resources
    └── [guides in markdown]

/public
├── /images
│   ├── /superheroes
│   ├── /badges
│   └── /og
├── /videos (small assets)
└── /fonts
```

#### Component Architecture
```typescript
// Example: Superhero Component Hierarchy

<SuperheroPage slug="mentalia">
  <SuperheroHero superhero={mentalia} />
  <SuperheroPrinciple principle="Mentalismo" />
  <SuperheroStory story={...} />
  <SuperheroActivitiesPreview activities={...} />
  <SuperheroCTA isUnlocked={...} />
</SuperheroPage>

// Example: Activity Component Hierarchy

<ActivityPage activityId="...">
  <ActivityHeader activity={...} />
  <ActivityContent type={activity.type}>
    {type === 'video' && <VideoActivity />}
    {type === 'game' && <GameActivity />}
    {type === 'quiz' && <QuizActivity />}
  </ActivityContent>
  <ActivityProgress onComplete={...} />
  <ActivityNavigation prev={...} next={...} />
</ActivityPage>
```

---

### Performance Optimization

#### Next.js Optimizations
```typescript
// Image Optimization
import Image from 'next/image';
<Image
  src="/superheroes/mentalia.jpg"
  width={400}
  height={400}
  alt="Mentalia"
  priority={isHero}
  placeholder="blur"
/>

// Font Optimization
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

// Route Prefetching
<Link href="/nivel/1" prefetch={true}>
  Comenzar Nivel 1
</Link>

// Static Generation for marketing pages
export const dynamic = 'force-static';

// Server Components by default
// Client Components only when needed
'use client'; // Only for interactive components
```

#### Code Splitting
```typescript
// Dynamic imports for heavy components
const GameActivity = dynamic(
  () => import('@/components/activity/GameActivity'),
  {
    loading: () => <ActivitySkeleton />,
    ssr: false // Client-side only
  }
);

// Lazy load Lottie animations
const LottieAnimation = dynamic(
  () => import('lottie-react'),
  { ssr: false }
);
```

#### Caching Strategy
```typescript
// API Route caching
export async function GET() {
  const data = await fetchSuperheroes();

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}

// React Query caching
const { data } = useQuery({
  queryKey: ['progress', childId],
  queryFn: () => fetchProgress(childId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000  // 30 minutes
});
```

#### Bundle Size Optimization
- Tree-shaking automático (Next.js)
- Dynamic imports para routes pesadas
- Optimize images (WebP/AVIF)
- Font subsetting (solo caracteres latinos)
- CSS purging (Tailwind)
- Analyze bundle: `next build --analyze`

---

### SEO & Marketing

#### Meta Tags Strategy
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Los Superhéroes del Corazón - Hermetismo para Niños',
    template: '%s | Los Superhéroes del Corazón'
  },
  description: 'Aprende los 7 principios herméticos jugando. Plataforma educativa que enseña la Gran Obra a través de superhéroes y aventuras.',
  keywords: ['hermetismo niños', 'educación espiritual', 'principios herméticos', 'transformación infantil'],
  authors: [{ name: 'Hermetic Ormus' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://lossuperheroesdelcorazon.com',
    siteName: 'Los Superhéroes del Corazón',
    images: ['/og-image.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Los Superhéroes del Corazón',
    description: 'Hermetismo para niños a través del juego',
    images: ['/twitter-image.jpg']
  }
};

// Per-page metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const superhero = await fetchSuperhero(params.slug);

  return {
    title: `${superhero.name} - El Superhéroe de ${superhero.principle}`,
    description: superhero.description,
    openGraph: {
      images: [superhero.imageUrl]
    }
  };
}
```

#### Structured Data (Schema.org)
```typescript
// JSON-LD for rich snippets
const schema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Los Superhéroes del Corazón",
  "description": "Plataforma educativa de hermetismo para niños",
  "url": "https://lossuperheroesdelcorazon.com",
  "logo": "https://lossuperheroesdelcorazon.com/logo.png",
  "sameAs": [
    "https://facebook.com/superheroesdelcorazon",
    "https://instagram.com/superheroesdelcorazon"
  ],
  "offers": {
    "@type": "Offer",
    "price": "9.99",
    "priceCurrency": "USD"
  }
};
```

#### Sitemap Generation
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const superheroes = await fetchSuperheroes();
  const blogPosts = await fetchBlogPosts();

  return [
    {
      url: 'https://lossuperheroesdelcorazon.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...superheroes.map(hero => ({
      url: `https://lossuperheroesdelcorazon.com/superheroes/${hero.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    })),
    ...blogPosts.map(post => ({
      url: `https://lossuperheroesdelcorazon.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))
  ];
}
```

---

### Analytics & Monitoring

#### Analytics Stack
```
Plausible Analytics (GDPR-friendly)
├── No cookies
├── Privacy-first
├── Simple dashboard
└── No GDPR consent needed

Google Analytics 4 (opcional)
└── Solo con consent banner
```

#### Event Tracking
```typescript
// Key events to track
const EVENTS = {
  // Marketing
  LANDING_VIEW: 'landing_view',
  SUPERHERO_VIEW: 'superhero_view',
  CTA_CLICK: 'cta_click',

  // Auth
  SIGNUP_START: 'signup_start',
  SIGNUP_COMPLETE: 'signup_complete',
  LOGIN: 'login',

  // Platform
  CHILD_CREATED: 'child_created',
  LEVEL_START: 'level_start',
  LEVEL_COMPLETE: 'level_complete',
  ACTIVITY_COMPLETE: 'activity_complete',
  BADGE_EARNED: 'badge_earned',

  // Conversion
  CHECKOUT_START: 'checkout_start',
  SUBSCRIPTION_COMPLETE: 'subscription_complete',
  SUBSCRIPTION_CANCEL: 'subscription_cancel',

  // Engagement
  VIDEO_PLAY: 'video_play',
  VIDEO_COMPLETE: 'video_complete',
  RESOURCE_DOWNLOAD: 'resource_download'
};
```

#### Error Monitoring
```
Sentry
├── Error tracking
├── Performance monitoring
├── Session replay (opt-in)
└── User feedback widget
```

#### Performance Monitoring
```
Vercel Analytics
├── Real User Monitoring
├── Web Vitals tracking
├── Page speed insights
└── Edge function metrics

Core Web Vitals targets:
├── LCP < 2.5s
├── FID < 100ms
├── CLS < 0.1
└── TTFB < 600ms
```

---

### Security

#### Security Headers (next.config.js)
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
];
```

#### Content Security Policy
```javascript
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://*.supabase.co https://cloudinary.com;
  media-src 'self' https://*.supabase.co https://cloudinary.com;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com;
  font-src 'self' data:;
  frame-src 'self' https://js.stripe.com;
`;
```

#### Rate Limiting
```typescript
// API route protection
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too Many Requests', { status: 429 });
  }

  // Process request...
}
```

#### Data Validation
```typescript
// Zod schemas for type-safe validation
import { z } from 'zod';

const ChildSchema = z.object({
  name: z.string().min(1).max(50),
  age: z.number().int().min(3).max(17),
  avatar_superhero: z.enum(['mentalia', 'speculum', 'vibra', 'equilibris', 'ritmus', 'causalis', 'armonix'])
});

// API route with validation
export async function POST(req: Request) {
  const body = await req.json();

  try {
    const validatedData = ChildSchema.parse(body);
    // Process valid data...
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid data', details: error },
      { status: 400 }
    );
  }
}
```

---

### Testing Strategy

#### Unit Tests (Jest + Testing Library)
```typescript
// Component tests
describe('SuperheroCard', () => {
  it('renders superhero name and principle', () => {
    render(<SuperheroCard superhero={mockMentalia} />);
    expect(screen.getByText('Mentalia')).toBeInTheDocument();
    expect(screen.getByText('Mentalismo')).toBeInTheDocument();
  });

  it('shows unlock CTA for premium content', () => {
    render(<SuperheroCard superhero={mockSpeculum} isLocked={true} />);
    expect(screen.getByText('Desbloquear')).toBeInTheDocument();
  });
});

// Hook tests
describe('useProgress', () => {
  it('fetches child progress correctly', async () => {
    const { result } = renderHook(() => useProgress('child-123'));
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.progress).toHaveLength(7);
  });
});
```

#### Integration Tests (Playwright)
```typescript
// E2E critical user flows
test('complete registration and level 1', async ({ page }) => {
  // Registration
  await page.goto('/registro');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'SecurePass123!');
  await page.click('button[type="submit"]');

  // Create child profile
  await page.fill('[name="childName"]', 'Juanito');
  await page.selectOption('[name="age"]', '8');
  await page.click('button:has-text("Crear Perfil")');

  // Start Level 1
  await page.click('a:has-text("Comenzar Nivel 1")');
  await expect(page).toHaveURL(/\/nivel\/1/);

  // Complete first activity
  await page.click('button:has-text("Ver Video")');
  await page.waitForTimeout(5000); // Wait for video
  await page.click('button:has-text("Marcar como Completo")');

  // Verify progress
  await page.goto('/progreso');
  await expect(page.locator('.progress-bar')).toHaveAttribute('value', '14'); // 1/7 activities
});
```

#### Visual Regression Tests (Chromatic)
```typescript
// Storybook stories for visual testing
export const MentaliaCard: Story = {
  args: {
    superhero: {
      name: 'Mentalia',
      principle: 'Mentalismo',
      color: '#9333EA',
      illustration: '/superheroes/mentalia.jpg'
    }
  }
};
```

---

### Deployment & CI/CD

#### Vercel Deployment
```yaml
# vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"], # US East (closest to target audience)
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "STRIPE_SECRET_KEY": "@stripe-secret-key",
    "STRIPE_WEBHOOK_SECRET": "@stripe-webhook-secret"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        }
      ]
    }
  ]
}
```

#### GitHub Actions CI/CD
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

#### Environments
```
Development  → localhost:3000
Staging      → staging.lossuperheroesdelcorazon.com
Production   → lossuperheroesdelcorazon.com
```

---

## 🚀 Implementation Roadmap

### Phase 0: Setup (Week 1)
- [ ] Initialize Next.js project
- [ ] Set up Supabase project
- [ ] Configure Tailwind + design system
- [ ] Set up CI/CD pipeline
- [ ] Domain DNS configuration

### Phase 1: MVP (Weeks 2-4)
- [ ] Landing page
- [ ] Auth flow (register/login)
- [ ] Superhero showcase pages
- [ ] Level 1 complete (Mentalismo)
- [ ] Basic progress tracking
- [ ] Stripe integration
- [ ] Deploy to production

### Phase 2: Content (Weeks 5-8)
- [ ] Levels 2-7 content
- [ ] Video hosting setup
- [ ] Badge system
- [ ] Certificate generation
- [ ] Parent dashboard
- [ ] Resource downloads

### Phase 3: Polish (Weeks 9-12)
- [ ] Advanced animations
- [ ] Community features
- [ ] Blog/content marketing
- [ ] SEO optimization
- [ ] Performance tuning
- [ ] Mobile app (PWA)

---

## 💰 Infrastructure Costs (Estimated)

### Monthly Costs (< 1,000 users)
```
Vercel Pro:           $20/mo (necessary for team + preview deployments)
Supabase Pro:         $25/mo (better performance + support)
Cloudinary:           $0-89/mo (free tier sufficient initially)
Stripe:               2.9% + $0.30 per transaction
Domain:               ~$1/mo (annual amortized)
Sentry:               $0-26/mo (free tier sufficient)
Plausible Analytics:  $0-9/mo (free tier sufficient)
Total:                ~$75-170/mo
```

### Scaling Costs (10,000 users)
```
Vercel Pro:           $20/mo (same)
Supabase Pro:         $25-99/mo (may need scale tier)
Cloudinary:           $89-249/mo (more video bandwidth)
Stripe:               Variable (based on MRR)
CDN (if needed):      $20-50/mo
Total:                ~$154-418/mo + Stripe fees
```

### Revenue Projections
```
1,000 users × 10% conversion × $9.99 = $999/mo
10,000 users × 10% conversion × $9.99 = $9,990/mo

Break-even: ~15 paying subscribers
Profitable at: 100+ subscribers ($999/mo - $170/mo = $829/mo profit)
```

---

## 🔒 COPPA & Privacy Compliance

### Required Elements
- [ ] Privacy Policy (español + inglés)
- [ ] Terms of Service
- [ ] Cookie Policy
- [ ] Parental Consent mechanism
- [ ] Data deletion requests
- [ ] Data export functionality
- [ ] Minimal data collection notice
- [ ] No third-party trackers without consent

### Data Minimization
```
We collect ONLY:
✅ Parent email (auth)
✅ Child first name (display)
✅ Child age (content personalization)
✅ Progress data (platform functionality)

We DO NOT collect:
❌ Child email
❌ Child photos (unless parent uploads)
❌ Location data
❌ Browsing history beyond platform
❌ Social media data
❌ Behavioral tracking for ads
```

---

## 🎯 Success Metrics

### Technical Metrics
- Lighthouse Score > 90
- Time to Interactive < 3s
- API response time < 200ms
- 99.9% uptime
- Zero critical security vulnerabilities

### Business Metrics
- User registration rate
- Free → Premium conversion (target: 10%)
- Monthly Active Users (MAU)
- Customer Lifetime Value (LTV)
- Churn rate (target: < 5%)

### Engagement Metrics
- Level completion rate
- Average time per session
- Return user rate
- Badge unlock rate
- Resource download rate

---

## 🔥 Final Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│  Next.js 14 + React 18 + TypeScript + Tailwind     │
│  Vercel Edge Functions + CDN                        │
└─────────────────┬───────────────────────────────────┘
                  │
                  ├──────────────┐
                  │              │
        ┌─────────▼────────┐  ┌──▼───────────┐
        │   Supabase       │  │   Stripe     │
        │ - Auth           │  │ - Payments   │
        │ - PostgreSQL     │  │ - Subscriptions│
        │ - Storage        │  └──────────────┘
        │ - Edge Functions │
        └──────────────────┘
                  │
        ┌─────────▼────────┐
        │   Cloudinary     │
        │ - Videos         │
        │ - Images         │
        │ - Transformations│
        └──────────────────┘

Monitoring & Analytics:
├── Vercel Analytics (performance)
├── Sentry (errors)
├── Plausible (privacy-first analytics)
└── Stripe Dashboard (revenue)
```

**This architecture is**:
- ✅ Scalable (serverless + edge)
- ✅ Cost-effective (< $200/mo initially)
- ✅ Performant (global CDN)
- ✅ Secure (RLS + auth + encryption)
- ✅ Compliant (COPPA + GDPR ready)
- ✅ Maintainable (TypeScript + modern stack)

---

**Ready to build magic.** 🔥

"La arquitectura refleja la visión. La visión transforma vidas." 💫
