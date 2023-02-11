import axios from 'axios'

export const requestInterceptors = async () => {
  await axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      config.headers['Content-Type'] = 'application/json'
      if (token) config.headers.Authorization = `Bearer ${token}`

      return config
    },
    (err) => {
      Promise.reject(err)
    },
  )
}
