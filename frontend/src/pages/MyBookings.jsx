import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('bookings/')
        setBookings(response.data)
      } catch (error) {
        console.log('Failed to fetch bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking?'
    )

    if (!confirmCancel) {
      return
    }

    setCancelling(bookingId)

    try {
      const response = await api.patch(
        `bookings/${bookingId}/cancel/`
      )

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking.id === bookingId
            ? response.data
            : booking
        )
      )

    } catch (error) {
      console.log('Cancellation failed:', error)

      if (error.response?.data?.error) {
        alert(error.response.data.error)
      } else {
        alert('Cancellation failed. Please try again.')
      }
    } finally {
      setCancelling(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">

      <nav className="bg-black px-8 py-4">
        <Link
          to="/"
          className="text-xl font-bold"
        >
          ← Movie Booking
        </Link>
      </nav>

      <main className="p-8">

        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold mb-8">
            My Bookings
          </h1>

          {bookings.length === 0 ? (
            <p className="text-gray-400">
              You have no bookings yet.
            </p>
          ) : (
            <div className="space-y-6">

              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-800 p-6 rounded-lg"
                >

                  <h2 className="text-2xl font-bold mb-5">
                    Booking #{booking.id}
                  </h2>

                  <div className="space-y-3">

                    <p>
                      <span className="text-gray-400">
                        Movie:
                      </span>{' '}
                      <span className="font-semibold">
                        {booking.movie_title}
                      </span>
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Theatre:
                      </span>{' '}
                      {booking.theatre_name}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Screen:
                      </span>{' '}
                      {booking.screen_name}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Date:
                      </span>{' '}
                      {booking.show_date}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Time:
                      </span>{' '}
                      {booking.show_time}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Seats:
                      </span>{' '}
                      <span className="font-semibold text-yellow-400">
                        {booking.seats?.length > 0
                          ? booking.seats.join(', ')
                          : 'No seat information'}
                      </span>
                    </p>

                    <p className="text-xl font-bold text-yellow-400">
                      Total Amount: ₹{booking.total_amount}
                    </p>

                    <p>
                      <span className="text-gray-400">
                        Status:
                      </span>{' '}

                      <span
                        className={
                          booking.status === 'confirmed'
                            ? 'text-green-400 font-semibold'
                            : 'text-red-400 font-semibold'
                        }
                      >
                        {booking.status}
                      </span>
                    </p>

                    <p className="text-gray-400 text-sm">
                      Booked on: {booking.created_at}
                    </p>

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() =>
                          handleCancel(booking.id)
                        }
                        disabled={cancelling === booking.id}
                        className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded mt-4 font-semibold disabled:opacity-50"
                      >
                        {cancelling === booking.id
                          ? 'Cancelling...'
                          : 'Cancel Booking'}
                      </button>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </main>

    </div>
  )
}

export default MyBookings