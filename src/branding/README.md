# RAWGraphs Branding Module

This module provides tools for creating **branded chart output** with consistent styling, typography, colors, and framing elements.

## Features

- **Theme Configuration**: Define brand colors, fonts, spacing, and styling in a single configuration object
- **Branded Frame**: Wrap charts with title, subtitle, sources, logos, and legend
- **Custom Typography**: Support for Google Fonts (Lora, Lexend Deca, etc.)
- **Color Scales**: Generate D3-compatible color scales from brand palettes
- **SVG Output**: Clean, exportable SVG with embedded fonts

## Quick Start

```javascript
import {
  latinometricsTheme,
  createBrandedFrame,
  generateStyles
} from '@rawgraphs/rawgraphs-charts/branding'
import { barchart } from '@rawgraphs/rawgraphs-charts'

// 1. Configure the branded frame
const frameConfig = {
  width: 1080,
  height: 1080,
  background: '#FAF5F0',

  title: {
    text: 'Your Chart Title',
    style: {
      fontFamily: "'Lora', serif",
      fontSize: 42,
      fontWeight: 700,
      fill: '#1a3a5c',
    },
  },

  sources: {
    text: 'Source: Your Data Source',
  },

  legend: {
    show: true,
    items: [
      { color: '#3D7BB9', label: 'Category A' },
      { color: '#E8A838', label: 'Category B' },
    ],
  },
}

// 2. Create the branded frame
const frame = createBrandedFrame(frameConfig)

// 3. Get the chart container and render your chart
const chartContainer = frame.querySelector('#chart-container')
// ... render chart into container
```

## Theme Configuration

A theme defines all visual properties for your brand:

```javascript
const myBrandTheme = {
  name: 'my-brand',

  // Typography
  fonts: {
    title: {
      family: "'Lora', Georgia, serif",
      weight: 700,
      size: 42,
      color: '#1a3a5c',
    },
    body: {
      family: "'Lexend Deca', sans-serif",
      weight: 400,
      size: 12,
      color: '#4a5568',
    },
    // ... more font definitions
  },

  // Colors
  colors: {
    primary: '#3D7BB9',
    accent: '#E8A838',
    background: '#FAF5F0',
    text: '#1a3a5c',
    // ... more colors
    series: ['#3D7BB9', '#E8A838', '#5a9bd4', '#f0c060'],
  },

  // Strokes/Lines
  strokes: {
    axis: { width: 1, color: '#cbd5e0' },
    gridLine: { width: 0.5, color: '#e2e8f0', dashArray: '2,2' },
  },

  // Layout
  layout: {
    framePadding: { top: 140, right: 40, bottom: 100, left: 40 },
    chartMargins: { top: 20, right: 20, bottom: 40, left: 60 },
  },
}
```

## Frame Configuration

The `createBrandedFrame()` function accepts these options:

| Option | Type | Description |
|--------|------|-------------|
| `width` | number | SVG width (default: 1080) |
| `height` | number | SVG height (default: 1080) |
| `padding` | object | Space around chart: `{ top, right, bottom, left }` |
| `background` | string | Background color |
| `title` | object | Title text and styling |
| `subtitle` | object | Subtitle text and styling |
| `flag` | object | Country flag/icon configuration |
| `sources` | object | Source text at bottom |
| `logos` | array | Logo images to display |
| `legend` | object | Legend box configuration |

### Title Configuration

```javascript
title: {
  text: 'Multi-line titles\nare supported',
  x: 40,
  y: 50,
  style: {
    fontFamily: "'Lora', serif",
    fontSize: 42,
    fontWeight: 700,
    fill: '#1a3a5c',
  },
}
```

### Legend Configuration

```javascript
legend: {
  show: true,
  x: 700,        // null for auto-position
  y: 600,
  width: 280,
  padding: 15,
  background: 'white',
  borderRadius: 4,
  border: '#e2e8f0',
  title: 'Legend Title',
  items: [
    { color: '#3D7BB9', label: 'Category A' },
    { color: '#E8A838', label: 'Category B' },
  ],
}
```

## Generating Styles

Convert a theme to CSS-in-JS styles for D3:

```javascript
const styles = generateStyles(myBrandTheme)

// Use with D3 selections
svg.append('text')
  .text('Label')
  .styles(styles.axisLabel)
```

## Included Themes

### Latinometrics Theme

A professional theme inspired by Latinometrics/Siemens data visualizations:

- **Title Font**: Lora (serif)
- **Body Font**: Lexend Deca (sans-serif)
- **Primary Color**: #3D7BB9 (blue)
- **Accent Color**: #E8A838 (orange)
- **Background**: #FAF5F0 (cream)

```javascript
import { latinometricsTheme } from '@rawgraphs/rawgraphs-charts/branding'
```

## Exporting Charts

### SVG Export

```javascript
const svg = createBrandedFrame(config)
const serializer = new XMLSerializer()
const svgString = serializer.serializeToString(svg)

// Download
const blob = new Blob([svgString], { type: 'image/svg+xml' })
const url = URL.createObjectURL(blob)
// ... trigger download
```

### PNG Export

Use Canvas API to convert SVG to PNG:

```javascript
const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 1080 * 2  // 2x for retina
canvas.height = 1080 * 2
ctx.scale(2, 2)

const img = new Image()
img.onload = () => {
  ctx.drawImage(img, 0, 0)
  canvas.toBlob(blob => {
    // ... download blob as PNG
  }, 'image/png')
}
img.src = svgDataUrl
```

## Font Loading

For branded fonts to render correctly, include the Google Fonts import:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500;600&family=Lora:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Or embed in SVG:

```javascript
svg.append('style')
  .text("@import url('https://fonts.googleapis.com/css2?family=...');")
```

## File Structure

```
src/branding/
├── index.js                    # Main exports
├── BrandedFrame.js             # Frame wrapper utilities
├── README.md                   # This file
├── themes/
│   └── latinometrics.js        # Latinometrics theme
└── styles/
    └── branded.raw.css         # Base branded styles
```

## Example

See `example/branded-chart-demo.html` for a complete working example.
