from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(User)

    favorite_movie = models.CharField(max_length=200)

class Tweet(models.Model):
    message = models.CharField(max_length=30)
    created_by = models.ForeignKey(User)
    created_date = models.DateTimeField(auto_now_add=True)
