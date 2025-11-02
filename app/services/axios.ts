import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000',
})

api.interceptors.request.use(config => {
  const apiPrefix = '/api/v1'
  
  // Ensure baseURL is set
  if (!config.baseURL) {
    config.baseURL = process.env.API_URL || 'http://localhost:5000'
  }
  
  // Add API prefix to URL
  config.url = `${apiPrefix}${config.url}`
  
  return config
})

// Don't export the instance directly if it will be stored in Pinia
export default api