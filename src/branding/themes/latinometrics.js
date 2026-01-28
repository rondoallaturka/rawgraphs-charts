/**
 * Latinometrics Brand Theme
 *
 * This theme configuration defines all visual properties for branded chart output.
 * Fonts: Lora (title), Lexend Deca (body)
 * Colors: Blue primary, Orange accent
 */

export const latinometricsTheme = {
  // Theme metadata
  name: 'latinometrics',
  displayName: 'Latinometrics + Siemens',

  // Typography
  fonts: {
    title: {
      family: "'Lora', Georgia, serif",
      weight: 700,
      size: 42,
      lineHeight: 1.2,
      color: '#1a3a5c',
    },
    subtitle: {
      family: "'Lexend Deca', 'Helvetica Neue', sans-serif",
      weight: 400,
      size: 16,
      lineHeight: 1.4,
      color: '#4a5568',
    },
    axisLabel: {
      family: "'Lexend Deca', 'Helvetica Neue', sans-serif",
      weight: 500,
      size: 11,
      color: '#2d3748',
    },
    tickLabel: {
      family: "'Lexend Deca', 'Helvetica Neue', sans-serif",
      weight: 400,
      size: 10,
      color: '#4a5568',
    },
    dataLabel: {
      family: "'Lexend Deca', 'Helvetica Neue', sans-serif",
      weight: 500,
      size: 10,
      color: '#2d3748',
    },
    legend: {
      family: "'Lexend Deca', 'Helvetica Neue', sans-serif",
      weight: 400,
      size: 11,
      color: '#4a5568',
    },
    source: {
      family: "'Lexend Deca', 'Helvetica Neue', sans-serif",
      weight: 400,
      size: 12,
      color: '#718096',
    },
  },

  // Color palette
  colors: {
    // Primary brand colors
    primary: '#3D7BB9',      // Main blue
    primaryDark: '#2c5a8a',  // Darker blue for contrast
    primaryLight: '#5a9bd4', // Lighter blue

    // Accent colors
    accent: '#E8A838',       // Orange/yellow for highlights
    accentLight: '#f0c060',

    // Semantic colors
    background: '#FAF5F0',   // Warm cream background
    chartBackground: '#FAF5F0',
    text: '#1a3a5c',
    textMuted: '#718096',

    // Chart-specific
    gridLines: '#e2e8f0',
    axisLines: '#cbd5e0',

    // Data series colors (for categorical data)
    series: [
      '#3D7BB9',  // Blue
      '#E8A838',  // Orange
      '#5a9bd4',  // Light blue
      '#f0c060',  // Light orange
      '#2c5a8a',  // Dark blue
      '#c88c2c',  // Dark orange
    ],

    // Comparison colors (for small/large company comparison)
    comparison: {
      small: '#3D7BB9',      // Blue - smaller companies
      large: '#E8A838',      // Orange - larger companies
      average: '#E8A838',    // Orange for EU average highlight
    },
  },

  // Stroke/line styling
  strokes: {
    axis: {
      width: 1,
      color: '#cbd5e0',
    },
    gridLine: {
      width: 0.5,
      color: '#e2e8f0',
      dashArray: '2,2',
    },
    bar: {
      width: 0,
      color: 'none',
    },
    line: {
      width: 2,
      color: 'inherit',
    },
  },

  // Spacing and layout
  layout: {
    // Frame padding
    framePadding: {
      top: 120,      // Space for title
      right: 40,
      bottom: 100,   // Space for sources
      left: 40,
    },
    // Chart margins within frame
    chartMargins: {
      top: 20,
      right: 20,
      bottom: 40,
      left: 60,
    },
    // Bar chart specific
    barPadding: 0.3,
    barRadius: 0,
  },

  // Logo and branding
  branding: {
    logo: {
      position: 'bottom-right',
      width: 200,
      height: 30,
    },
    flag: {
      show: true,
      position: 'top-right',
      size: 50,
    },
  },

  // Legend styling
  legend: {
    position: 'bottom-right',
    padding: 15,
    itemSpacing: 8,
    symbolSize: 12,
    background: 'white',
    borderRadius: 4,
    border: '1px solid #e2e8f0',
  },

  // Google Fonts import URL
  fontsUrl: 'https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500;600&family=Lora:wght@400;500;600;700&display=swap',
}

// Color scale generator for D3
export function createBrandedColorScale(theme, dimension = 'ordinal') {
  const colors = theme.colors.series

  return {
    scaleType: 'ordinal',
    interpolator: 'customOrdinal',
    customColors: colors,
  }
}

// Generate CSS-in-JS styles from theme
export function generateStyles(theme) {
  return {
    axisLabel: {
      fontFamily: theme.fonts.axisLabel.family,
      fontSize: theme.fonts.axisLabel.size,
      fontWeight: theme.fonts.axisLabel.weight,
      fill: theme.fonts.axisLabel.color,
    },
    tickLabel: {
      fontFamily: theme.fonts.tickLabel.family,
      fontSize: theme.fonts.tickLabel.size,
      fontWeight: theme.fonts.tickLabel.weight,
      fill: theme.fonts.tickLabel.color,
    },
    labelPrimary: {
      fontFamily: theme.fonts.dataLabel.family,
      fontSize: theme.fonts.dataLabel.size,
      fontWeight: theme.fonts.dataLabel.weight,
      fill: theme.fonts.dataLabel.color,
    },
    labelSecondary: {
      fontFamily: theme.fonts.tickLabel.family,
      fontSize: theme.fonts.tickLabel.size,
      fontWeight: theme.fonts.tickLabel.weight,
      fill: theme.fonts.tickLabel.color,
    },
    seriesLabel: {
      fontFamily: theme.fonts.subtitle.family,
      fontSize: theme.fonts.subtitle.size,
      fontWeight: 600,
      fill: theme.fonts.subtitle.color,
      dominantBaseline: 'hanging',
    },
    title: {
      fontFamily: theme.fonts.title.family,
      fontSize: theme.fonts.title.size,
      fontWeight: theme.fonts.title.weight,
      fill: theme.fonts.title.color,
    },
    subtitle: {
      fontFamily: theme.fonts.subtitle.family,
      fontSize: theme.fonts.subtitle.size,
      fontWeight: theme.fonts.subtitle.weight,
      fill: theme.fonts.subtitle.color,
    },
    source: {
      fontFamily: theme.fonts.source.family,
      fontSize: theme.fonts.source.size,
      fontWeight: theme.fonts.source.weight,
      fill: theme.fonts.source.color,
    },
    axisLine: {
      stroke: theme.strokes.axis.color,
      strokeWidth: theme.strokes.axis.width,
    },
    gridLine: {
      stroke: theme.strokes.gridLine.color,
      strokeWidth: theme.strokes.gridLine.width,
      strokeDasharray: theme.strokes.gridLine.dashArray,
    },
  }
}

export default latinometricsTheme
