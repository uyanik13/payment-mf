import axios from 'axios'

export default function ({ store }) {
  axios.interceptors.request.use(
    function (config) {
      config.headers.Authorization = `Bearer ${store.state.auth.token}`
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )
}
