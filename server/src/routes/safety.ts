import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import {
  getAgeSafetyDefaults,
  getAssistanceModeDescription,
  validateSafetyOverride,
  SafetySettings
} from '../utils/child-safety';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/safety/:childId
 * Get current safety settings for a child
 */
router.get('/:childId', async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const { childId } = req.params;

    // Verify ownership
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId
      }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Get age-appropriate defaults
    const defaults = getAgeSafetyDefaults(child.age);
    const modeDescription = getAssistanceModeDescription(child.age, 'es');

    res.json({
      current: {
        requiresParentAssistance: child.requiresParentAssistance,
        canBrowseCommunity: child.canBrowseCommunity,
        canPostToCommunity: child.canPostToCommunity,
        canViewGlobalMap: child.canViewGlobalMap
      },
      ageDefaults: defaults,
      modeDescription,
      childAge: child.age
    });
  } catch (error) {
    console.error('Get safety settings error:', error);
    res.status(500).json({ error: 'Failed to get safety settings' });
  }
});

/**
 * PUT /api/safety/:childId
 * Update safety settings for a child
 * Parents can only make settings MORE restrictive than age defaults
 */
router.put('/:childId', async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const { childId } = req.params;
    const {
      requiresParentAssistance,
      canBrowseCommunity,
      canPostToCommunity,
      canViewGlobalMap
    }: Partial<SafetySettings> = req.body;

    // Verify ownership
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId
      }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Validate the requested changes
    const requestedSettings: Partial<SafetySettings> = {};
    if (requiresParentAssistance !== undefined) requestedSettings.requiresParentAssistance = requiresParentAssistance;
    if (canBrowseCommunity !== undefined) requestedSettings.canBrowseCommunity = canBrowseCommunity;
    if (canPostToCommunity !== undefined) requestedSettings.canPostToCommunity = canPostToCommunity;
    if (canViewGlobalMap !== undefined) requestedSettings.canViewGlobalMap = canViewGlobalMap;

    const validation = validateSafetyOverride(child.age, requestedSettings);

    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid safety settings',
        errors: validation.errors
      });
    }

    // Update child safety settings
    const updatedChild = await prisma.child.update({
      where: { id: childId },
      data: {
        ...(requiresParentAssistance !== undefined && { requiresParentAssistance }),
        ...(canBrowseCommunity !== undefined && { canBrowseCommunity }),
        ...(canPostToCommunity !== undefined && { canPostToCommunity }),
        ...(canViewGlobalMap !== undefined && { canViewGlobalMap })
      }
    });

    res.json({
      message: 'Safety settings updated successfully',
      settings: {
        requiresParentAssistance: updatedChild.requiresParentAssistance,
        canBrowseCommunity: updatedChild.canBrowseCommunity,
        canPostToCommunity: updatedChild.canPostToCommunity,
        canViewGlobalMap: updatedChild.canViewGlobalMap
      }
    });
  } catch (error) {
    console.error('Update safety settings error:', error);
    res.status(500).json({ error: 'Failed to update safety settings' });
  }
});

/**
 * POST /api/safety/:childId/reset
 * Reset safety settings to age-appropriate defaults
 */
router.post('/:childId/reset', async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const { childId } = req.params;

    // Verify ownership
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        parentId
      }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    // Get age-appropriate defaults
    const defaults = getAgeSafetyDefaults(child.age);

    // Update child with defaults
    const updatedChild = await prisma.child.update({
      where: { id: childId },
      data: {
        requiresParentAssistance: defaults.requiresParentAssistance,
        canBrowseCommunity: defaults.canBrowseCommunity,
        canPostToCommunity: defaults.canPostToCommunity,
        canViewGlobalMap: defaults.canViewGlobalMap
      }
    });

    res.json({
      message: 'Safety settings reset to age-appropriate defaults',
      settings: {
        requiresParentAssistance: updatedChild.requiresParentAssistance,
        canBrowseCommunity: updatedChild.canBrowseCommunity,
        canPostToCommunity: updatedChild.canPostToCommunity,
        canViewGlobalMap: updatedChild.canViewGlobalMap
      }
    });
  } catch (error) {
    console.error('Reset safety settings error:', error);
    res.status(500).json({ error: 'Failed to reset safety settings' });
  }
});

export default router;
