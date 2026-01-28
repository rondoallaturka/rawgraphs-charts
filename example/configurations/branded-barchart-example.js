/**
 * Branded Bar Chart Example
 *
 * This example demonstrates how to create a branded chart similar to the
 * Latinometrics + Siemens style chart showing AI adoption in Mexican manufacturing.
 *
 * Key branding elements:
 * - Lora font for title
 * - Lexend Deca for all other text
 * - Brand colors: Blue (#3D7BB9) and Orange (#E8A838)
 * - Cream background (#FAF5F0)
 * - Frame with title, country flag, sources, and logos
 */

import barchart from 'rawcharts/barchart'
import { latinometricsTheme, createBrandedFrame, generateStyles } from '../src/branding'

// Sample data mimicking the AI adoption chart
export const sampleData = `sector,company_size,value,highlight
Bebidas y tabaco,small,9,false
Bebidas y tabaco,large,33,false
Promedio de manufactura de la UE,average,32,highlight
Electrónica y computadoras,small,8,false
Electrónica y computadoras,large,28,false
Equipo eléctrico,small,8,false
Equipo eléctrico,large,27,false
Productos minerales no metálicos,small,7,false
Productos minerales no metálicos,large,25,false
Petróleo y carbón,small,6,false
Petróleo y carbón,large,24,false
Papel,small,6,false
Papel,large,22,false
Productos textiles,small,6,false
Productos textiles,large,21,false
Equipo de transporte,small,5,false
Equipo de transporte,large,20,false
Promedio de manufactura en México,average,18,highlight
Maquinaria,small,5,false
Maquinaria,large,17,false
Plásticos y caucho,small,5,false
Plásticos y caucho,large,16,false
Comida,small,5,false
Comida,large,15,false
Químicos,small,4,false
Químicos,large,14,false
Otras manufacturas,small,4,false
Otras manufacturas,large,13,false
Metal fabricado,small,4,false
Metal fabricado,large,12,false
Impresión,small,3,false
Impresión,large,10,false
Metales Primarios,small,3,false
Metales Primarios,large,9,false
Cuero & pieles,small,3,false
Cuero & pieles,large,8,false
Fábricas textiles,small,2,false
Fábricas textiles,large,7,false
Ropa y vestimenta,small,2,false
Ropa y vestimenta,large,6,false
Muebles,small,2,false
Muebles,large,5,false
Productos de madera,small,1,false
Productos de madera,large,4,false`

// Frame configuration for the branded output
export const frameConfig = {
  width: 1080,
  height: 1080,

  padding: {
    top: 140,
    right: 40,
    bottom: 100,
    left: 40,
  },

  background: latinometricsTheme.colors.background,

  title: {
    text: 'Sectores manufactureros\nimpulsando la IA en México',
    x: 40,
    y: 55,
    style: latinometricsTheme.fonts.title,
  },

  flag: {
    show: true,
    url: 'https://flagcdn.com/w80/mx.png', // Mexico flag
    x: null, // Auto-position right
    y: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  sources: {
    text: 'Fuentes: INEGI, Eurostat',
    x: 40,
    y: null, // Auto-position bottom
    style: latinometricsTheme.fonts.source,
  },

  logos: [
    {
      // Logo file should be placed in example/assets/latinometrics-logo.png
      // PNG format is supported via SVG <image> element
      url: '../assets/latinometrics-logo.png',
      width: 180,
      height: 40,
      x: null, // Auto-position
      y: null,
    },
  ],

  legend: {
    show: true,
    x: 680,
    y: 750,
    width: 320,
    padding: 15,
    background: 'white',
    borderRadius: 4,
    border: '#e2e8f0',
    title: 'Adopción de IA en los\nsubsectores manufactureros\nde México\n(encuesta de 2024)',
    items: [
      { color: latinometricsTheme.colors.comparison.small, label: 'Empresas con 11 a 250 empleados' },
      { color: latinometricsTheme.colors.comparison.large, label: 'Empresas con más de 250 empleados' },
    ],
  },
}

// Chart configuration
export const chartConfig = {
  chart: barchart,
  dataTypes: {
    sector: 'string',
    company_size: 'string',
    value: 'number',
    highlight: 'string',
  },
  mapping: {
    bars: { value: ['sector'] },
    size: { value: ['value'] },
    color: { value: ['company_size'] },
  },
  visualOptions: {
    width: 1000,
    height: 800,
    background: 'transparent',
    marginTop: 20,
    marginRight: 100,
    marginBottom: 40,
    marginLeft: 200,
    padding: 2,
    barsOrientation: 'horizontal',
    sortBarsBy: 'totalDescending',
    showLegend: false, // Using custom legend in frame
    showSeriesLabels: false,
    colorScale: {
      scaleType: 'ordinal',
      interpolator: 'customOrdinal',
      // Map company_size to brand colors
      customDomain: ['small', 'large', 'average'],
      customRange: [
        latinometricsTheme.colors.comparison.small,
        latinometricsTheme.colors.comparison.large,
        latinometricsTheme.colors.comparison.average,
      ],
    },
  },
}

// Branded styles to override default chart styles
export const brandedStyles = generateStyles(latinometricsTheme)

export default {
  frameConfig,
  chartConfig,
  sampleData,
  brandedStyles,
  theme: latinometricsTheme,
}
