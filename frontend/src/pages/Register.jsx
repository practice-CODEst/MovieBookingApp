import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    const response = await api.post('register/', {
      username,
      email,
      password,
    })

    console.log('Registration successful:', response.data)

    alert('Account created successfully!')
    navigate('/login')
  } catch (error) {
    console.log('Registration failed:', error.response?.data)
  }
}

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-3 rounded font-semibold"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register