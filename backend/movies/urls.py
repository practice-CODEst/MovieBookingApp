from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    MovieListAPIView,
    MovieDetailAPIView,
    TheatreListAPIView,
    ScreenListAPIView,
    SeatListAPIView,
    ShowListAPIView,
    BookingListAPIView,
    BookingCancelAPIView,
    BookingSeatListAPIView,
    RegisterAPIView
)


urlpatterns = [
    path('movies/', MovieListAPIView.as_view(), name='movie-list'),
    path('movies/<int:pk>/', MovieDetailAPIView.as_view(), name='movie-detail'),
    path('theatres/', TheatreListAPIView.as_view(), name='theatre-list'),
    path('screens/', ScreenListAPIView.as_view(), name='screen-list'),
    path('seats/', SeatListAPIView.as_view(), name='seat-list'),
    path('shows/', ShowListAPIView.as_view(), name='show-list'),
    path('bookings/', BookingListAPIView.as_view(), name='booking-list'),
    path('booking-seats/', BookingSeatListAPIView.as_view(), name='booking-seat-list'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('bookings/<int:pk>/cancel/',BookingCancelAPIView.as_view(),name='booking-cancel'),
]