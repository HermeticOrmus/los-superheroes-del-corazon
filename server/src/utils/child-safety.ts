/**
 * Child Safety & Age-Appropriate Settings
 * Determines default safety settings based on child's age
 */

export interface SafetySettings {
  requiresParentAssistance: boolean;
  canBrowseCommunity: boolean;
  canPostToCommunity: boolean;
  canViewGlobalMap: boolean;
}

/**
 * Get age-appropriate default safety settings
 *
 * Age Guidelines:
 * - 0-6 years: Full parent assistance required, no community access
 * - 7-9 years: Parent assistance recommended, can view community with restrictions
 * - 10-12 years: Optional parent assistance, can post to moderated community
 * - 13+ years: Independent use, full community access (still moderated)
 */
export function getAgeSafetyDefaults(age: number): SafetySettings {
  // Very young children (0-6) - Full supervision
  if (age <= 6) {
    return {
      requiresParentAssistance: true,
      canBrowseCommunity: false,
      canPostToCommunity: false,
      canViewGlobalMap: true // Read-only world map is safe
    };
  }

  // Young children (7-9) - High supervision
  if (age <= 9) {
    return {
      requiresParentAssistance: true,
      canBrowseCommunity: true,  // Can see others' achievements
      canPostToCommunity: false, // Cannot post yet
      canViewGlobalMap: true
    };
  }

  // Pre-teens (10-12) - Moderate supervision
  if (age <= 12) {
    return {
      requiresParentAssistance: false, // Can navigate independently
      canBrowseCommunity: true,
      canPostToCommunity: true, // Can share with moderation
      canViewGlobalMap: true
    };
  }

  // Teens (13+) - Light supervision
  return {
    requiresParentAssistance: false,
    canBrowseCommunity: true,
    canPostToCommunity: true,
    canViewGlobalMap: true
  };
}

/**
 * Get user-friendly description of assistance mode
 */
export function getAssistanceModeDescription(age: number, language: 'es' | 'en' = 'es'): string {
  const mode = getAgeSafetyDefaults(age);

  if (language === 'es') {
    if (age <= 6) {
      return '🔒 Modo Súper Seguro - Requiere asistencia de padres para todas las actividades';
    }
    if (age <= 9) {
      return '🛡️ Modo Seguro - Puede explorar con supervisión parental';
    }
    if (age <= 12) {
      return '⚡ Modo Independiente - Puede usar la app de forma segura';
    }
    return '🌟 Modo Completo - Acceso a todas las funciones de forma segura';
  } else {
    if (age <= 6) {
      return '🔒 Super Safe Mode - Requires parent assistance for all activities';
    }
    if (age <= 9) {
      return '🛡️ Safe Mode - Can explore with parental supervision';
    }
    if (age <= 12) {
      return '⚡ Independent Mode - Can use app safely on their own';
    }
    return '🌟 Full Mode - Access to all features safely';
  }
}

/**
 * Validate safety settings change request
 * Parents can make settings MORE restrictive for any age,
 * but cannot make them LESS restrictive than age-appropriate defaults
 */
export function validateSafetyOverride(
  age: number,
  requestedSettings: Partial<SafetySettings>
): { valid: boolean; errors: string[] } {
  const defaults = getAgeSafetyDefaults(age);
  const errors: string[] = [];

  // Check each setting - can only make MORE restrictive, not less
  if (requestedSettings.requiresParentAssistance === false && defaults.requiresParentAssistance === true) {
    errors.push('Cannot disable parent assistance for this age group');
  }

  if (requestedSettings.canBrowseCommunity === true && defaults.canBrowseCommunity === false) {
    errors.push('Community browsing not available for this age group');
  }

  if (requestedSettings.canPostToCommunity === true && defaults.canPostToCommunity === false) {
    errors.push('Community posting not available for this age group');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
