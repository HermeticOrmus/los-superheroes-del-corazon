import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth';
import childrenRoutes from './routes/children';
import archangelsRoutes from './routes/archangels';
import onboardingRoutes from './routes/onboarding';
import notificationsRoutes from './routes/notifications';
import safetyRoutes from './routes/safety';
import missionsRoutes from './routes/missions';
import challengesRoutes from './routes/challenges';
import rewardsRoutes from './routes/rewards';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 4000;

// ============================================
// MIDDLEWARE
// ============================================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Demasiadas solicitudes, por favor intenta de nuevo más tarde.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'API del Club de los Superhéroes del Corazón está funcionando',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/archangels', archangelsRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/missions', missionsRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/rewards', rewardsRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: 'El endpoint solicitado no existe'
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
  console.log(`\n🔥 Servidor API corriendo en puerto ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🎯 Health check: http://localhost:${PORT}/health\n`);
});
