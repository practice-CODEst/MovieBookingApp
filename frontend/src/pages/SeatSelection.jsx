
import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function SeatSelection() {
  const { showId } = useParams()
  const navigate = useNavigate()

  const [show, setShow] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [bookedSeats, setBookedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      setLoading(true)
      setError('')
      setSelectedSeats([])

      try {
        const [showResponse, seatsResponse, bookingSeatsResponse] =
          await Promise.all([
            api.get('shows/'),
            api.get('seats/'),
            api.get('booking-seats/'),
          ])

        const selectedShow = showResponse.data.find(
          (item) => Number(item.id) === Number(showId)
        )

        if (!isMounted) return

        setShow(selectedShow || null)

        if (!selectedShow) {
          setSeats([])
          setBookedSeats([])
          return
        }

        const screenSeats = seatsResponse.data.filter(
          (seat) =>
            Number(seat.screen) === Number(selectedShow.screen)
        )

        const showBookedSeats = bookingSeatsResponse.data
          .filter(
            (bookingSeat) =>
              Number(bookingSeat.show) === Number(showId) &&
              bookingSeat.is_active === true
          )
          .map((bookingSeat) => Number(bookingSeat.seat))

        console.log('Current show ID:', Number(showId))
        console.log('Booked seat IDs:', showBookedSeats)

        setSeats(screenSeats)
        setBookedSeats(showBookedSeats)
      } catch (error) {
        console.error('Failed to fetch seat data:', error)

        if (isMounted) {
          setError('Failed to load seats. Please refresh and try again.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [showId])

  const handleSeatClick = (seatId) => {
    if (bookedSeats.includes(Number(seatId))) {
      return
    }

    setSelectedSeats((previousSeats) =>
      previousSeats.includes(seatId)
        ? previousSeats.filter((id) => id !== seatId)
        : [...previousSeats, seatId]
    )
  }

  const handleBooking = async () => {
    if (selectedSeats.length === 0 || booking) {
      return
    }

    const token = localStorage.getItem('accessToken')

    if (!token) {
      navigate('/login', {
        state: { from: `/select-seats/${showId}` },
      })
      return
    }

    setBooking(true)
    setError('')

    try {
      await api.post('bookings/', {
        show: Number(showId),
        seats: selectedSeats,
      })

      alert('Booking successful!')
      navigate('/')
    } catch (error) {
      console.error('Booking error response:', error.response?.data)

      const responseData = error.response?.data

      if (responseData?.detail) {
        setError(responseData.detail)
      } else if (responseData?.error) {
        setError(responseData.error)
      } else {
        setError('Booking failed. Please try again.')
      }
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading seats...</p>
      </div>
    )
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Show not found.</p>
          <Link to="/" className="text-yellow-400 hover:underline">
            Back to Movies
          </Link>
        </div>
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            Select Seats
          </h1>

          <p className="text-gray-400 mb-2">
            Movie: {show.movie_title}
          </p>

          <p className="text-gray-400 mb-8">
            Theatre: {show.theatre_name} | Screen: {show.screen_name}
          </p>

          <div className="bg-gray-800 p-8 rounded-lg">
            <div className="bg-gray-600 text-center py-3 rounded mb-10">
              SCREEN
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              {seats.map((seat) => {
                const isBooked = bookedSeats.includes(Number(seat.id))
                const isSelected = selectedSeats.includes(seat.id)

                return (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat.id)}
                    disabled={isBooked || booking}
                    className={`px-6 py-3 rounded ${
                      isBooked
                        ? 'bg-red-600 cursor-not-allowed'
                        : isSelected
                        ? 'bg-yellow-500 text-black'
                        : 'bg-green-600 hover:bg-green-500'
                    }`}
                    title={
                      isBooked
                        ? 'Already booked'
                        : isSelected
                        ? 'Selected'
                        : 'Available'
                    }
                  >
                    {seat.row}{seat.number}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-center gap-6 flex-wrap mt-8 text-sm">
              <span>
                <span className="inline-block w-3 h-3 bg-green-600 rounded mr-2" />
                Available
              </span>

              <span>
                <span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-2" />
                Selected
              </span>

              <span>
                <span className="inline-block w-3 h-3 bg-red-600 rounded mr-2" />
                Booked
              </span>
            </div>

            <div className="mt-8 text-center">
              <p className="text-lg mb-2">
                Selected Seats:{' '}
                {selectedSeats.length === 0
                  ? 'None'
                  : selectedSeats
                      .map((seatId) => {
                        const seat = seats.find(
                          (item) => item.id === seatId
                        )

                        return seat
                          ? `${seat.row}${seat.number}`
                          : ''
                      })
                      .filter(Boolean)
                      .join(', ')}
              </p>

              <p className="text-xl font-bold text-yellow-400">
                Total: ₹
                {selectedSeats.length * Number(show.ticket_price)}
              </p>

              {error && (
                <p className="text-red-400 mt-4" role="alert">
                  {error}
                </p>
              )}

              {selectedSeats.length > 0 && (
                <button
                  onClick={handleBooking}
                  disabled={booking}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded mt-6 font-semibold disabled:opacity-50"
                >
                  {booking ? 'Booking...' : 'Book Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SeatSelection
