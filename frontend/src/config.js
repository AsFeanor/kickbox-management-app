// API Configuration
const config = {
  // Production'da Railway backend URL'ini kullan
  API_BASE_URL: import.meta.env.PROD 
    ? import.meta.env.VITE_API_URL || 'https://your-backend.railway.app'
    : 'http://localhost:3001',
  
  // Development vs Production
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
}

export default config
