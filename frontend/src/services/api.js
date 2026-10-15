import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
})


// Add access token to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


// Handle expired access token
api.interceptors.response.use(
  (response) => {
    return response
  },

  async (error) => {
    const originalRequest = error.config

    // Do NOT refresh token for login or refresh requests
    if (
      originalRequest?.url?.includes('login/') ||
      originalRequest?.url?.includes('token/refresh/')
    ) {
      return Promise.reject(error)
    }

    // Only refresh when access token has expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/token/refresh/',
          {
            refresh: refreshToken,
          }
        )

        const newAccessToken = response.data.access

        localStorage.setItem(
          'accessToken',
          newAccessToken
        )

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`

        return api(originalRequest)

      } catch (refreshError) {
        console.log(
          'Refresh token failed:',
          refreshError
        )

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')

        window.location.href = '/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api