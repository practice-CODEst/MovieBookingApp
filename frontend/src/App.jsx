import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MovieDetails from './pages/MovieDetails'
import SeatSelection from './pages/SeatSelection'
import MyBookings from './pages/MyBookings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/select-seats/:showId" element={<SeatSelection />}
        
/>
      </Routes>
    </BrowserRouter>
  )
}

export default App