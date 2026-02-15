const axios = require('axios')
const cheerio = require('cheerio')
const https = require('https')

class BCVScraperService {
  constructor() {
    this.url = 'https://www.bcv.org.ve/'
    this.userAgent =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }

  async getExchangeRates() {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      })

      const response = await axios.get(this.url, {
        headers: {
          'User-Agent': this.userAgent,
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3',
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
        httpsAgent: httpsAgent,
        timeout: 15000,
      })

      const $ = cheerio.load(response.data)

      const rates = {}

      // Buscar el dólar específicamente
      const dolarElement = $('#dolar .centrado strong')
      if (dolarElement.length) {
        const dolarText = dolarElement.first().text().trim()
        rates.USD = parseFloat(dolarText.replace(',', '.'))
        console.log('USD encontrado:', rates.USD) // Para debugging
      }

      // Buscar el Euro
      const euroElement = $('#euro .centrado strong')
      if (euroElement.length) {
        const euroText = euroElement.first().text().trim()
        rates.EUR = parseFloat(euroText.replace(',', '.'))
      }

      // Buscar el Yuan
      const yuanElement = $('#yuan .centrado strong')
      if (yuanElement.length) {
        const yuanText = yuanElement.first().text().trim()
        rates.CNY = parseFloat(yuanText.replace(',', '.'))
      }

      // Buscar la Lira Turca
      const liraElement = $('#lira .centrado strong')
      if (liraElement.length) {
        const liraText = liraElement.first().text().trim()
        rates.TRY = parseFloat(liraText.replace(',', '.'))
      }

      // Buscar el Rublo
      const rubloElement = $('#rublo .centrado strong')
      if (rubloElement.length) {
        const rubloText = rubloElement.first().text().trim()
        rates.RUB = parseFloat(rubloText.replace(',', '.'))
      }

      // Obtener la fecha de valor
      const fechaElement = $('.dinpro.center .date-display-single')
      let fechaValor = null
      if (fechaElement.length) {
        fechaValor = fechaElement.first().text().trim()
      }

      if (!rates.USD) {
        throw new Error('No se pudo encontrar la tasa del dólar en la página')
      }

      return {
        success: true,
        data: rates,
        fecha_valor: fechaValor,
        timestamp: new Date().toISOString(),
        source: this.url,
      }
    } catch (error) {
      console.error('Error en el scraping:', error.message)

      if (error.code === 'ECONNABORTED') {
        throw new Error('Tiempo de espera agotado al conectar con el BCV')
      }
      if (error.response && error.response.status === 404) {
        throw new Error('Página del BCV no encontrada')
      }

      throw new Error(`Error al obtener datos del BCV: ${error.message}`)
    }
  }

  // Método alternativo usando selectores más generales
  async getExchangeRatesAlternative() {
    try {
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      })

      const response = await axios.get(this.url, {
        headers: { 'User-Agent': this.userAgent },
        httpsAgent: httpsAgent,
      })

      const $ = cheerio.load(response.data)
      const rates = {}

      // Buscar todas las monedas en el bloque de tipo de cambio
      $('.view-tipo-de-cambio-oficial-del-bcv .views-row').each(
        (index, row) => {
          const $row = $(row)

          // Buscar por ID de moneda
          const dolar = $row.find('#dolar .centrado strong').text()
          const euro = $row.find('#euro .centrado strong').text()
          const yuan = $row.find('#yuan .centrado strong').text()
          const lira = $row.find('#lira .centrado strong').text()
          const rublo = $row.find('#rublo .centrado strong').text()

          if (dolar) rates.USD = parseFloat(dolar.trim().replace(',', '.'))
          if (euro) rates.EUR = parseFloat(euro.trim().replace(',', '.'))
          if (yuan) rates.CNY = parseFloat(yuan.trim().replace(',', '.'))
          if (lira) rates.TRY = parseFloat(lira.trim().replace(',', '.'))
          if (rublo) rates.RUB = parseFloat(rublo.trim().replace(',', '.'))
        },
      )

      return rates
    } catch (error) {
      throw new Error(`Error en método alternativo: ${error.message}`)
    }
  }
}

module.exports = new BCVScraperService()
