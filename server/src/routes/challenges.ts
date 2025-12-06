import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth';
import { notifyChallengeCompleted } from '../services/notification.service';

const router = Router();
const prisma = new PrismaClient();

/**
 * GET /api/challenges/mission/:missionId
 * Get all challenges for a specific mission
 */
router.get('/mission/:missionId', async (req, res) => {
  try {
    const { missionId } = req.params;

    const challenges = await prisma.weeklyChallenge.findMany({
      where: {
        missionId
      },
      orderBy: {
        order: 'asc'
      }
    });

    res.json({ challenges });
  } catch (error) {
    console.error('Get mission challenges error:', error);
    res.status(500).json({ error: 'Failed to get challenges' });
  }
});

/**
 * GET /api/challenges/:challengeId
 * Get a specific challenge
 */
router.get('/:challengeId', async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge = await prisma.weeklyChallenge.findUnique({
      where: { id: challengeId },
      include: {
        mission: {
          include: {
            archangel: {
              select: {
                nameEs: true,
                nameEn: true,
                colorHex: true
              }
            }
          }
        }
      }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    res.json({ challenge });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ error: 'Failed to get challenge' });
  }
});

/**
 * POST /api/challenges/:challengeId/submit
 * Submit proof for a challenge completion (requires authentication)
 */
router.post('/:challengeId/submit', authenticate, async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const { challengeId } = req.params;
    const { childId, proofUrls, proofType } = req.body;

    // Validation
    if (!childId || !proofUrls || !Array.isArray(proofUrls) || proofUrls.length === 0) {
      return res.status(400).json({
        error: 'Child ID and proof URLs are required'
      });
    }

    if (!['photo', 'video', 'audio'].includes(proofType)) {
      return res.status(400).json({
        error: 'Invalid proof type. Must be photo, video, or audio'
      });
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

    // Verify challenge exists
    const challenge = await prisma.weeklyChallenge.findUnique({
      where: { id: challengeId },
      include: {
        mission: true
      }
    });

    if (!challenge) {
      return res.status(404).json({ error: 'Challenge not found' });
    }

    // Check if proof type is allowed
    if (!challenge.requiredProofTypes.includes(proofType)) {
      return res.status(400).json({
        error: `This challenge requires proof type(s): ${challenge.requiredProofTypes.join(', ')}`,
        allowedTypes: challenge.requiredProofTypes
      });
    }

    // Check if already submitted
    const existing = await prisma.childChallengeCompletion.findFirst({
      where: {
        childId,
        challengeId,
        status: {
          in: ['PENDING', 'APPROVED']
        }
      }
    });

    if (existing) {
      return res.status(400).json({
        error: 'Challenge already submitted or completed',
        submission: existing
      });
    }

    // Create submission
    const submission = await prisma.childChallengeCompletion.create({
      data: {
        childId,
        challengeId,
        proofUrls,
        proofType,
        status: 'PENDING',
        luzPointsAwarded: 0 // Will be awarded upon approval
      },
      include: {
        challenge: {
          include: {
            mission: true
          }
        },
        child: true
      }
    });

    // Send notification to parent
    await notifyChallengeCompleted({
      userId: parentId,
      childId,
      challengeTitle: challenge.titleEs,
      luzPoints: 0, // Not awarded yet
      actionUrl: `/dashboard/children/${childId}/submissions/${submission.id}`
    });

    res.status(201).json({
      message: 'Challenge submission received! Awaiting review.',
      submission
    });
  } catch (error) {
    console.error('Submit challenge error:', error);
    res.status(500).json({ error: 'Failed to submit challenge' });
  }
});

/**
 * GET /api/challenges/child/:childId/submissions
 * Get all challenge submissions for a child (requires authentication)
 */
router.get('/child/:childId/submissions', authenticate, async (req, res) => {
  try {
    const parentId = req.user!.userId;
    const { childId } = req.params;
    const status = req.query.status as string;

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

    const whereClause: any = { childId };
    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      whereClause.status = status;
    }

    const submissions = await prisma.childChallengeCompletion.findMany({
      where: whereClause,
      include: {
        challenge: {
          include: {
            mission: {
              select: {
                titleEs: true,
                titleEn: true,
                year: true,
                month: true
              }
            }
          }
        }
      },
      orderBy: {
        submittedAt: 'desc'
      }
    });

    res.json({ submissions });
  } catch (error) {
    console.error('Get child submissions error:', error);
    res.status(500).json({ error: 'Failed to get submissions' });
  }
});

/**
 * PUT /api/challenges/submission/:submissionId/review
 * Review and approve/reject a submission (admin only - placeholder for now)
 */
router.put('/submission/:submissionId/review', authenticate, async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, moderatorNotes } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        error: 'Status must be APPROVED or REJECTED'
      });
    }

    const submission = await prisma.childChallengeCompletion.findUnique({
      where: { id: submissionId },
      include: {
        challenge: true,
        child: true
      }
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    if (submission.status !== 'PENDING') {
      return res.status(400).json({
        error: 'Submission already reviewed',
        currentStatus: submission.status
      });
    }

    const luzPointsAwarded = status === 'APPROVED' ? submission.challenge.luzPointsReward : 0;

    // Update submission
    const updatedSubmission = await prisma.childChallengeCompletion.update({
      where: { id: submissionId },
      data: {
        status,
        moderatorNotes,
        reviewedAt: new Date(),
        luzPointsAwarded
      },
      include: {
        challenge: true,
        child: true
      }
    });

    // Award Luz points if approved
    let updatedChild = submission.child;
    if (status === 'APPROVED') {
      updatedChild = await prisma.child.update({
        where: { id: submission.childId },
        data: {
          luzPoints: {
            increment: luzPointsAwarded
          }
        }
      });
    }

    // Update mission progress
    if (status === 'APPROVED') {
      await updateMissionProgress(submission.childId, submission.challenge.missionId);
    }

    res.json({
      message: `Submission ${status.toLowerCase()}`,
      submission: updatedSubmission,
      luzPointsAwarded
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({ error: 'Failed to review submission' });
  }
});

/**
 * Helper function to update mission completion percentage
 */
async function updateMissionProgress(childId: string, missionId: string) {
  try {
    // Get total challenges for this mission
    const totalChallenges = await prisma.weeklyChallenge.count({
      where: { missionId }
    });

    // Get completed challenges
    const completedChallenges = await prisma.childChallengeCompletion.count({
      where: {
        childId,
        challenge: {
          missionId
        },
        status: 'APPROVED'
      }
    });

    const completionPercentage = Math.round((completedChallenges / totalChallenges) * 100);

    // Update or create mission progress
    await prisma.childMissionProgress.upsert({
      where: {
        childId_missionId: {
          childId,
          missionId
        }
      },
      update: {
        completionPercentage,
        completedAt: completionPercentage === 100 ? new Date() : null
      },
      create: {
        childId,
        missionId,
        completionPercentage,
        completedAt: completionPercentage === 100 ? new Date() : null
      }
    });
  } catch (error) {
    console.error('Update mission progress error:', error);
  }
}

export default router;
