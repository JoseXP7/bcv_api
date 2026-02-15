const express = require('express')
const router = express.Router()
const bcvController = require('../controllers/bcvController')

// Ruta principal de salud
router.get('/health', bcvController.healthCheck)

// Obtener solo la tasa del dólar
router.get('/dollar', bcvController.getDollarRate)

// Obtener todas las tasas disponibles
router.get('/rates', bcvController.getAllRates)

module.exports = router
