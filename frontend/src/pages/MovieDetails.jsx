import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

function MovieDetails() {
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [shows, setShows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieResponse = await api.get(`movies/${id}/`)
        const showsResponse = await api.get('shows/')

        setMovie(movieResponse.data)

        const movieShows = showsResponse.data.filter(
          (show) => show.movie === Number(id)
        )

        setShows(movieShows)
      } catch (error) {
        console.log('Failed to fetch movie:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading movie...</p>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Movie not found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <nav className="bg-black px-8 py-4">
        <Link to="/" className="text-xl font-bold">
          ← Movie Booking
        </Link>
      </nav>

      <main className="p-8">

        <div className="max-w-5xl mx-auto bg-gray-800 rounded-lg overflow-hidden">

          <div className="md:flex">

            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full md:w-80 h-[450px] object-cover"
              />
            ) : (
              <div className="w-full md:w-80 h-[450px] bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">
                  No Poster
                </span>
              </div>
            )}

            <div className="p-8">

              <h1 className="text-4xl font-bold mb-4">
                {movie.title}
              </h1>

              <p className="text-gray-300 mb-3">
                Genre: {movie.genre}
              </p>

              <p className="text-gray-300 mb-3">
                Language: {movie.language}
              </p>

              <p className="text-gray-300 mb-3">
                Duration: {movie.duration} minutes
              </p>

              <p className="text-gray-300 mb-3">
                Release Date: {movie.release_date}
              </p>

              <p className="text-yellow-400 text-xl mb-3">
                ⭐ {movie.rating}
              </p>

              <p className="text-green-400 mb-6">
                {movie.status}
              </p>

              <h2 className="text-2xl font-bold mb-3">
                Description
              </h2>

              <p className="text-gray-300 mb-8 whitespace-pre-line">
                {movie.description}
              </p>

              <h2 className="text-2xl font-bold mb-4">
                Available Shows
              </h2>

              {shows.length === 0 ? (
                <p className="text-gray-400 mb-6">
                  No shows available for this movie.
                </p>
              ) : (
                <div className="space-y-4 mb-8">

                  {shows.map((show) => (
                    <div
                      key={show.id}
                      className="bg-gray-700 p-4 rounded-lg"
                    >

                      <h3 className="text-xl font-bold mb-2">
                        {show.theatre_name}
                      </h3>

                      <p className="text-gray-300">
                        {show.theatre_location}, {show.theatre_city}
                      </p>

                      <p className="text-gray-300">
                        {show.screen_name}
                      </p>

                      <p className="text-gray-300">
                        Date: {show.show_date}
                      </p>

                      <p className="text-gray-300">
                        Time: {show.show_time}
                      </p>

                      <p className="text-yellow-400 font-semibold mt-2">
                        ₹{show.ticket_price}
                      </p>

                      <Link
                       to={`/select-seats/${show.id}`}
                       className="inline-block bg-red-600 px-5 py-2 rounded mt-3"
                      >
                       Select Show
                     </Link>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default MovieDetails