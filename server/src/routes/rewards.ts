import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { notifyBadgeEarned } from '../services/notification.service';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/rewards
 * Get all available rewards
 */
router.get('/', async (req, res) => {
  try {
    const type = req.query.type as string;
    const rarity = req.query.rarity as string;

    const whereClause: any = {
      isRedeemable: true
    };

    if (type && ['BADGE', 'PHYSICAL', 'DIGITAL', 'EXPERIENCE'].includes(type)) {
      whereClause.type = type;
    }

    if (rarity && ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'].includes(rarity)) {
      whereClause.rarity = rarity;
    }

    const rewards = await prisma.reward.findMany({
      where: whereClause,
      orderBy: [
        { rarity: 'asc' },
        { luzPointsCost: 'asc' }
      ]
    });

    res.json({ rewards });
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ error: 'Failed to get rewards' });
  }
});

/**
 * GET /api/rewards/:rewardId
 * Get a specific reward
 */
router.get('/:rewardId', async (req, res) => {
  try {
    const { rewardId } = req.params;

    const reward = await prisma.reward.findUnique({
      where: { id: rewardId }
    });

    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    res.json({ reward });
  } catch (error) {
    console.error('Get reward error:', error);
    res.status(500).json({ error: 'Failed to get reward' });
  }
});

/**
 * GET /api/rewards/child/:childId
 * Get all rewards earned by a child (requires authentication)
 */
router.get('/child/:childId', authenticate, async (req, res) => {
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

    const earnedRewards = await prisma.childReward.findMany({
      where: { childId },
      include: {
        reward: true
      },
      orderBy: {
        earnedAt: 'desc'
      }
    });

    res.json({
      earnedRewards,
      totalRewards: earnedRewards.length
    });
  } catch (error) {
    console.error('Get child rewards error:', error);
    res.status(500).json({ error: 'Failed to get child rewards' });
  }
});

/**
 * POST /api/rewards/:rewardId/redeem
 * Redeem a reward for a child (requires authentication)
 */
router.post('/:rewardId/redeem', authenticate, async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const { rewardId } = req.params;
    const { childId, shippingInfo } = req.body;

    if (!childId) {
      return res.status(400).json({ error: 'Child ID required' });
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

    // Get reward details
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId }
    });

    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    if (!reward.isRedeemable) {
      return res.status(400).json({ error: 'This reward is not currently available' });
    }

    // Check if reward has stock (for physical rewards)
    if (reward.stockCount !== null && reward.stockCount <= 0) {
      return res.status(400).json({ error: 'This reward is out of stock' });
    }

    // Check if child has enough Luz points
    if (child.luzPoints < reward.luzPointsCost) {
      return res.status(400).json({
        error: 'Insufficient Luz points',
        required: reward.luzPointsCost,
        available: child.luzPoints,
        shortage: reward.luzPointsCost - child.luzPoints
      });
    }

    // Validate shipping info for physical rewards
    if (reward.type === 'PHYSICAL' && !shippingInfo) {
      return res.status(400).json({
        error: 'Shipping information required for physical rewards'
      });
    }

    // Create reward record
    const childReward = await prisma.childReward.create({
      data: {
        childId,
        rewardId,
        redeemedAt: new Date(),
        redemptionStatus: reward.type === 'PHYSICAL' ? 'PENDING' : null,
        shippingInfo: reward.type === 'PHYSICAL' ? shippingInfo : null
      },
      include: {
        reward: true
      }
    });

    // Deduct Luz points
    const updatedChild = await prisma.child.update({
      where: { id: childId },
      data: {
        luzPoints: {
          decrement: reward.luzPointsCost
        }
      }
    });

    // Update stock if applicable
    if (reward.stockCount !== null) {
      await prisma.reward.update({
        where: { id: rewardId },
        data: {
          stockCount: {
            decrement: 1
          }
        }
      });
    }

    // Send notification
    await notifyBadgeEarned({
      userId: parentId,
      childId,
      badgeName: reward.nameEs,
      actionUrl: `/dashboard/children/${childId}/rewards`
    });

    res.status(201).json({
      message: 'Reward redeemed successfully!',
      childReward,
      pointsRemaining: updatedChild.luzPoints,
      pointsSpent: reward.luzPointsCost
    });
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({ error: 'Failed to redeem reward' });
  }
});

/**
 * GET /api/rewards/child/:childId/available
 * Get rewards available for redemption by a child (requires authentication)
 */
router.get('/child/:childId/available', authenticate, async (req, res) => {
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

    // Get all available rewards
    const allRewards = await prisma.reward.findMany({
      where: {
        isRedeemable: true,
        OR: [
          { stockCount: null },
          { stockCount: { gt: 0 } }
        ]
      },
      orderBy: [
        { luzPointsCost: 'asc' },
        { rarity: 'asc' }
      ]
    });

    // Categorize rewards by affordability
    const affordable = allRewards.filter(r => r.luzPointsCost <= child.luzPoints);
    const upcoming = allRewards.filter(r => r.luzPointsCost > child.luzPoints);

    res.json({
      childLuzPoints: child.luzPoints,
      affordable,
      upcoming,
      totalAvailable: allRewards.length
    });
  } catch (error) {
    console.error('Get available rewards error:', error);
    res.status(500).json({ error: 'Failed to get available rewards' });
  }
});

/**
 * POST /api/rewards/child/:childId/award
 * Manually award a reward to a child (admin function - placeholder)
 */
router.post('/child/:childId/award', authenticate, async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const { childId } = req.params;
    const { rewardId, metadata } = req.body;

    if (!rewardId) {
      return res.status(400).json({ error: 'Reward ID required' });
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

    // Get reward
    const reward = await prisma.reward.findUnique({
      where: { id: rewardId }
    });

    if (!reward) {
      return res.status(404).json({ error: 'Reward not found' });
    }

    // Award the reward (no points deduction)
    const childReward = await prisma.childReward.create({
      data: {
        childId,
        rewardId,
        metadata
      },
      include: {
        reward: true
      }
    });

    // Send notification
    await notifyBadgeEarned({
      userId: parentId,
      childId,
      badgeName: reward.nameEs,
      actionUrl: `/dashboard/children/${childId}/rewards`
    });

    res.status(201).json({
      message: 'Reward awarded successfully!',
      childReward
    });
  } catch (error) {
    console.error('Award reward error:', error);
    res.status(500).json({ error: 'Failed to award reward' });
  }
});

export default router;
