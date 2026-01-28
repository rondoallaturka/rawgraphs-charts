/**
 * Generate a preview SVG of the branded chart using server-side rendering
 */
const { JSDOM } = require('jsdom')
const fs = require('fs')
const path = require('path')

// Create a DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>')
const document = dom.window.document

// Load D3
const d3 = require('d3')

// Counter for unique IDs
let clipIdCounter = 0

// Brand colors
const colors = {
  primary: '#3D7BB9',
  accent: '#E8A838',
  background: '#FAF5F0',
  text: '#1a3a5c',
  textMuted: '#4a5568',
  textLight: '#718096',
}

// Sample data
const data = [
  { sector: 'Bebidas y tabaco', small: 9, large: 33 },
  { sector: 'Promedio de manufactura de la UE', small: null, large: 32, isHighlight: true },
  { sector: 'Electrónica y computadoras', small: 8, large: 28 },
  { sector: 'Equipo eléctrico', small: 8, large: 27 },
  { sector: 'Productos minerales no metálicos', small: 7, large: 25 },
  { sector: 'Petróleo y carbón', small: 6, large: 24 },
  { sector: 'Papel', small: 6, large: 22 },
  { sector: 'Productos textiles', small: 6, large: 21 },
  { sector: 'Equipo de transporte', small: 5, large: 20 },
  { sector: 'Promedio de manufactura en México', small: null, large: 18, isHighlight: true },
  { sector: 'Maquinaria', small: 5, large: 17 },
  { sector: 'Plásticos y caucho', small: 5, large: 16 },
  { sector: 'Comida', small: 5, large: 15 },
  { sector: 'Químicos', small: 4, large: 14 },
  { sector: 'Otras manufacturas', small: 4, large: 13 },
  { sector: 'Metal fabricado', small: 4, large: 12 },
  { sector: 'Impresión', small: 3, large: 10 },
  { sector: 'Metales Primarios', small: 3, large: 9 },
  { sector: 'Cuero & pieles', small: 3, large: 8 },
  { sector: 'Fábricas textiles', small: 2, large: 7 },
  { sector: 'Ropa y vestimenta', small: 2, large: 6 },
  { sector: 'Muebles', small: 2, large: 5 },
  { sector: 'Productos de madera', small: 1, large: 4 },
]

// Frame configuration
const frameConfig = {
  width: 1080,
  height: 1080,
  padding: { top: 150, right: 360, bottom: 80, left: 40 },
  background: colors.background,
  title: {
    text: 'Sectores manufactureros\nimpulsando la IA en México',
    x: 40,
    y: 55,
    style: {
      fontFamily: "'Lora', Georgia, serif",
      fontSize: 42,
      fontWeight: 700,
      fill: colors.text,
    },
  },
  sources: {
    text: 'Fuentes: INEGI, Eurostat',
    x: 40,
    y: 1040,
    style: { fontFamily: "'Lexend Deca', sans-serif", fontSize: 12, fill: colors.textLight },
  },
  legend: {
    show: true,
    x: 740,
    y: 620,
    width: 300,
    padding: 15,
    background: 'white',
    borderRadius: 4,
    border: '#e2e8f0',
    title: 'Adopción de IA en los\nsubsectores manufactureros\nde México\n(encuesta de 2024)',
    items: [
      { color: colors.primary, label: 'Empresas con 11 a 250 empleados' },
      { color: colors.accent, label: 'Empresas con más de 250 empleados' },
    ],
  },
}

