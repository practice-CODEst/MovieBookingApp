
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../services/api'
import useAuth from '../hooks/useAuth'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('login/', {
        username,
        password,
      })

      const { access, refresh } = response.data

      login(
        { username },
        access,
        refresh
      )

      // Return to the page that required login
      const destination = location.state?.from || '/'

      navigate(destination, { replace: true })
    } catch (error) {
      console.error('Login failed:', error.response?.data)

      setError(
        error.response?.status === 401
          ? 'Invalid username or password.'
          : 'Login failed. Please check your connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">
          Login
        </h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-3 rounded"
            autoComplete="username"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded"
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white p-3 rounded font-semibold disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
