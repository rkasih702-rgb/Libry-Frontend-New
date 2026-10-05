import axios from 'axios'

const API = axios.create({
  baseURL: 'http://192.168.69.193:8080', // Sesuaikan dengan IP / port backend Go milikmu
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor: Otomatis menyelipkan Token JWT ke Header Request untuk API Admin/Protected
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default API