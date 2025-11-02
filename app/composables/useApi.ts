import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '~/stores/auth'

export const useApi = (requiresAuth = true): AxiosInstance => {
  const api = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:5000/api/v1',
  })

  api.interceptors.request.use(config => {
    // Add auth token if available and required
    if (requiresAuth) {
      const authStore = useAuthStore()
      const token = authStore.getToken
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    
    return config
  })

  return api
}
