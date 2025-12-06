import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all archangels (public route for onboarding)
router.get('/', async (req, res) => {
  try {
    const archangels = await prisma.archangel.findMany({
      orderBy: { order: 'asc' }
    });

    res.json({ archangels });
  } catch (error) {
    console.error('Get archangels error:', error);
    res.status(500).json({ error: 'Failed to fetch archangels' });
  }
});

// Get random archangel for assignment
router.get('/random', async (req, res) => {
  try {
    const archangels = await prisma.archangel.findMany();
    const randomIndex = Math.floor(Math.random() * archangels.length);
    const archangel = archangels[randomIndex];

    res.json({ archangel });
  } catch (error) {
    console.error('Get random archangel error:', error);
    res.status(500).json({ error: 'Failed to fetch archangel' });
  }
});

// Get archangel by ID
router.get('/:id', async (req, res) => {
  try {
    const archangel = await prisma.archangel.findUnique({
      where: { id: req.params.id }
    });

    if (!archangel) {
      return res.status(404).json({ error: 'Archangel not found' });
    }

    res.json({ archangel });
  } catch (error) {
    console.error('Get archangel error:', error);
    res.status(500).json({ error: 'Failed to fetch archangel' });
  }
});

export default router;
