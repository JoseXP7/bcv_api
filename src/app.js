const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const bcvRoutes = require('./routes/bcvRoutes')

const app = express()

// Middlewares
app.use(helmet()) // Seguridad
app.use(cors()) // Habilitar CORS
app.use(morgan('combined')) // Logging
app.use(express.json())

// Rutas
app.use('/api/bcv', bcvRoutes)

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    name: 'BCV Exchange Rate API',
    description:
      'API para obtener tasas de cambio del Banco Central de Venezuela',
    endpoints: {
      health: '/api/bcv/health',
      dollar: '/api/bcv/dollar',
      allRates: '/api/bcv/rates',
    },
    version: '1.0.0',
  })
})

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: 'La ruta solicitada no existe en esta API',
  })
})

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error global:', err.stack)
  res.status(500).json({
    error: 'Error interno del servidor',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Ocurrió un error inesperado',
  })
})

module.exports = app