function createBrandedFrame(config) {
  const cfg = { ...frameConfig, ...config }

  const svg = d3.select(document.body)
    .append('svg')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', cfg.width)
    .attr('height', cfg.height)
    .attr('viewBox', `0 0 ${cfg.width} ${cfg.height}`)

  // Font import
  svg.append('style')
    .text("@import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500;600&family=Lora:wght@400;500;600;700&display=swap');")

  // Background
  svg.append('rect')
    .attr('width', cfg.width)
    .attr('height', cfg.height)
    .attr('fill', cfg.background)

  // Title
  if (cfg.title.text) {
    const titleLines = cfg.title.text.split('\n')
    const lineHeight = cfg.title.style.fontSize * 1.2
    const titleGroup = svg.append('g')

    titleLines.forEach((line, i) => {
      titleGroup.append('text')
        .attr('x', cfg.title.x)
        .attr('y', cfg.title.y + (i * lineHeight))
        .style('font-family', cfg.title.style.fontFamily)
        .style('font-size', `${cfg.title.style.fontSize}px`)
        .style('font-weight', cfg.title.style.fontWeight)
        .style('fill', cfg.title.style.fill)
        .text(line)
    })
  }

  // Flag (Mexico)
  const flagX = cfg.width - 90
  const flagGroup = svg.append('g').attr('transform', `translate(${flagX}, 40)`)

  // Circle background
  flagGroup.append('circle')
    .attr('cx', 25).attr('cy', 25).attr('r', 25)
    .attr('fill', '#f0f0f0').attr('stroke', '#e0e0e0')

  // Flag stripes
  flagGroup.append('rect').attr('x', 5).attr('y', 10).attr('width', 13).attr('height', 30).attr('fill', '#006847')
  flagGroup.append('rect').attr('x', 18).attr('y', 10).attr('width', 14).attr('height', 30).attr('fill', 'white')
  flagGroup.append('rect').attr('x', 32).attr('y', 10).attr('width', 13).attr('height', 30).attr('fill', '#ce1126')

  // Chart container
  const chartX = cfg.padding.left
  const chartY = cfg.padding.top
  const chartWidth = cfg.width - cfg.padding.left - cfg.padding.right
  const chartHeight = cfg.height - cfg.padding.top - cfg.padding.bottom

  const chartContainer = svg.append('g')
    .attr('id', 'chart-container')
    .attr('transform', `translate(${chartX}, ${chartY})`)

  // Legend
  if (cfg.legend.show && cfg.legend.items.length > 0) {
    const legendGroup = svg.append('g')
      .attr('transform', `translate(${cfg.legend.x}, ${cfg.legend.y})`)

    const titleLines = cfg.legend.title ? cfg.legend.title.split('\n') : []
    const titleLineHeight = 18
    const titleHeight = titleLines.length > 0 ? (titleLines.length * titleLineHeight) + 10 : 0
    const itemHeight = 24
    const legendHeight = cfg.legend.padding * 2 + titleHeight + (cfg.legend.items.length * itemHeight)

    legendGroup.append('rect')
      .attr('width', cfg.legend.width)
      .attr('height', legendHeight)
      .attr('fill', cfg.legend.background)
      .attr('stroke', cfg.legend.border)
      .attr('rx', cfg.legend.borderRadius)

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

    const itemsGroup = legendGroup.append('g')
      .attr('transform', `translate(${cfg.legend.padding}, ${cfg.legend.padding + titleHeight})`)

    cfg.legend.items.forEach((item, i) => {
      const itemG = itemsGroup.append('g')
        .attr('transform', `translate(0, ${i * itemHeight})`)

      itemG.append('rect')
        .attr('width', 30).attr('height', 12).attr('y', 2)
        .attr('fill', item.color).attr('rx', 2)

      itemG.append('text')
        .attr('x', 40).attr('y', 12)
        .style('font-family', "'Lexend Deca', sans-serif")
        .style('font-size', '11px')
        .style('fill', '#4a5568')
        .text(item.label)
    })
  }

  // Sources
  if (cfg.sources.text) {
    svg.append('text')
      .attr('x', cfg.sources.x)
      .attr('y', cfg.sources.y)
      .style('font-family', cfg.sources.style.fontFamily)
      .style('font-size', `${cfg.sources.style.fontSize}px`)
      .style('fill', cfg.sources.style.fill)
      .text(cfg.sources.text)
  }

  // Logo placeholder
  svg.append('text')
    .attr('x', cfg.width - 280)
    .attr('y', cfg.height - 40)
    .style('font-family', "'Lexend Deca', sans-serif")
    .style('font-size', '16px')
    .style('font-weight', 600)
    .style('fill', '#3D7BB9')
    .text('◉ Latinometrics')

  return { svg, chartContainer, chartWidth, chartHeight }
}

function renderChart(container, width, height) {
  const g = container

  // Scales
  const yScale = d3.scaleBand()
    .domain(data.map(d => d.sector))
    .range([0, height])
    .padding(0.35)

  const xScale = d3.scaleLinear()
    .domain([0, 35])
    .range([0, width])

  // Grid lines
  const ticks = [5, 10, 15, 20, 25, 30, 35]
  ticks.forEach(tick => {
    g.append('line')
      .attr('x1', xScale(tick)).attr('x2', xScale(tick))
      .attr('y1', 0).attr('y2', height)
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '2,2')
  })

  // X-axis
  const xAxisGroup = g.append('g').attr('transform', `translate(0, ${height})`)
  ticks.forEach(tick => {
    xAxisGroup.append('text')
      .attr('x', xScale(tick)).attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-family', "'Lexend Deca', sans-serif")
      .style('font-size', '10px')
      .style('fill', colors.textMuted)
      .text(tick + '%')
  })

  xAxisGroup.append('text')
    .attr('x', width / 2).attr('y', 45)
    .attr('text-anchor', 'middle')
    .style('font-family', "'Lexend Deca', sans-serif")
    .style('font-size', '11px')
    .style('fill', colors.textMuted)
    .text('% de empresas que informan usar Inteligencia Artificial')

  // Bars
  data.forEach(d => {
    const y = yScale(d.sector)
    const barHeight = yScale.bandwidth() / 2.2

    if (d.large !== null) {
      g.append('rect')
        .attr('x', 0).attr('y', y + barHeight * 0.1)
        .attr('width', xScale(d.large)).attr('height', barHeight)
        .attr('fill', colors.accent)
    }

    if (d.small !== null) {
      g.append('rect')
        .attr('x', 0).attr('y', y + barHeight * 1.1)
        .attr('width', xScale(d.small)).attr('height', barHeight)
        .attr('fill', colors.primary)
    }

    // Label
    g.append('text')
      .attr('x', Math.max(xScale(d.large || d.small || 0), 0) + 8)
      .attr('y', y + yScale.bandwidth() / 2)
      .attr('dominant-baseline', 'middle')
      .style('font-family', "'Lexend Deca', sans-serif")
      .style('font-size', '11px')
      .style('font-weight', d.isHighlight ? 600 : 400)
      .style('fill', colors.text)
      .text(d.sector)
  })
}

// Generate the chart
const { svg, chartContainer, chartWidth, chartHeight } = createBrandedFrame(frameConfig)
renderChart(chartContainer, chartWidth, chartHeight)

// Save SVG
const svgString = document.body.innerHTML
fs.writeFileSync(path.join(__dirname, 'branded-chart-preview.svg'), svgString)
console.log('Generated: example/branded-chart-preview.svg')
