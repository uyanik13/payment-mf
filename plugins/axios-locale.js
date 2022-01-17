import axios from 'axios'

export default function ({ store }) {
  axios.interceptors.request.use(
    function (config) {
      config.headers['Accept-Language'] = store.state.appParams.language
      return config
    },
    function (error) {
      return Promise.reject(error)
    }
  )
}
