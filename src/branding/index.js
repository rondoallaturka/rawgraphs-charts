/**
 * RAWGraphs Branding Module
 *
 * This module provides tools for creating branded chart output with:
 * - Theme configurations (fonts, colors, spacing)
 * - Branded frame wrappers (title, sources, logos)
 * - Styled chart components
 *
 * Example usage:
 *
 * ```javascript
 * import { latinometricsTheme, createBrandedFrame, generateStyles } from '@rawgraphs/rawgraphs-charts/branding'
 * import { barchart } from '@rawgraphs/rawgraphs-charts'
 *
 * // Create a branded chart
 * const frameConfig = {
 *   title: { text: 'Sectores manufactureros\nimpulsando la IA en México' },
 *   sources: { text: 'Fuentes: INEGI, Eurostat' },
 *   flag: { show: true, url: 'mexico-flag.svg' },
 *   ...latinometricsTheme.layout,
 * }
 *
 * const frame = createBrandedFrame(frameConfig)
 * ```
 */

// Theme configurations
export { default as latinometricsTheme, generateStyles, createBrandedColorScale } from './themes/latinometrics.js'

// Frame utilities
export {
  createBrandedFrame,
  wrapChartWithFrame,
  renderBrandedChart,
  defaultFrameConfig,
} from './BrandedFrame.js'

// Re-export for convenience
export { default as BrandedFrame } from './BrandedFrame.js'
