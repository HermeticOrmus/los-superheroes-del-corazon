import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * POST /api/onboarding/complete
 * Complete onboarding ceremony for a child
 */
router.post('/complete', async (req, res) => {
  try {
    const { secretCode, superheroName, selectedArchangelId } = req.body;

    if (!secretCode || !superheroName || !selectedArchangelId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find child by secret code
    const child = await prisma.child.findUnique({
      where: { secretCode: secretCode.toUpperCase() }
    });

    if (!child) {
      return res.status(404).json({ error: 'Invalid secret code' });
    }

    if (child.initiationCompleted) {
      return res.status(400).json({ error: 'Onboarding already completed' });
    }

    // Verify archangel exists
    const archangel = await prisma.archangel.findUnique({
      where: { id: selectedArchangelId }
    });

    if (!archangel) {
      return res.status(404).json({ error: 'Archangel not found' });
    }

    // Update child with superhero name, archangel, and mark initiation complete
    // Give 100 Luz points as welcome bonus
    const updatedChild = await prisma.child.update({
      where: { id: child.id },
      data: {
        superheroName,
        archangelId: selectedArchangelId,
        initiationCompleted: true,
        luzPoints: 100 // Welcome bonus
      },
      include: {
        archangel: true
      }
    });

    // Award "Iniciado" reward/badge
    const iniciadoReward = await prisma.reward.findFirst({
      where: { code: 'INICIADO' }
    });

    if (iniciadoReward) {
      await prisma.childReward.create({
        data: {
          childId: updatedChild.id,
          rewardId: iniciadoReward.id,
          earnedAt: new Date()
        }
      });
    }

    res.json({
      success: true,
      child: {
        id: updatedChild.id,
        secretCode: updatedChild.secretCode,
        name: updatedChild.name,
        superheroName: updatedChild.superheroName,
        luzPoints: updatedChild.luzPoints,
        rank: updatedChild.rank,
        archangel: {
          nameEs: updatedChild.archangel!.nameEs,
          nameEn: updatedChild.archangel!.nameEn,
          power: updatedChild.archangel!.power,
          colorHex: updatedChild.archangel!.colorHex,
          illustrationUrl: updatedChild.archangel!.illustrationUrl
        }
      },
      message: '¡Bienvenido al Club de los Superhéroes del Corazón!'
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({ error: 'Failed to complete onboarding' });
  }
});

/**
 * POST /api/onboarding/generate-name
 * Generate superhero name suggestions
 */
router.post('/generate-name', async (req, res) => {
  try {
    const { name, age } = req.body;

    // Superhero name components
    const prefixes = [
      'Capitán', 'Súper', 'Ultra', 'Mega', 'Astro',
      'Comandante', 'Guardián', 'Protector', 'Defensor', 'Héroe'
    ];

    const suffixes = [
      'Valiente', 'Brillante', 'Radiante', 'Luminoso', 'Estelar',
      'del Corazón', 'de Luz', 'del Amor', 'de la Paz', 'de la Alegría'
    ];

    const heartAttributes = [
      'Corazón Valiente',
      'Alma Radiante',
      'Espíritu de Luz',
      'Luz del Corazón',
      'Guardián del Amor'
    ];

    const suggestions: string[] = [];

    // Suggestion 1: Use child's actual name
    if (name) {
      const firstName = name.split(' ')[0];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      suggestions.push(`${prefix} ${firstName}`);
    }

    // Suggestion 2: Random heart attribute
    const heartAttr = heartAttributes[Math.floor(Math.random() * heartAttributes.length)];
    suggestions.push(heartAttr);

    // Suggestions 3-5: Random combinations
    for (let i = suggestions.length; i < 5; i++) {
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const candidate = `${prefix} ${suffix}`;

      if (!suggestions.includes(candidate)) {
        suggestions.push(candidate);
      } else {
        i--; // Try again if duplicate
      }
    }

    res.json({ suggestions });
  } catch (error) {
    console.error('Generate name error:', error);
    res.status(500).json({ error: 'Failed to generate names' });
  }
});

export default router;
