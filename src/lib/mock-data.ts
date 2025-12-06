/**
 * Mock Data for Dev Mode Testing
 * Provides realistic test data for the entire application
 */

export const MOCK_PARENT = {
  id: 'parent-mock-001',
  email: 'amoryvida@gmail.com',
  name: 'María González',
  role: 'PARENT',
};

export const MOCK_CHILDREN = [
  {
    id: 'child-mock-001',
    name: 'Amor',
    superheroName: 'Corazón de Luz',
    age: 8,
    luzPoints: 350,
    rank: 'VALIENTE' as const,
    initiationCompleted: true,
    requiresParentAssistance: true,
    secretCode: 'AMAR333',
    archangel: {
      nameEs: 'Arcángel Miguel',
      colorHex: '#ef4444',
    },
    createdAt: '2024-11-15T10:00:00Z',
  },
  {
    id: 'child-mock-002',
    name: 'Diego',
    superheroName: 'Guardián de Luz',
    age: 11,
    luzPoints: 580,
    rank: 'SABIO' as const,
    initiationCompleted: true,
    requiresParentAssistance: false,
    secretCode: 'DIEGO456',
    archangel: {
      nameEs: 'Arcángel Gabriel',
      colorHex: '#3b82f6',
    },
    createdAt: '2024-10-20T14:30:00Z',
  },
  {
    id: 'child-mock-003',
    name: 'Isabella',
    superheroName: 'Estrella del Alma',
    age: 5,
    luzPoints: 150,
    rank: 'INICIADO' as const,
    initiationCompleted: false,
    requiresParentAssistance: true,
    secretCode: 'BELLA789',
    archangel: {
      nameEs: 'Arcángel Rafael',
      colorHex: '#10b981',
    },
    createdAt: '2024-12-01T09:15:00Z',
  },
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-001',
    type: 'MISSION_RELEASED',
    titleEs: '¡Nueva Misión Disponible!',
    messageEs: 'La misión de Diciembre "El Poder de la Gratitud" ya está disponible para tus hijos.',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    actionUrl: '/dashboard/missions',
  },
  {
    id: 'notif-002',
    type: 'CHALLENGE_COMPLETED',
    titleEs: 'Desafío Completado',
    messageEs: 'Sofía completó el desafío "Acto de Bondad Diario" y ganó 50 Puntos Luz.',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    childName: 'Sofía (Corazón Valiente)',
    actionUrl: '/dashboard/children/child-mock-001',
  },
  {
    id: 'notif-003',
    type: 'RANK_UP',
    titleEs: '¡Promoción de Rango!',
    messageEs: 'Diego alcanzó el rango de Sabio. ¡Felicítalo por su dedicación!',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    childName: 'Diego (Guardián de Luz)',
    actionUrl: '/dashboard/children/child-mock-002',
  },
  {
    id: 'notif-004',
    type: 'BADGE_EARNED',
    titleEs: 'Nueva Insignia Desbloqueada',
    messageEs: 'Sofía ganó la insignia "Corazón Generoso" por completar 10 actos de bondad.',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    childName: 'Sofía (Corazón Valiente)',
  },
];

export const MOCK_ARCHANGELS = [
  {
    id: 'arch-001',
    nameEs: 'Arcángel Miguel',
    nameEn: 'Archangel Michael',
    power: 'Protección y Valentía',
    colorHex: '#ef4444',
    descriptionEs: 'Protector celestial que guía con coraje y fortaleza en momentos difíciles.',
  },
  {
    id: 'arch-002',
    nameEs: 'Arcángel Gabriel',
    nameEn: 'Archangel Gabriel',
    power: 'Comunicación y Verdad',
    colorHex: '#3b82f6',
    descriptionEs: 'Mensajero divino que inspira la expresión honesta y la creatividad.',
  },
  {
    id: 'arch-003',
    nameEs: 'Arcángel Rafael',
    nameEn: 'Archangel Raphael',
    power: 'Sanación y Amor',
    colorHex: '#10b981',
    descriptionEs: 'Sanador celestial que trae paz, armonía y bienestar al corazón.',
  },
  {
    id: 'arch-004',
    nameEs: 'Arcángel Uriel',
    nameEn: 'Archangel Uriel',
    power: 'Sabiduría y Luz',
    colorHex: '#f59e0b',
    descriptionEs: 'Portador de luz divina que ilumina el camino hacia el conocimiento.',
  },
  {
    id: 'arch-005',
    nameEs: 'Arcángel Chamuel',
    nameEn: 'Archangel Chamuel',
    power: 'Amor Incondicional',
    colorHex: '#ec4899',
    descriptionEs: 'Guardián del amor puro que fortalece las relaciones y la compasión.',
  },
  {
    id: 'arch-006',
    nameEs: 'Arcángel Jophiel',
    nameEn: 'Archangel Jophiel',
    power: 'Belleza y Alegría',
    colorHex: '#8b5cf6',
    descriptionEs: 'Ángel de la belleza que transforma pensamientos negativos en positivos.',
  },
  {
    id: 'arch-007',
    nameEs: 'Arcángel Zadkiel',
    nameEn: 'Archangel Zadkiel',
    power: 'Perdón y Memoria',
    colorHex: '#6366f1',
    descriptionEs: 'Ángel de la misericordia que ayuda a liberar el pasado con amor.',
  },
];

export const MOCK_SAFETY_SETTINGS = {
  canAccessCommunity: true,
  canPostInCommunity: false,
  canCommentOnPosts: true,
  canViewOtherProfiles: true,
  canParticipateInEvents: true,
  requiresApproval: true,
  contentFilterLevel: 'MODERATE' as const,
};

export const MOCK_AUTH_TOKEN = 'mock-jwt-token-dev-mode-12345';

export const MOCK_SUPERHERO_NAMES = [
  'Corazón Brillante',
  'Estrella Valiente',
  'Guardián del Amor',
  'Luz del Corazón',
  'Alma Radiante',
  'Héroe de Luz',
];

// Helper to simulate API delay
export const mockDelay = (ms: number = 500) =>
  new Promise(resolve => setTimeout(resolve, ms));
