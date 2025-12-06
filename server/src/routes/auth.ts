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
        fullName: user.profile?.fullName,
        subscriptionStatus: user.subscription?.status,
        subscriptionEndsAt: user.subscription?.currentPeriodEnd
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
        fullName: user.profile?.fullName,
        preferredLanguage: user.profile?.preferredLanguage,
        subscriptionStatus: user.subscription?.status,
        subscriptionEndsAt: user.subscription?.currentPeriodEnd,
        children: user.children
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

    res.json({
      child: {
        id: child.id,
        secretCode: child.secretCode,
        name: child.name,
        superheroName: child.superheroName,
        age: child.age,
        avatarUrl: child.avatarUrl,
        luzPoints: child.luzPoints,
        rank: child.rank,
        initiationCompleted: child.initiationCompleted,
        archangel: child.archangel
      }
    });
  } catch (error) {
    console.error('Child login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
