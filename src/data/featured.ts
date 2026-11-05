/**
 * Kinetic Studio featured set — curated shortlist for the homepage.
 * Archive = everything else in projects.ts.
 */
export const FEATURED_PROJECT_TITLES = [
  'FirstPR',
  'NekoDroid',
  'NekoBeat',
  'NMHelper',
  'Otazumi',
  'Handoff',
] as const;

export type FeaturedTitle = (typeof FEATURED_PROJECT_TITLES)[number];
