import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/missions/current
 * Get the current month's mission (public access for display)
 */
router.get('/current', async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // JavaScript months are 0-indexed

    const mission = await prisma.monthlyMission.findUnique({
      where: {
        year_month: {
          year,
          month
        }
      },
      include: {
        archangel: {
          select: {
            nameEs: true,
            nameEn: true,
            power: true,
            colorHex: true,
            illustrationUrl: true
          }
        },
        challenges: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!mission) {
      return res.status(404).json({
        error: 'No mission found for current month',
        year,
        month
      });
    }

    res.json({ mission });
  } catch (error) {
    console.error('Get current mission error:', error);
    res.status(500).json({ error: 'Failed to get current mission' });
  }
});

/**
 * GET /api/missions/:year/:month
 * Get a specific month's mission
 */
router.get('/:year/:month', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid year or month' });
    }

    const mission = await prisma.monthlyMission.findUnique({
      where: {
        year_month: {
          year,
          month
        }
      },
      include: {
        archangel: {
          select: {
            nameEs: true,
            nameEn: true,
            power: true,
            colorHex: true,
            illustrationUrl: true
          }
        },
        challenges: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!mission) {
      return res.status(404).json({
        error: 'Mission not found',
        year,
        month
      });
    }

    res.json({ mission });
  } catch (error) {
    console.error('Get mission error:', error);
    res.status(500).json({ error: 'Failed to get mission' });
  }
});

/**
 * GET /api/missions/child/:childId/progress
 * Get mission progress for a specific child (requires authentication)
 */
router.get('/child/:childId/progress', authenticate, async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const { childId } = req.params;

    // Verify child belongs to parent
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId
      }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Get all mission progress for this child
    const progress = await prisma.childMissionProgress.findMany({
      where: {
        childId
      },
      include: {
        mission: {
          include: {
            archangel: {
              select: {
                nameEs: true,
                nameEn: true,
                colorHex: true
              }
            },
            challenges: true
          }
        }
      },
      orderBy: {
        startedAt: 'desc'
      }
    });

    res.json({ progress });
  } catch (error) {
    console.error('Get child mission progress error:', error);
    res.status(500).json({ error: 'Failed to get mission progress' });
  }
});

/**
 * POST /api/missions/child/:childId/start
 * Start a mission for a child
 */
router.post('/child/:childId/start', authenticate, async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const { childId } = req.params;
    const { missionId } = req.body;

    if (!missionId) {
      return res.status(400).json({ error: 'Mission ID required' });
    }

    // Verify child belongs to parent
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId
      }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Verify mission exists
    const mission = await prisma.monthlyMission.findUnique({
      where: { id: missionId }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Check if already started
    const existing = await prisma.childMissionProgress.findUnique({
      where: {
        childId_missionId: {
          childId,
          missionId
        }
      }
    });

    if (existing) {
      return res.status(400).json({
        error: 'Mission already started',
        progress: existing
      });
    }

    // Create mission progress
    const progress = await prisma.childMissionProgress.create({
      data: {
        childId,
        missionId,
        completionPercentage: 0
      },
      include: {
        mission: {
          include: {
            archangel: true,
            challenges: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Mission started successfully',
      progress
    });
  } catch (error) {
    console.error('Start mission error:', error);
    res.status(500).json({ error: 'Failed to start mission' });
  }
});

/**
 * GET /api/missions
 * Get all missions (paginated, for admin or browsing)
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const [missions, total] = await Promise.all([
      prisma.monthlyMission.findMany({
        skip,
        take: limit,
        include: {
          archangel: {
            select: {
              nameEs: true,
              nameEn: true,
              colorHex: true
            }
          },
          _count: {
            select: {
              challenges: true
            }
          }
        },
        orderBy: [
          { year: 'desc' },
          { month: 'desc' }
        ]
      }),
      prisma.monthlyMission.count()
    ]);

    res.json({
      missions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get missions error:', error);
    res.status(500).json({ error: 'Failed to get missions' });
  }
});

export default router;
