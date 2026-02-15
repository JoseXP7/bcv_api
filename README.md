# 📊 BCV Exchange Rate API

API RESTful que obtiene las tasas de cambio oficiales del **Banco Central de Venezuela (BCV)** mediante web scraping. Proporciona acceso fácil y estructurado al tipo de cambio del dólar (USD), euro (EUR), yuan (CNY), lira turca (TRY) y rublo ruso (RUB).

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)
[![Express Version](https://img.shields.io/badge/express-4.18.x-blue)](https://expressjs.com/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Endpoints](#-endpoints)
- [Ejemplos de Respuesta](#-ejemplos-de-respuesta)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Manejo de Errores](#-manejo-de-errores)
- [Contribuir](#-contribuir)
- [Contacto](#-contacto)

## ✨ Características

- ✅ Obtiene tasas de cambio oficiales del BCV en tiempo real
- ✅ Múltiples monedas: USD, EUR, CNY, TRY, RUB
- ✅ Incluye fecha valor de las tasas
- ✅ Manejo robusto de errores
- ✅ Respuestas JSON estructuradas
- ✅ Soporte CORS para peticiones desde el navegador
- ✅ Logging de peticiones
- ✅ Configuración de seguridad con Helmet
- ✅ Preparado para producción

## 🛠 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Axios** - Cliente HTTP para peticiones
- **Cheerio** - Parseo y scraping de HTML
- **CORS** - Middleware para CORS
- **Helmet** - Seguridad HTTP
- **Morgan** - Logging de peticiones
- **Nodemon** - Reinicio automático en desarrollo

## 📦 Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/JoseXP7/bcv_api.git
cd bcv_api
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno** (opcional)

```bash
cp .env.example .env
# Editar .env con tu configuración
```

4. **Iniciar el servidor**

Para desarrollo (con reinicio automático):

```bash
npm run dev
```

Para producción:

```bash
npm start
```

El servidor iniciará en `http://localhost:3000` (o el puerto configurado).

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
NODE_ENV=development
```

## 🚀 Uso

### Peticiones con cURL

```bash
# Verificar estado del servicio
curl http://localhost:3000/api/bcv/health

# Obtener todas las tasas
curl http://localhost:3000/api/bcv/rates

# Obtener solo tasa del dólar
curl http://localhost:3000/api/bcv/dollar
```

### Desde JavaScript (Fetch API)

```javascript
// Obtener todas las tasas
fetch('http://localhost:3000/api/bcv/rates')
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error('Error:', error))

// Obtener solo el dólar
fetch('http://localhost:3000/api/bcv/dollar')
  .then((response) => response.json())
  .then((data) => console.log('USD a VES:', data.data.usd_to_ves))
  .catch((error) => console.error('Error:', error))
```

### Desde Python (Requests)

```python
import requests

response = requests.get('http://localhost:3000/api/bcv/rates')
if response.status_code == 200:
    data = response.json()
    print(f"USD: {data['data']['usd']['tasa']}")
    print(f"EUR: {data['data']['euro']['tasa']}")
```

## 📍 Endpoints

| Método | Endpoint          | Descripción                         |
| ------ | ----------------- | ----------------------------------- |
| GET    | `/`               | Información general de la API       |
| GET    | `/api/bcv/health` | Verificar estado del servicio       |
| GET    | `/api/bcv/dollar` | Obtener tasa del dólar (USD/VES)    |
| GET    | `/api/bcv/rates`  | Obtener todas las tasas disponibles |

## 📄 Ejemplos de Respuesta

### GET /api/bcv/rates

```json
{
  "success": true,
  "data": {
    "usd": {
      "moneda": "Dólar Estadounidense",
      "codigo": "USD",
      "tasa": 396.3674
    },
    "euro": {
      "moneda": "Euro",
      "codigo": "EUR",
      "tasa": 470.28199275
    },
    "yuan": {
      "moneda": "Yuan Chino",
      "codigo": "CNY",
      "tasa": 57.38217879
    },
    "lira": {
      "moneda": "Lira Turca",
      "codigo": "TRY",
      "tasa": 9.06287141
    },
    "rublo": {
      "moneda": "Rublo Ruso",
      "codigo": "RUB",
      "tasa": 5.17714502
    }
  },
  "fecha_valor": "Miércoles, 18 Febrero 2026",
  "timestamp": "2026-02-15T22:30:45.123Z",
  "source": "https://www.bcv.org.ve/",
  "nota": "Tasas de cambio oficiales del Banco Central de Venezuela"
}
```

### GET /api/bcv/dollar

```json
{
  "success": true,
  "data": {
    "usd_to_ves": 396.3674,
    "fecha_valor": "Miércoles, 18 Febrero 2026"
  },
  "other_currencies": {
    "euro": 470.28199275,
    "yuan": 57.38217879,
    "lira": 9.06287141,
    "rublo": 5.17714502
  },
  "timestamp": "2026-02-15T22:30:45.123Z",
  "message": "Tasa de cambio obtenida exitosamente"
}
```

### GET /api/bcv/health

```json
{
  "status": "OK",
  "timestamp": "2026-02-15T22:30:45.123Z",
  "service": "BCV API",
  "version": "1.0.0"
}
```

## 📁 Estructura del Proyecto

```
bcv-exchange-rate-api/
├── src/
│   ├── controllers/
│   │   └── bcvController.js      # Lógica de los endpoints
│   ├── services/
│   │   └── scraperService.js      # Servicio de scraping del BCV
│   ├── routes/
│   │   └── bcvRoutes.js           # Definición de rutas
│   └── app.js                      # Configuración de Express
├── server.js                       # Punto de entrada
├── package.json
├── README.md
└── .gitignore
```

## ⚠️ Manejo de Errores

La API incluye manejo robusto de errores para diferentes situaciones:

```json
{
  "success": false,
  "error": "Error al obtener datos del BCV: Tiempo de espera agotado",
  "timestamp": "2026-02-15T22:30:45.123Z"
}
```

### Códigos de Error HTTP

- **200** - Éxito
- **404** - Recurso no encontrado
- **500** - Error interno del servidor (problemas con scraping, timeout, etc.)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Reportar Problemas

Si encuentras algún error o la estructura del sitio del BCV cambia, por favor abre un issue incluyendo:

- Descripción del problema
- Endpoint que falla
- Respuesta de error
- Fecha y hora del incidente

## 📧 Contacto

José Graterol - [@codefrontend87](https://twitter.com/codefrontend87) - josemanuelgraterolrodriguez@gmail.com

Link del proyecto: [https://github.com/JoseXP7/bcv_api](https://github.com/JoseXP7/bcv_api)

## 🙏 Agradecimientos

- Banco Central de Venezuela por proporcionar la información pública
- Comunidad de Node.js por las excelentes herramientas
- Contribuidores y usuarios de la API

## ⚡ Notas Importantes

- **Actualización**: Las tasas se actualizan diariamente según la publicación del BCV
- **Uso responsable**: Por favor, implementa caché si planeas hacer muchas peticiones
- **Cambios en el sitio**: El scraper puede necesitar actualizaciones si el BCV modifica su estructura HTML
- **SSL**: Se maneja la verificación SSL para el sitio del BCV

---

⌨️ con ❤️ por JoseXP7
