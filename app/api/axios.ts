import axios from 'axios'

const rawApiUrl = process.env.NUXT_PUBLIC_API_URL ?? process.env.API_URL
if (!rawApiUrl) {
  throw new Error('Missing API_URL environment variable')
}
const API_URL = rawApiUrl.replace(/\/$/, '')

const api = axios.create({
  baseURL: API_URL
})

api.interceptors.request.use(config => {
  //const locale = localStorage.getItem('locale') || 'kk'
  //пока без i18n
  const apiPrefix = '/api/v1'
  
  // Ensure baseURL is set
  config.baseURL = API_URL
  
  // Add locale and API prefix to URL
  //config.url = `/${locale}${apiPrefix}${config.url}`
  const relativePath = config.url?.startsWith('/') ? config.url : `/${config.url ?? ''}`
  config.url = `${apiPrefix}${relativePath}`
  
  return config
})

export default api