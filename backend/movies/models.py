
from django.db import models


class Movie(models.Model):
    STATUS_CHOICES = [
        ('now_showing', 'Now Showing'),
        ('upcoming', 'Upcoming'),
        ('ended', 'Ended'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    genre = models.CharField(max_length=100)
    language = models.CharField(max_length=50)
    duration = models.PositiveIntegerField()
    release_date = models.DateField()
    rating = models.DecimalField(max_digits=3, decimal_places=1)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='upcoming'
    )
    poster = models.ImageField(
        upload_to='movie_posters/',
        blank=True,
        null=True
    )

    def __str__(self):
        return self.title


class Theatre(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    city = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} - {self.city}"


class Screen(models.Model):
    theatre = models.ForeignKey(
        Theatre,
        on_delete=models.CASCADE,
        related_name='screens'
    )
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.theatre.name} - {self.name}"


class Seat(models.Model):
    screen = models.ForeignKey(
        Screen,
        on_delete=models.CASCADE,
        related_name='seats'
    )
    row = models.CharField(max_length=5)
    number = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.screen} - {self.row}{self.number}"


class Show(models.Model):
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name='shows'
    )
    screen = models.ForeignKey(
        Screen,
        on_delete=models.CASCADE,
        related_name='shows'
    )
    show_date = models.DateField()
    show_time = models.TimeField()
    ticket_price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    def __str__(self):
        return (
            f"{self.movie.title} - {self.screen} - "
            f"{self.show_date} {self.show_time}"
        )


class Booking(models.Model):
    STATUS_CHOICES = [
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    show = models.ForeignKey(
        Show,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='confirmed'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking #{self.id} - {self.user.username}"


class BookingSeat(models.Model):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='booking_seats'
    )
    show = models.ForeignKey(
        Show,
        on_delete=models.CASCADE,
        related_name='booking_seats'
    )
    seat = models.ForeignKey(
        Seat,
        on_delete=models.CASCADE,
        related_name='booking_seats'
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.booking} - {self.show} - {self.seat}"
