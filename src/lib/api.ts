/**
 * API Service Layer
 * Handles all communication with the backend API
 * Supports Dev Mode with mock data for testing
 */

import {
  MOCK_PARENT,
  MOCK_CHILDREN,
  MOCK_NOTIFICATIONS,
  MOCK_ARCHANGELS,
  MOCK_SAFETY_SETTINGS,
  MOCK_AUTH_TOKEN,
  mockDelay,
} from './mock-data';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

interface ApiError {
  error: string;
  details?: any;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface Child {
  id: string;
  name: string;
  superheroName: string;
  age: number;
  luzPoints: number;
  rank: 'INICIADO' | 'VALIENTE' | 'SABIO' | 'MAESTRO';
  initiationCompleted: boolean;
  requiresParentAssistance: boolean;
  secretCode?: string;
  archangel: {
    nameEs: string;
    colorHex: string;
  };
  createdAt?: string;
}

interface Notification {
  id: string;
  type: string;
  titleEs: string;
  messageEs: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  childName?: string;
}

/**
 * Generic API request handler
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string> || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }

  return data;
}

/**
 * Authentication API
 */
export const authApi = {
  /**
   * Register a new parent account
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    if (DEV_MODE) {
      await mockDelay();
      return {
        token: MOCK_AUTH_TOKEN,
        user: MOCK_PARENT,
      };
    }
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        fullName: data.name,
        email: data.email,
        password: data.password
      }),
    });
  },

  /**
   * Login as parent
   */
  async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    if (DEV_MODE) {
      await mockDelay();
      return {
        token: MOCK_AUTH_TOKEN,
        user: MOCK_PARENT,
      };
    }
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Login as child with secret code
   */
  async loginChild(data: {
    secretCode: string;
  }): Promise<AuthResponse> {
    if (DEV_MODE) {
      await mockDelay();
      // Find child with matching secret code
      const child = MOCK_CHILDREN.find(c => c.secretCode === data.secretCode);
      if (!child) {
        throw new Error('Código secreto inválido');
      }
      return {
        token: MOCK_AUTH_TOKEN,
        user: {
          id: child.id,
          email: '',
          name: child.superheroName,
          role: 'CHILD',
        },
      };
    }
    return apiRequest<AuthResponse>('/auth/child-login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<AuthResponse['user']> {
    if (DEV_MODE) {
      await mockDelay(200);
      return MOCK_PARENT;
    }
    return apiRequest<AuthResponse['user']>('/auth/me');
  },

  /**
   * Verify token validity
   */
  async verifyToken(): Promise<{ valid: boolean }> {
    if (DEV_MODE) {
      await mockDelay(100);
      return { valid: true };
    }
    return apiRequest<{ valid: boolean }>('/auth/verify-token');
  },

  /**
   * Store auth token
   */
  storeToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  /**
   * Remove auth token
   */
  removeToken() {
    localStorage.removeItem('auth_token');
  },

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },
};

/**
 * Children API
 */
export const childrenApi = {
  /**
   * Get all children for logged-in parent
   */
  async getAll(): Promise<Child[]> {
    if (DEV_MODE) {
      await mockDelay(300);
      return MOCK_CHILDREN;
    }
    return apiRequest<Child[]>('/children');
  },

  /**
   * Get specific child by ID
   */
  async getById(id: string): Promise<Child> {
    if (DEV_MODE) {
      await mockDelay(300);
      const child = MOCK_CHILDREN.find(c => c.id === id);
      if (!child) {
        throw new Error('Niño no encontrado');
      }
      return child;
    }
    return apiRequest<Child>(`/children/${id}`);
  },

  /**
   * Create a new child
   */
  async create(data: {
    name: string;
    age: number;
  }): Promise<Child> {
    if (DEV_MODE) {
      await mockDelay(500);
      // In dev mode, just return a new mock child
      return {
        id: `child-mock-${Date.now()}`,
        name: data.name,
        superheroName: '',
        age: data.age,
        luzPoints: 0,
        rank: 'INICIADO',
        initiationCompleted: false,
        requiresParentAssistance: data.age < 10,
        secretCode: `CODE${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        archangel: {
          nameEs: '',
          colorHex: '#3b82f6',
        },
        createdAt: new Date().toISOString(),
      };
    }
    return apiRequest<Child>('/children', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update child details
   */
  async update(id: string, data: Partial<Child>): Promise<Child> {
    if (DEV_MODE) {
      await mockDelay(400);
      const child = MOCK_CHILDREN.find(c => c.id === id);
      if (!child) {
        throw new Error('Niño no encontrado');
      }
      return { ...child, ...data };
    }
    return apiRequest<Child>(`/children/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a child
   */
  async delete(id: string): Promise<void> {
    if (DEV_MODE) {
      await mockDelay(300);
      return;
    }
    return apiRequest<void>(`/children/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Notifications API
 */
export const notificationsApi = {
  /**
   * Get unread notifications
   */
  async getUnread(): Promise<Notification[]> {
    if (DEV_MODE) {
      await mockDelay(200);
      return MOCK_NOTIFICATIONS.filter(n => !n.isRead);
    }
    return apiRequest<Notification[]>('/notifications/unread');
  },

  /**
   * Get all notifications with pagination
   */
  async getAll(page: number = 1, limit: number = 20): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    if (DEV_MODE) {
      await mockDelay(300);
      return {
        notifications: MOCK_NOTIFICATIONS,
        total: MOCK_NOTIFICATIONS.length,
        page: 1,
        totalPages: 1,
      };
    }
    return apiRequest(`/notifications?page=${page}&limit=${limit}`);
  },

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<void> {
    if (DEV_MODE) {
      await mockDelay(150);
      // In dev mode, just simulate success
      return;
    }
    return apiRequest<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    if (DEV_MODE) {
      await mockDelay(200);
      return;
    }
    return apiRequest<void>('/notifications/read-all', {
      method: 'PUT',
    });
  },
};

/**
 * Safety API
 */
export const safetyApi = {
  /**
   * Get safety settings for a child
   */
  async getSettings(childId: string): Promise<any> {
    if (DEV_MODE) {
      await mockDelay(250);
      return MOCK_SAFETY_SETTINGS;
    }
    return apiRequest(`/safety/${childId}`);
  },

  /**
   * Update safety settings
   */
  async updateSettings(childId: string, settings: any): Promise<any> {
    if (DEV_MODE) {
      await mockDelay(400);
      return { ...MOCK_SAFETY_SETTINGS, ...settings };
    }
    return apiRequest(`/safety/${childId}`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  /**
   * Reset to age-appropriate defaults
   */
  async resetToDefaults(childId: string): Promise<any> {
    if (DEV_MODE) {
      await mockDelay(300);
      return MOCK_SAFETY_SETTINGS;
    }
    return apiRequest(`/safety/${childId}/reset`, {
      method: 'POST',
    });
  },
};

/**
 * Dashboard Stats API
 */
export const dashboardApi = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<{
    totalChildren: number;
    totalLuzPoints: number;
    completedChallenges: number;
    unreadNotifications: number;
  }> {
    // This will be a custom endpoint or aggregated from multiple calls
    const [children, notifications] = await Promise.all([
      childrenApi.getAll(),
      notificationsApi.getUnread(),
    ]);

    return {
      totalChildren: children.length,
      totalLuzPoints: children.reduce((sum, child) => sum + child.luzPoints, 0),
      completedChallenges: 0, // TODO: Implement when challenge API is ready
      unreadNotifications: notifications.length,
    };
  },

  /**
   * Get recent activity
   */
  async getRecentActivity(): Promise<any[]> {
    // TODO: Implement when activity endpoint is ready
    return [];
  },
};

/**
 * Archangels API
 */
export const archangelsApi = {
  /**
   * Get all archangels
   */
  async getAll(): Promise<any[]> {
    if (DEV_MODE) {
      await mockDelay(250);
      return MOCK_ARCHANGELS;
    }
    return apiRequest('/archangels');
  },

  /**
   * Get specific archangel by ID
   */
  async getById(id: string): Promise<any> {
    if (DEV_MODE) {
      await mockDelay(200);
      const archangel = MOCK_ARCHANGELS.find(a => a.id === id);
      if (!archangel) {
        throw new Error('Arcángel no encontrado');
      }
      return archangel;
    }
    return apiRequest(`/archangels/${id}`);
  },
};

/**
 * Onboarding API
 */
export const onboardingApi = {
  /**
   * Generate superhero name suggestions
   */
  async generateSuperheroName(data: {
    realName: string;
    favoriteColor?: string;
    favoriteAnimal?: string;
  }): Promise<{ suggestions: string[] }> {
    if (DEV_MODE) {
      await mockDelay(600);
      // Generate some creative suggestions based on the real name
      const baseName = data.realName;
      return {
        suggestions: [
          `${baseName} el Valiente`,
          `Corazón de ${baseName}`,
          `${baseName} de Luz`,
          `Guardián ${baseName}`,
          `${baseName} Luminoso`,
        ],
      };
    }
    return apiRequest('/onboarding/generate-name', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Complete onboarding ceremony
   */
  async completeOnboarding(data: {
    secretCode: string;
    superheroName: string;
    archangelId: string;
  }): Promise<any> {
    if (DEV_MODE) {
      await mockDelay(800);
      const child = MOCK_CHILDREN.find(c => c.secretCode === data.secretCode);
      if (!child) {
        throw new Error('Código secreto inválido');
      }
      const archangel = MOCK_ARCHANGELS.find(a => a.id === data.archangelId);
      return {
        success: true,
        child: {
          ...child,
          superheroName: data.superheroName,
          archangel: archangel ? {
            nameEs: archangel.nameEs,
            colorHex: archangel.colorHex,
          } : child.archangel,
          initiationCompleted: true,
          luzPoints: child.luzPoints + 100, // Award initiation points
        },
        message: '¡Ceremonia completada con éxito!',
      };
    }
    return apiRequest('/onboarding/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Missions API
 */
export const missionsApi = {
  /**
   * Get current month's mission
   */
  async getCurrentMission(): Promise<any> {
    return apiRequest('/missions/current');
  },

  /**
   * Get specific mission by year/month
   */
  async getMission(year: number, month: number): Promise<any> {
    return apiRequest(`/missions/${year}/${month}`);
  },

  /**
   * Get child's mission progress
   */
  async getChildProgress(childId: string): Promise<any> {
    return apiRequest(`/missions/child/${childId}/progress`);
  },

  /**
   * Start mission for a child
   */
  async startMission(childId: string, missionId: string): Promise<any> {
    return apiRequest(`/missions/child/${childId}/start`, {
      method: 'POST',
      body: JSON.stringify({ missionId }),
    });
  },

  /**
   * List all missions (paginated)
   */
  async listAll(page: number = 1, limit: number = 12): Promise<any> {
    return apiRequest(`/missions?page=${page}&limit=${limit}`);
  },
};

/**
 * Challenges API
 */
export const challengesApi = {
  /**
   * Get challenges for a mission
   */
  async getForMission(missionId: string): Promise<any[]> {
    return apiRequest(`/challenges/mission/${missionId}`);
  },

  /**
   * Get specific challenge
   */
  async getById(challengeId: string): Promise<any> {
    return apiRequest(`/challenges/${challengeId}`);
  },

  /**
   * Submit challenge proof
   */
  async submit(challengeId: string, data: {
    childId: string;
    proofUrls: string[];
    proofType: 'photo' | 'video' | 'audio';
  }): Promise<any> {
    return apiRequest(`/challenges/${challengeId}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get child's submissions
   */
  async getChildSubmissions(childId: string): Promise<any[]> {
    return apiRequest(`/challenges/child/${childId}/submissions`);
  },

  /**
   * Review submission (approve/reject)
   */
  async reviewSubmission(submissionId: string, data: {
    status: 'APPROVED' | 'REJECTED';
    reviewNotes?: string;
  }): Promise<any> {
    return apiRequest(`/challenges/submission/${submissionId}/review`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Rewards API
 */
export const rewardsApi = {
  /**
   * Get all rewards (with filters)
   */
  async getAll(filters?: {
    type?: string;
    rarity?: string;
  }): Promise<any[]> {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.rarity) params.append('rarity', filters.rarity);

    const query = params.toString();
    return apiRequest(`/rewards${query ? `?${query}` : ''}`);
  },

  /**
   * Get specific reward
   */
  async getById(rewardId: string): Promise<any> {
    return apiRequest(`/rewards/${rewardId}`);
  },

  /**
   * Get child's earned rewards
   */
  async getChildRewards(childId: string): Promise<any[]> {
    return apiRequest(`/rewards/child/${childId}`);
  },

  /**
   * Redeem reward for child
   */
  async redeem(rewardId: string, data: {
    childId: string;
    shippingAddress?: string;
  }): Promise<any> {
    return apiRequest(`/rewards/${rewardId}/redeem`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get available rewards for child (considering points)
   */
  async getAvailableForChild(childId: string): Promise<any[]> {
    return apiRequest(`/rewards/child/${childId}/available`);
  },
};
