import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import api from '../services/api'

function Home() {
  const { user, logout } = useAuth()

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('movies/')

        setMovies(response.data)
      } catch (error) {
        console.log('Failed to fetch movies:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      {/* Navbar */}
      <nav className="bg-black px-8 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          Movie Booking
        </h1>

        <div className="flex items-center gap-4">

          {user ? (
  <>
    <span>Welcome, {user.username}</span>

    <Link
      to="/my-bookings"
      className="bg-blue-600 px-4 py-2 rounded"
    >
      My Bookings
    </Link>

    <button
      onClick={logout}
      className="bg-red-600 px-4 py-2 rounded"
    >
      Logout
    </button>
  </>
) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 px-4 py-2 rounded"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-red-600 px-4 py-2 rounded"
              >
                Create Account
              </Link>
            </>
          )}

        </div>
      </nav>

      {/* Movies */}
      <main className="p-8">

        <h2 className="text-3xl font-bold mb-8">
          Movies
        </h2>

        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {movies.map((movie) => (
  <Link
    key={movie.id}
    to={`/movie/${movie.id}`}
    className="bg-gray-800 rounded-lg overflow-hidden shadow-lg block"
  >
    {movie.poster ? (
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-80 object-cover"
      />
    ) : (
      <div className="w-full h-80 bg-gray-700 flex items-center justify-center">
        <span className="text-gray-400">No Poster</span>
      </div>
    )}

    <div className="p-4">
      <h3 className="text-xl font-bold mb-2">
        {movie.title}
      </h3>

      <p className="text-gray-400 mb-2">
        {movie.genre}
      </p>

      <p className="text-gray-400 mb-2">
        {movie.language}
      </p>

      <p className="text-yellow-400">
        ⭐ {movie.rating}
      </p>
    </div>
  </Link>
))}

          </div>
        )}

      </main>

    </div>
  )
}

export default Home