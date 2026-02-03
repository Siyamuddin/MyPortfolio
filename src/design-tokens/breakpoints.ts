/**
 * Breakpoint Design Tokens
 * Responsive design breakpoints
 */

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  
  // Max width queries
  maxXs: `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  maxSm: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  maxMd: `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  maxLg: `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
  maxXl: `@media (max-width: ${parseInt(breakpoints['2xl']) - 1}px)`,
} as const;

export type BreakpointToken = typeof breakpoints;
