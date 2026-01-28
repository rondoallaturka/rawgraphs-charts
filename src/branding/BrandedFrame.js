/**
 * BrandedFrame - A wrapper that adds branded elements around any chart
 *
 * This module provides functions to wrap chart SVGs with:
 * - Title (Lora font)
 * - Subtitle
 * - Country flag icon
 * - Sources
 * - Logo(s)
 * - Legend box
 */

import * as d3 from 'd3'
import '../d3-styles.js'

// Counter for generating unique IDs (avoids collisions with Math.random)
let clipIdCounter = 0

/**
 * Default branded frame configuration
 */
export const defaultFrameConfig = {
  // Dimensions
  width: 1080,
  height: 1080,

  // Padding around the chart area
  padding: {
    top: 140,      // Space for title + subtitle
    right: 40,
    bottom: 120,   // Space for sources + logos
    left: 40,
  },

  // Background
  background: '#FAF5F0',

  // Title configuration
  title: {
    text: '',
    x: 40,
    y: 50,
    maxWidth: 900,
    style: {
      fontFamily: "'Lora', Georgia, serif",
      fontSize: 42,
      fontWeight: 700,
      fill: '#1a3a5c',
    },
  },

  // Subtitle (optional)
  subtitle: {
    text: '',
    x: 40,
    y: 100,
    style: {
      fontFamily: "'Lexend Deca', 'Helvetica Neue', sans-serif",
      fontSize: 16,
      fontWeight: 400,
      fill: '#4a5568',
    },
  },

  // Flag/icon in corner
  flag: {
    show: false,
    url: '',       // URL to flag SVG/PNG
    x: null,       // null = auto position (right side)
    y: 40,
    width: 50,
    height: 50,
    borderRadius: 25, // For circular mask
  },

  // Sources section
  sources: {
    text: '',
    x: 40,
    y: null,       // null = auto position (bottom)
    style: {
      fontFamily: "'Lexend Deca', 'Helvetica Neue', sans-serif",
      fontSize: 12,
      fontWeight: 400,
      fill: '#718096',
    },
  },

  // Logo(s) at bottom
  logos: [],       // Array of { url, width, height, x, y }

  // Legend box configuration
  legend: {
    show: false,
    x: null,       // null = auto position
    y: null,
    width: 280,
    padding: 15,
    background: 'white',
    borderRadius: 4,
    border: '#e2e8f0',
    title: '',
    items: [],     // Array of { color, label }
  },
}

/**
 * Create a branded frame SVG element
 *
 * @param {Object} config - Frame configuration
 * @returns {SVGElement} - The created SVG element
 */
