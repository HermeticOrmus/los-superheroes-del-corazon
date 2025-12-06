import { Router } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateToken, generateSecretCode } from '../utils/jwt';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/auth/register
 * Register a new parent user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, preferredLanguage = 'es', timezone = 'America/Mexico_City' } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with profile and subscription in a transaction
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'PARENT',
        profile: {
          create: {
            fullName,
            preferredLanguage,
            timezone
          }
        },
        subscription: {
          create: {
            stripeCustomerId: `temp_${Date.now()}`, // Will be replaced when Stripe is set up
            status: 'TRIALING',
            plan: 'FREE',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
          }
        }
      },
      include: {
        profile: true,
        subscription: true
      }
    });

    // Generate JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: 'parent'
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.fullName || '',
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login for parent users
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        subscription: true,
        children: {
          select: {
            id: true,
            name: true,
            superheroName: true,
            avatarUrl: true,
            luzPoints: true,
            rank: true
          }
        }
      }
    });

    if (!user || user.role !== 'PARENT') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: 'parent'
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.profile?.fullName || '',
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * POST /api/auth/child-login
 * Login for children using their secret code
 */
router.post('/child-login', async (req, res) => {
  try {
    const { secretCode } = req.body;

    if (!secretCode) {
      return res.status(400).json({ error: 'Secret code required' });
    }

    // Find child by secret code
    const child = await prisma.child.findUnique({
      where: { secretCode: secretCode.toUpperCase() },
      include: {
        parent: {
          include: {
            subscription: true
          }
        },
        archangel: {
          select: {
            nameEs: true,
            nameEn: true,
            power: true,
            colorHex: true,
            illustrationUrl: true
          }
        }
      }
    });

    if (!child) {
      return res.status(401).json({ error: 'Invalid secret code' });
    }

    // Check if parent subscription is active
    const subscription = child.parent.subscription;

    if (!subscription || (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIALING')) {
      return res.status(403).json({ error: 'Subscription inactive. Please ask your parents to renew.' });
    }

    // Check if trial expired
    if (subscription.status === 'TRIALING' &&
        subscription.currentPeriodEnd &&
        subscription.currentPeriodEnd < new Date()) {
      return res.status(403).json({ error: 'Free trial expired. Please ask your parents to subscribe.' });
    }

    // Generate JWT for child
    const token = generateToken({
      userId: child.id,
      email: `${child.secretCode}@child.local`,
      role: 'parent' // Using parent role for now, children have limited access
    });

    res.json({
      token,
      user: {
        id: child.id,
        email: child.secretCode,
        name: child.superheroName || child.name,
        role: 'CHILD'
      }
    });
  } catch (error) {
    console.error('Child login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);

    // Verify and decode token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'superheroes-del-corazon-secret-key-change-in-production') as {
      userId: string;
      email: string;
      role: string;
    };

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
        subscription: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.profile?.fullName || '',
      role: user.role
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

/**
 * GET /api/auth/verify-token
 * Verify if current token is valid
 */
router.get('/verify-token', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ valid: false });
    }

    const token = authHeader.substring(7);

    const jwt = require('jsonwebtoken');
    jwt.verify(token, process.env.JWT_SECRET || 'superheroes-del-corazon-secret-key-change-in-production');

    res.json({ valid: true });
  } catch (error) {
    res.json({ valid: false });
  }
});

export default router;
