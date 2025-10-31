import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.API_URL
})

api.interceptors.request.use(config => {
 //const locale = localStorage.getItem('locale') || 'kk'
 //пока без i18n
  const apiPrefix = '/api/v1'
  
  // Ensure baseURL is set
  config.baseURL = import.meta.env.API_URL
  
  // Add locale and API prefix to URL
  //config.url = `/${locale}${apiPrefix}${config.url}`
  config.url = `/${apiPrefix}${config.url}`
  
  return config
})

export default api