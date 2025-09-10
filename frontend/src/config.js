// API Configuration
const config = {
  // Production'da aynı domain'i kullan (monorepo deployment)
  API_BASE_URL: import.meta.env.PROD 
    ? '' // Same domain, no need for full URL
    : 'http://localhost:3001',
  
  // Development vs Production
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
}

export default config
