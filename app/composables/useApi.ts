import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '~/stores/auth'

export const useApi = (): AxiosInstance => {
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
    
    // Add auth token if available
    const authStore = useAuthStore()
    const token = authStore.getToken
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  })

  return api
}
