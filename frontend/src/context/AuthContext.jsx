import { createContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    console.log('SAVED USER FROM THIS BROWSER:', savedUser)
    return savedUser ? JSON.parse(savedUser) : null
  })

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken')
  })

  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem('refreshToken')
  })

  const login = (userData, access, refresh) => {
    setUser(userData)
    setAccessToken(access)
    setRefreshToken(refresh)

    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
  }

  const logout = () => {
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)

    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext