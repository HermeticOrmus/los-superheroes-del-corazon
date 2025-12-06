import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { generateSecretCode } from '../utils/jwt';
import { getAgeSafetyDefaults } from '../utils/child-safety';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/children
 * Get all children for the authenticated parent
 */
router.get('/', async (req, res) => {
  try {
    const parentId = req.user!.userId;

    const children = await prisma.child.findMany({
      where: { parentId },
      include: {
        archangel: {
          select: {
            nameEs: true,
            nameEn: true,
            power: true,
            colorHex: true,
            illustrationUrl: true
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ children });
  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({ error: 'Failed to fetch children' });
  }
});

/**
 * POST /api/children
 * Create a new child (requires active subscription)
 * Note: Child is created without archangel. Archangel assignment happens during onboarding.
 */
router.post('/', async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const { name, age, countryCode } = req.body;

    if (!name || !age) {
      return res.status(400).json({ error: 'Name and age required' });
    }

    // Check parent subscription
    const parent = await prisma.user.findUnique({
      where: { id: parentId },
      include: { subscription: true }
    });

    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    const subscription = parent.subscription;
    if (!subscription || (subscription.status !== 'ACTIVE' && subscription.status !== 'TRIALING')) {
      return res.status(403).json({ error: 'Active subscription required' });
    }

    // Generate unique secret code
    let secretCode: string;
    let isUnique = false;

    while (!isUnique) {
      secretCode = generateSecretCode();
      const existing = await prisma.child.findUnique({
        where: { secretCode }
      });
      if (!existing) {
        isUnique = true;
      }
    }

    // Get a random archangel to assign temporarily (proper assignment happens in onboarding)
    const archangels = await prisma.archangel.findMany();
    const randomArchangel = archangels[Math.floor(Math.random() * archangels.length)];

    // Get age-appropriate safety defaults
    const safetyDefaults = getAgeSafetyDefaults(age);

    // Create child
    const child = await prisma.child.create({
      data: {
        parentId,
        name,
        age,
        countryCode,
        secretCode: secretCode!,
        superheroName: '', // Will be set during onboarding
        archangelId: randomArchangel.id, // Temporary assignment
        luzPoints: 0, // Starts at 0, gets 100 bonus after initiation
        rank: 'INICIADO',
        initiationCompleted: false,
        // Apply age-based safety defaults
        requiresParentAssistance: safetyDefaults.requiresParentAssistance,
        canBrowseCommunity: safetyDefaults.canBrowseCommunity,
        canPostToCommunity: safetyDefaults.canPostToCommunity,
        canViewGlobalMap: safetyDefaults.canViewGlobalMap
      },
      include: {
        archangel: true
      }
    });

    res.status(201).json({
      child: {
        id: child.id,
        secretCode: child.secretCode,
        name: child.name,
        age: child.age,
        initiationCompleted: child.initiationCompleted,
        archangel: child.archangel
      },
      message: 'Child created! Use the secret code to complete onboarding ceremony.'
    });
  } catch (error) {
    console.error('Create child error:', error);
    res.status(500).json({ error: 'Failed to create child' });
  }
});

/**
 * GET /api/children/:id
 * Get child details by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const childId = req.params.id;

    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId
      },
      include: {
        archangel: true,
        rewards: {
          include: {
            reward: true
          }
        },
        missionProgress: {
          include: {
            mission: true
          }
        },
        challengeCompletions: {
          include: {
            challenge: true
          },
          orderBy: {
            submittedAt: 'desc'
          },
          take: 10
        }
      }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    res.json({ child });
  } catch (error) {
    console.error('Get child error:', error);
    res.status(500).json({ error: 'Failed to fetch child' });
  }
});

/**
 * PATCH /api/children/:id
 * Update child information
 */
router.patch('/:id', async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const childId = req.params.id;
    const { name, age, avatarUrl, countryCode } = req.body;

    // Verify ownership
    const existingChild = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId
      }
    });

    if (!existingChild) {
      return res.status(404).json({ error: 'Child not found' });
    }

    const child = await prisma.child.update({
      where: { id: childId },
      data: {
        ...(name && { name }),
        ...(age && { age }),
        ...(avatarUrl && { avatarUrl }),
        ...(countryCode && { countryCode })
      },
      include: {
        archangel: true
      }
    });

    res.json({ child });
  } catch (error) {
    console.error('Update child error:', error);
    res.status(500).json({ error: 'Failed to update child' });
  }
});

/**
 * DELETE /api/children/:id
 * Delete a child (with confirmation)
 */
router.delete('/:id', async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const childId = req.params.id;

    // Verify ownership
    const existingChild = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId
      }
    });

    if (!existingChild) {
      return res.status(404).json({ error: 'Child not found' });
    }

    await prisma.child.delete({
      where: { id: childId }
    });

    res.json({ message: 'Child deleted successfully' });
  } catch (error) {
    console.error('Delete child error:', error);
    res.status(500).json({ error: 'Failed to delete child' });
  }
});

export default router;
