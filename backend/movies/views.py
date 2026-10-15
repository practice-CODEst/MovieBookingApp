
from django.contrib.auth.models import User
from django.db import transaction, IntegrityError

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from .models import (
    Movie,
    Theatre,
    Screen,
    Seat,
    Show,
    Booking,
    BookingSeat,
)

from .serializers import (
    MovieSerializer,
    TheatreSerializer,
    ScreenSerializer,
    SeatSerializer,
    ShowSerializer,
    BookingSerializer,
    BookingSeatSerializer,
    RegisterSerializer,
)


# -------------------------
# PUBLIC MOVIE APIs
# -------------------------

class MovieListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


class MovieDetailAPIView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer


# -------------------------
# PUBLIC THEATRE APIs
# -------------------------

class TheatreListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Theatre.objects.all()
    serializer_class = TheatreSerializer


class ScreenListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Screen.objects.all()
    serializer_class = ScreenSerializer


class SeatListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer


class ShowListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Show.objects.all()
    serializer_class = ShowSerializer


# -------------------------
# BOOKING API
# -------------------------

class BookingListAPIView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        show_id = request.data.get('show')
        seat_ids = request.data.get('seats', [])

        if not show_id:
            return Response(
                {'error': 'Show is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if (
            not isinstance(seat_ids, list)
            or not seat_ids
            or any(
                isinstance(seat_id, bool)
                or not isinstance(seat_id, int)
                for seat_id in seat_ids
            )
        ):
            return Response(
                {'error': 'A list of valid seat IDs is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(seat_ids) != len(set(seat_ids)):
            return Response(
                {'error': 'Duplicate seat IDs are not allowed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            show = Show.objects.select_for_update().get(id=show_id)
        except (Show.DoesNotExist, ValueError, TypeError):
            return Response(
                {'error': 'Show not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        seats = list(
            Seat.objects.filter(
                id__in=seat_ids,
                screen=show.screen,
            )
        )

        if len(seats) != len(seat_ids):
            return Response(
                {'error': 'One or more seats are invalid.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        already_booked = BookingSeat.objects.filter(
            show=show,
            seat__in=seat_ids,
            is_active=True,
            booking__status='confirmed',
        ).exists()

        if already_booked:
            return Response(
                {
                    'error':
                    'One or more selected seats are already booked.'
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                total_amount = show.ticket_price * len(seats)

                booking = Booking.objects.create(
                    user=request.user,
                    show=show,
                    total_amount=total_amount,
                    status='confirmed',
                )

                BookingSeat.objects.bulk_create([
                    BookingSeat(
                        booking=booking,
                        show=show,
                        seat=seat,
                        is_active=True,
                    )
                    for seat in seats
                ])

        except IntegrityError:
            return Response(
                {
                    'error':
                    'One or more selected seats are already booked. '
                    'Please refresh and select available seats.'
                },
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_201_CREATED,
        )


# -------------------------
# BOOKING-SEAT API
# -------------------------

class BookingSeatListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]

    queryset = BookingSeat.objects.filter(
        is_active=True,
        booking__status='confirmed',
    )

    serializer_class = BookingSeatSerializer


# -------------------------
# USER REGISTRATION API
# -------------------------

class RegisterAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


# -------------------------
# BOOKING CANCELLATION API
# -------------------------

class BookingCancelAPIView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        booking = self.get_object()

        if booking.status == 'cancelled':
            return Response(
                {'error': 'Booking is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        booking.booking_seats.update(is_active=False)

        booking.status = 'cancelled'
        booking.save(update_fields=['status'])

        return Response(
            BookingSerializer(booking).data,
            status=status.HTTP_200_OK,
        )
