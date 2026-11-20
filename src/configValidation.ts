import type { LayoutConfig } from './types';

const knownSectionTypes = new Set([
  'hero_banner', 'category_chips', 'quick_actions', 'service_grid', 'doctor_carousel', 'offer_strip'
]);

export function isKnownSectionType(type: string): boolean {
  return knownSectionTypes.has(type);
}

export function validateLayoutConfig(value: unknown): LayoutConfig {
  if (!value || typeof value !== 'object') throw new Error('Config must be an object.');
  const candidate = value as Partial<LayoutConfig>;
  if (typeof candidate.version !== 'number' || !candidate.theme || !Array.isArray(candidate.tabs) || !Array.isArray(candidate.sections)) {
    throw new Error('Config is missing version, theme, tabs, or sections.');
  }
  const theme = candidate.theme as Record<string, unknown>;
  const themeKeys = ['primary', 'secondary', 'background', 'surface', 'textPrimary', 'textSecondary', 'accent'];
  if (themeKeys.some(key => typeof theme[key] !== 'string')) throw new Error('Config theme has invalid colors.');
  const validScreens = new Set(['home', 'bookings', 'prescriptions', 'profile']);
  if (candidate.tabs.some(tab => !tab || typeof tab.id !== 'string' || typeof tab.label !== 'string' || !validScreens.has(tab.screen))) {
    throw new Error('Config contains an invalid tab.');
  }
  if (candidate.sections.some(section => !section || typeof section.id !== 'string' || typeof section.type !== 'string' ||
    !section.background || !['color', 'gradient', 'image'].includes(section.background.kind) ||
    typeof section.background.value !== 'string' || !Array.isArray(section.items))) {
    throw new Error('Config contains an invalid section.');
  }
  return candidate as LayoutConfig;
}
