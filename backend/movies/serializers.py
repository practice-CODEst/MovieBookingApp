
from rest_framework import serializers
from django.contrib.auth.models import User

from .models import (
    Movie,
    Theatre,
    Screen,
    Seat,
    Show,
    Booking,
    BookingSeat
)


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'


class TheatreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theatre
        fields = '__all__'


class ScreenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screen
        fields = '__all__'


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = '__all__'


class ShowSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(
        source='movie.title',
        read_only=True
    )

    screen_name = serializers.CharField(
        source='screen.name',
        read_only=True
    )

    theatre_name = serializers.CharField(
        source='screen.theatre.name',
        read_only=True
    )

    theatre_location = serializers.CharField(
        source='screen.theatre.location',
        read_only=True
    )

    theatre_city = serializers.CharField(
        source='screen.theatre.city',
        read_only=True
    )

    class Meta:
        model = Show
        fields = [
            'id',
            'show_date',
            'show_time',
            'ticket_price',
            'movie',
            'movie_title',
            'screen',
            'screen_name',
            'theatre_name',
            'theatre_location',
            'theatre_city',
        ]


class BookingSerializer(serializers.ModelSerializer):
    movie_title = serializers.CharField(
        source='show.movie.title',
        read_only=True
    )

    theatre_name = serializers.CharField(
        source='show.screen.theatre.name',
        read_only=True
    )

    screen_name = serializers.CharField(
        source='show.screen.name',
        read_only=True
    )

    show_date = serializers.DateField(
        source='show.show_date',
        read_only=True
    )

    show_time = serializers.TimeField(
        source='show.show_time',
        read_only=True
    )

    seats = serializers.SerializerMethodField()

    def get_seats(self, booking):
        booking_seats = booking.booking_seats.select_related('seat')

        return [
            f"{booking_seat.seat.row}{booking_seat.seat.number}"
            for booking_seat in booking_seats
        ]

    class Meta:
        model = Booking
        fields = [
            'id',
            'show',
            'movie_title',
            'theatre_name',
            'screen_name',
            'show_date',
            'show_time',
            'seats',
            'total_amount',
            'status',
            'created_at',
        ]


class BookingSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingSeat
        fields = '__all__'


class PublicBookedSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingSeat
        fields = ['show', 'seat']


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        return user