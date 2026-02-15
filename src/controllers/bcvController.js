const bcvScraperService = require('../services/scraperService')

class BCVController {
  async getDollarRate(req, res) {
    try {
      const result = await bcvScraperService.getExchangeRates()

      res.json({
        success: true,
        data: {
          usd_to_ves: result.data.USD,
          fecha_valor: result.fecha_valor,
        },
        timestamp: result.timestamp,
        message: 'Tasa de cambio obtenida exitosamente',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  }

  async getAllRates(req, res) {
    try {
      const result = await bcvScraperService.getExchangeRates()

      // Formatear la respuesta para que sea más clara
      const formattedRates = {
        usd: {
          moneda: 'Dólar Estadounidense',
          codigo: 'USD',
          tasa: result.data.USD,
        },
        euro: {
          moneda: 'Euro',
          codigo: 'EUR',
          tasa: result.data.EUR || null,
        },
        yuan: {
          moneda: 'Yuan Chino',
          codigo: 'CNY',
          tasa: result.data.CNY || null,
        },
        lira: {
          moneda: 'Lira Turca',
          codigo: 'TRY',
          tasa: result.data.TRY || null,
        },
        rublo: {
          moneda: 'Rublo Ruso',
          codigo: 'RUB',
          tasa: result.data.RUB || null,
        },
      }

      res.json({
        success: true,
        data: formattedRates,
        fecha_valor: result.fecha_valor,
        timestamp: result.timestamp,
        source: result.source,
        nota: 'Tasas de cambio oficiales del Banco Central de Venezuela',
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    }
  }

  async healthCheck(req, res) {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'BCV API',
      version: '1.0.0',
    })
  }
}

module.exports = new BCVController()
