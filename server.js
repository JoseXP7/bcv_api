const app = require('./src/app')
const PORT = process.env.PORT || 3000

// Configuración del servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📊 Endpoints disponibles:`)
  console.log(`   - GET http://localhost:${PORT}/`)
  console.log(`   - GET http://localhost:${PORT}/api/bcv/health`)
  console.log(`   - GET http://localhost:${PORT}/api/bcv/dollar`)
  console.log(`   - GET http://localhost:${PORT}/api/bcv/rates`)
})

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...')
  server.close(() => {
    console.log('Servidor cerrado')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...')
  server.close(() => {
    console.log('Servidor cerrado')
    process.exit(0)
  })
})
