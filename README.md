# Movie Booking System

A full-stack web application for browsing movies, viewing show details, selecting seats, and managing movie ticket bookings.

## Overview

The Movie Booking System is built using React.js, Django REST Framework, and MySQL. It integrates a frontend application with REST APIs to support user authentication, movie listings, show information, seat selection, and booking management.

## Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

**Backend**
- Python
- Django
- Django REST Framework
- Simple JWT

**Database**
- MySQL

**Development Tools**
- Git
- GitHub
- VS Code
- Postman

## Features

- User registration and login
- JWT-based authentication and token refresh
- Movie listings and movie details
- Theatre and screen information
- Show and seat information
- Seat selection for movie shows
- Movie ticket booking
- Booking information and cancellation
- REST API integration between frontend and backend
- Database-backed data management

## Project Structure

```text
MovieBookingApp/
├── backend/
│   ├── config/
│   ├── movies/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## API Endpoints

**Base URL:** `http://127.0.0.1:8000/api/`

| HTTP Method | Endpoint | Description |
|---|---|---|
| POST | `/register/` | User registration |
| POST | `/login/` | User login |
| POST | `/token/refresh/` | Refresh access token |
| GET | `/movies/` | Retrieve movies |
| GET | `/movies/<id>/` | Retrieve movie details |
| GET | `/theatres/` | Retrieve theatres |
| GET | `/screens/` | Retrieve screens |
| GET | `/seats/` | Retrieve seats |
| GET | `/shows/` | Retrieve shows |
| Refer to implementation | `/bookings/` | Booking management |
| Refer to implementation | `/booking-seats/` | Booking-seat information |

The backend also includes a booking cancellation endpoint. Refer to the backend URL configuration and view implementation for its exact path and supported HTTP methods.

## Installation and Setup

### Prerequisites

- Python
- Node.js and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/practice-CODEst/MovieBookingApp.git
cd MovieBookingApp
```

### 2. Set Up the Backend

Open PowerShell in the project root and run:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Configure the required environment variables and MySQL database settings for your local environment. Create the database specified in your Django configuration.

Run the database migrations and start the backend:

```powershell
python manage.py migrate
python manage.py runserver
```

Backend development URL: `http://127.0.0.1:8000/`

### 3. Set Up the Frontend

Open a second terminal in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend URL displayed by Vite in the terminal, usually `http://localhost:5173/`.

Ensure the frontend API configuration points to the running backend.

## Future Enhancements

- Payment gateway integration for online ticket payments
- Deployment of the frontend and backend
- Custom administration dashboard
- Improved seat availability validation
- Automated API and frontend testing
- Enhanced booking experience