export function createBrandedFrame(config = {}) {
  const cfg = { ...defaultFrameConfig, ...config }

  // Create SVG element
  const svg = d3.create('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    .attr('width', cfg.width)
    .attr('height', cfg.height)
    .attr('viewBox', `0 0 ${cfg.width} ${cfg.height}`)

  // Add font import as style element
  svg.append('style')
    .text(`@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500;600&family=Lora:wght@400;500;600;700&display=swap');`)

  // Background
  svg.append('rect')
    .attr('id', 'frame-background')
    .attr('width', cfg.width)
    .attr('height', cfg.height)
    .attr('fill', cfg.background)

  // Title
  if (cfg.title.text) {
    const titleGroup = svg.append('g').attr('id', 'title-group')

    // Handle multi-line title (split on newlines)
    const titleLines = cfg.title.text.split('\n')
    const lineHeight = cfg.title.style.fontSize * 1.2

    titleLines.forEach((line, i) => {
      titleGroup.append('text')
        .attr('class', 'chart-title')
        .attr('x', cfg.title.x)
        .attr('y', cfg.title.y + (i * lineHeight))
        .style('font-family', cfg.title.style.fontFamily)
        .style('font-size', `${cfg.title.style.fontSize}px`)
        .style('font-weight', cfg.title.style.fontWeight)
        .style('fill', cfg.title.style.fill)
        .text(line)
    })
  }

  // Flag/icon
  if (cfg.flag.show && cfg.flag.url) {
    const flagX = cfg.flag.x !== null ? cfg.flag.x : cfg.width - cfg.padding.right - cfg.flag.width
    const flagGroup = svg.append('g')
      .attr('id', 'flag-group')
      .attr('transform', `translate(${flagX}, ${cfg.flag.y})`)

    // Create circular clip path if borderRadius is set
    if (cfg.flag.borderRadius) {
      const clipId = `flag-clip-${clipIdCounter++}`
      svg.append('defs')
        .append('clipPath')
        .attr('id', clipId)
        .append('circle')
        .attr('cx', cfg.flag.width / 2)
        .attr('cy', cfg.flag.height / 2)
        .attr('r', cfg.flag.borderRadius)

      flagGroup.append('image')
        .attr('xlink:href', cfg.flag.url)
        .attr('width', cfg.flag.width)
        .attr('height', cfg.flag.height)
        .attr('clip-path', `url(#${clipId})`)
    } else {
      flagGroup.append('image')
        .attr('xlink:href', cfg.flag.url)
        .attr('width', cfg.flag.width)
        .attr('height', cfg.flag.height)
    }
  }

  // Chart container group (where the actual chart will be placed)
  const chartY = cfg.padding.top
  const chartX = cfg.padding.left
  const chartWidth = cfg.width - cfg.padding.left - cfg.padding.right
  const chartHeight = cfg.height - cfg.padding.top - cfg.padding.bottom

  svg.append('g')
    .attr('id', 'chart-container')
    .attr('transform', `translate(${chartX}, ${chartY})`)
    .attr('data-width', chartWidth)
    .attr('data-height', chartHeight)

  // Legend box
  if (cfg.legend.show && cfg.legend.items.length > 0) {
    const legendX = cfg.legend.x !== null ? cfg.legend.x : cfg.width - cfg.padding.right - cfg.legend.width - 20
    const legendY = cfg.legend.y !== null ? cfg.legend.y : cfg.height - cfg.padding.bottom - 100

    const legendGroup = svg.append('g')
      .attr('id', 'legend-box')
      .attr('transform', `translate(${legendX}, ${legendY})`)

    // Calculate legend height based on content
    const itemHeight = 24
    const titleLineHeight = 18
    const titleLines = cfg.legend.title ? cfg.legend.title.split('\n') : []
    const titleHeight = titleLines.length > 0 ? (titleLines.length * titleLineHeight) + 10 : 0
    const legendHeight = cfg.legend.padding * 2 + titleHeight + (cfg.legend.items.length * itemHeight)

    // Background
    legendGroup.append('rect')
      .attr('width', cfg.legend.width)
      .attr('height', legendHeight)
      .attr('fill', cfg.legend.background)
      .attr('stroke', cfg.legend.border)
      .attr('stroke-width', 1)
      .attr('rx', cfg.legend.borderRadius)

    // Title (with multi-line support using tspan)
    if (cfg.legend.title) {
      const titleText = legendGroup.append('text')
        .attr('x', cfg.legend.padding)
        .attr('y', cfg.legend.padding + 14)
        .style('font-family', "'Lexend Deca', sans-serif")
        .style('font-size', '12px')
        .style('font-weight', 600)
        .style('fill', '#2d3748')

      titleLines.forEach((line, i) => {
        titleText.append('tspan')
          .attr('x', cfg.legend.padding)
          .attr('dy', i === 0 ? 0 : '1.4em')
          .text(line)
      })
    }

    // Legend items
    const itemsGroup = legendGroup.append('g')
      .attr('transform', `translate(${cfg.legend.padding}, ${cfg.legend.padding + titleHeight})`)

    cfg.legend.items.forEach((item, i) => {
      const itemG = itemsGroup.append('g')
        .attr('transform', `translate(0, ${i * itemHeight})`)

      // Color swatch
      itemG.append('rect')
        .attr('width', 30)
        .attr('height', 12)
        .attr('y', 2)
        .attr('fill', item.color)
        .attr('rx', 2)

      // Label
      itemG.append('text')
        .attr('x', 40)
        .attr('y', 12)
        .style('font-family', "'Lexend Deca', sans-serif")
        .style('font-size', '11px')
        .style('fill', '#4a5568')
        .text(item.label)
    })
  }

  // Sources
  if (cfg.sources.text) {
    const sourcesY = cfg.sources.y !== null ? cfg.sources.y : cfg.height - 50

    svg.append('text')
      .attr('id', 'sources-text')
      .attr('x', cfg.sources.x)
      .attr('y', sourcesY)
      .style('font-family', cfg.sources.style.fontFamily)
      .style('font-size', `${cfg.sources.style.fontSize}px`)
      .style('font-weight', cfg.sources.style.fontWeight)
      .style('fill', cfg.sources.style.fill)
      .text(cfg.sources.text)
  }

  // Logos
  if (cfg.logos.length > 0) {
    const logosGroup = svg.append('g').attr('id', 'logos-group')

    cfg.logos.forEach((logo, i) => {
      const logoX = logo.x !== null ? logo.x : cfg.width - cfg.padding.right - logo.width
      const logoY = logo.y !== null ? logo.y : cfg.height - 45

      logosGroup.append('image')
        .attr('xlink:href', logo.url)
        .attr('x', logoX)
        .attr('y', logoY)
        .attr('width', logo.width)
        .attr('height', logo.height || 'auto')
    })
  }

  return svg.node()
}

/**
 * Wrap an existing chart SVG with a branded frame
 *
 * @param {SVGElement|string} chartSvg - The chart SVG element or string
 * @param {Object} config - Frame configuration
 * @returns {SVGElement} - The combined SVG
 */
export function wrapChartWithFrame(chartSvg, config = {}) {
  const frame = createBrandedFrame(config)
  const frameD3 = d3.select(frame)

  // Find the chart container
  const container = frameD3.select('#chart-container')
  const chartWidth = parseInt(container.attr('data-width'))
  const chartHeight = parseInt(container.attr('data-height'))

  // If chartSvg is a string, parse it
  let chartNode = chartSvg
  if (typeof chartSvg === 'string') {
    const parser = new DOMParser()
    const doc = parser.parseFromString(chartSvg, 'image/svg+xml')
    chartNode = doc.documentElement
  }

  // Clone the chart content and append to container
  const chartContent = d3.select(chartNode).selectAll('*').nodes()

  // Get original chart dimensions for scaling
  const originalWidth = parseFloat(d3.select(chartNode).attr('width')) || chartWidth
  const originalHeight = parseFloat(d3.select(chartNode).attr('height')) || chartHeight

  // Calculate scale to fit
  const scaleX = chartWidth / originalWidth
  const scaleY = chartHeight / originalHeight
  const scale = Math.min(scaleX, scaleY)

  // Create a group for the chart with scaling
  const chartGroup = container.append('g')
    .attr('id', 'chart-content')
    .attr('transform', `scale(${scale})`)

  // Import all children from the original chart
  chartContent.forEach(node => {
    chartGroup.node().appendChild(node.cloneNode(true))
  })

  return frame
}

/**
 * Render a chart with branded frame directly to an SVG node
 *
 * @param {SVGElement} svgNode - Target SVG node
 * @param {Function} renderChart - Chart render function
 * @param {Object} chartData - Data for the chart
 * @param {Object} chartOptions - Visual options for the chart
 * @param {Object} frameConfig - Frame configuration
 */
export function renderBrandedChart(svgNode, renderChart, chartData, chartOptions, frameConfig = {}) {
  const cfg = { ...defaultFrameConfig, ...frameConfig }

  // Calculate chart dimensions
  const chartWidth = cfg.width - cfg.padding.left - cfg.padding.right
  const chartHeight = cfg.height - cfg.padding.top - cfg.padding.bottom

  // Modify chart options to fit within frame
  const adjustedOptions = {
    ...chartOptions,
    width: chartWidth,
    height: chartHeight,
    background: 'transparent', // Use frame background
  }

  // First, render the frame elements to the target SVG
  const frameElements = createBrandedFrame(cfg)

  // Copy frame content to target
  while (frameElements.firstChild) {
    svgNode.appendChild(frameElements.firstChild)
  }

  // Set SVG attributes
  d3.select(svgNode)
    .attr('width', cfg.width)
    .attr('height', cfg.height)
    .attr('viewBox', `0 0 ${cfg.width} ${cfg.height}`)

  // Find chart container and render chart into it
  const chartContainer = d3.select(svgNode).select('#chart-container').node()

  // Create a temporary SVG for chart rendering
  const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  renderChart(tempSvg, chartData, adjustedOptions)

  // Move chart content to container
  while (tempSvg.firstChild) {
    chartContainer.appendChild(tempSvg.firstChild)
  }
}

export default {
  createBrandedFrame,
  wrapChartWithFrame,
  renderBrandedChart,
  defaultFrameConfig,
}
