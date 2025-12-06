import { PrismaClient, RewardType, RewardRarity } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Seed Archangels
  const archangels = [
    {
      nameEs: 'Miguel',
      nameEn: 'Michael',
      power: 'Coraje y Protección',
      descriptionEs: 'El arcángel del coraje y la protección. Te ayuda a ser valiente y defender lo que es correcto.',
      descriptionEn: 'The archangel of courage and protection. Helps you be brave and defend what is right.',
      colorHex: '#E63946',
      illustrationUrl: '/archangels/miguel.svg',
      order: 1
    },
    {
      nameEs: 'Gabriel',
      nameEn: 'Gabriel',
      power: 'Comunicación y Creatividad',
      descriptionEs: 'El arcángel de la comunicación y la creatividad. Te inspira a expresarte y crear belleza.',
      descriptionEn: 'The archangel of communication and creativity. Inspires you to express yourself and create beauty.',
      colorHex: '#3B82F6',
      illustrationUrl: '/archangels/gabriel.svg',
      order: 2
    },
    {
      nameEs: 'Rafael',
      nameEn: 'Raphael',
      power: 'Sanación y Compasión',
      descriptionEs: 'El arcángel de la sanación y la compasión. Te guía para cuidar de ti mismo y de los demás.',
      descriptionEn: 'The archangel of healing and compassion. Guides you to care for yourself and others.',
      colorHex: '#10B981',
      illustrationUrl: '/archangels/rafael.svg',
      order: 3
    },
    {
      nameEs: 'Uriel',
      nameEn: 'Uriel',
      power: 'Sabiduría y Luz',
      descriptionEs: 'El arcángel de la sabiduría y la luz. Ilumina tu camino hacia el conocimiento y la verdad.',
      descriptionEn: 'The archangel of wisdom and light. Illuminates your path to knowledge and truth.',
      colorHex: '#F59E0B',
      illustrationUrl: '/archangels/uriel.svg',
      order: 4
    },
    {
      nameEs: 'Jofiel',
      nameEn: 'Jophiel',
      power: 'Belleza y Alegría',
      descriptionEs: 'El arcángel de la belleza y la alegría. Te ayuda a ver lo hermoso en todo y vivir con felicidad.',
      descriptionEn: 'The archangel of beauty and joy. Helps you see beauty in everything and live with happiness.',
      colorHex: '#EC4899',
      illustrationUrl: '/archangels/jofiel.svg',
      order: 5
    },
    {
      nameEs: 'Chamuel',
      nameEn: 'Chamuel',
      power: 'Amor y Paz',
      descriptionEs: 'El arcángel del amor y la paz. Te enseña a amar incondicionalmente y vivir en armonía.',
      descriptionEn: 'The archangel of love and peace. Teaches you to love unconditionally and live in harmony.',
      colorHex: '#8B5CF6',
      illustrationUrl: '/archangels/chamuel.svg',
      order: 6
    },
    {
      nameEs: 'Zadquiel',
      nameEn: 'Zadkiel',
      power: 'Perdón y Transformación',
      descriptionEs: 'El arcángel del perdón y la transformación. Te muestra cómo liberar el pasado y crecer.',
      descriptionEn: 'The archangel of forgiveness and transformation. Shows you how to release the past and grow.',
      colorHex: '#6366F1',
      illustrationUrl: '/archangels/zadquiel.svg',
      order: 7
    }
  ];

  for (const archangel of archangels) {
    await prisma.archangel.upsert({
      where: { order: archangel.order },
      update: archangel,
      create: archangel
    });
  }

  console.log(`✅ Created ${archangels.length} archangels`);

  // Seed Rewards
  const rewards = [
    {
      type: RewardType.BADGE,
      code: 'INICIADO',
      nameEs: 'Iniciado',
      nameEn: 'Initiate',
      descriptionEs: 'Has completado tu ceremonia de iniciación y te has unido al equipo secreto',
      descriptionEn: 'You have completed your initiation ceremony and joined the secret team',
      luzPointsCost: 0,
      iconUrl: '/badges/iniciado.svg',
      rarity: RewardRarity.COMMON,
      isRedeemable: false,
      stockCount: null
    },
    {
      type: RewardType.BADGE,
      code: 'VALIENTE',
      nameEs: 'Valiente',
      nameEn: 'Brave',
      descriptionEs: 'Has demostrado coraje completando 10 misiones',
      descriptionEn: 'You have shown courage by completing 10 missions',
      luzPointsCost: 0,
      iconUrl: '/badges/valiente.svg',
      rarity: RewardRarity.RARE,
      isRedeemable: false,
      stockCount: null
    },
    {
      type: RewardType.BADGE,
      code: 'SABIO',
      nameEs: 'Sabio',
      nameEn: 'Wise',
      descriptionEs: 'Tu sabiduría brilla completando 25 misiones',
      descriptionEn: 'Your wisdom shines by completing 25 missions',
      luzPointsCost: 0,
      iconUrl: '/badges/sabio.svg',
      rarity: RewardRarity.EPIC,
      isRedeemable: false,
      stockCount: null
    },
    {
      type: RewardType.BADGE,
      code: 'MAESTRO',
      nameEs: 'Maestro del Corazón',
      nameEn: 'Heart Master',
      descriptionEs: 'Has alcanzado el nivel más alto de maestría',
      descriptionEn: 'You have reached the highest level of mastery',
      luzPointsCost: 0,
      iconUrl: '/badges/maestro.svg',
      rarity: RewardRarity.LEGENDARY,
      isRedeemable: false,
      stockCount: null
    },
    {
      type: RewardType.PHYSICAL,
      code: 'CARTA_SUPERHEROE',
      nameEs: 'Carta de Superhéroe',
      nameEn: 'Superhero Card',
      descriptionEs: 'Una carta coleccionable personalizada con tu superhéroe',
      descriptionEn: 'A collectible card personalized with your superhero',
      luzPointsCost: 100,
      iconUrl: '/rewards/carta-superheroe.jpg',
      rarity: RewardRarity.COMMON,
      isRedeemable: true,
      stockCount: 1000
    },
    {
      type: RewardType.PHYSICAL,
      code: 'PULSERA_LUZ',
      nameEs: 'Pulsera de Luz',
      nameEn: 'Light Bracelet',
      descriptionEs: 'Pulsera con el símbolo de tu arcángel guardián',
      descriptionEn: 'Bracelet with your guardian archangel symbol',
      luzPointsCost: 250,
      iconUrl: '/rewards/pulsera-luz.jpg',
      rarity: RewardRarity.RARE,
      isRedeemable: true,
      stockCount: 500
    },
    {
      type: RewardType.PHYSICAL,
      code: 'DIPLOMA_MAESTRO',
      nameEs: 'Diploma de Maestro',
      nameEn: 'Master Diploma',
      descriptionEs: 'Diploma oficial certificando tu rango de Maestro del Corazón',
      descriptionEn: 'Official diploma certifying your rank as Heart Master',
      luzPointsCost: 500,
      iconUrl: '/rewards/diploma-maestro.jpg',
      rarity: RewardRarity.EPIC,
      isRedeemable: true,
      stockCount: 200
    },
    {
      type: RewardType.DIGITAL,
      code: 'AVATAR_EXCLUSIVO',
      nameEs: 'Avatar Exclusivo',
      nameEn: 'Exclusive Avatar',
      descriptionEs: 'Desbloquea un avatar especial para tu perfil',
      descriptionEn: 'Unlock a special avatar for your profile',
      luzPointsCost: 50,
      iconUrl: '/rewards/avatar-exclusivo.jpg',
      rarity: RewardRarity.COMMON,
      isRedeemable: true,
      stockCount: null
    },
    {
      type: RewardType.EXPERIENCE,
      code: 'MISION_SECRETA',
      nameEs: 'Misión Secreta',
      nameEn: 'Secret Mission',
      descriptionEs: 'Acceso a una misión especial solo para maestros',
      descriptionEn: 'Access to a special mission for masters only',
      luzPointsCost: 300,
      iconUrl: '/rewards/mision-secreta.jpg',
      rarity: RewardRarity.EPIC,
      isRedeemable: true,
      stockCount: null
    }
  ];

  for (const reward of rewards) {
    await prisma.reward.upsert({
      where: { code: reward.code },
      update: reward,
      create: reward
    });
  }

  console.log(`✅ Created ${rewards.length} rewards`);
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
