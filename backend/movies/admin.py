from django.contrib import admin
from .models import Movie, Theatre, Screen, Seat, Show, Booking, BookingSeat

admin.site.register(Movie)
admin.site.register(Theatre)
admin.site.register(Screen)
admin.site.register(Seat)
admin.site.register(Show)
admin.site.register(Booking)
admin.site.register(BookingSeat)