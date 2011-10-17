from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin

DATETIME_FORMAT = "%m/%d/%Y %H:%M"

class UserProfile(models.Model):
    user = models.OneToOneField(User)
    
    favorite_movie = models.CharField(max_length=200)
    quote = models.CharField(max_length=200)
    random_fact = models.CharField(max_length=200)

    def to_dict(self):
        return \
        {'username': self.user.username,
         'favorite_movie': self.favorite_movie,
         'random_fact': self.random_fact,
         'tweets' : [tweet.to_dict() for tweet in self.user.tweet_set.all()],
        }

admin.site.register(UserProfile)

class Tweet(models.Model):
    message = models.CharField(max_length=30)
    created_by = models.ForeignKey(User)
    created_date = models.DateTimeField(auto_now_add=True)

    def to_dict(self):
        return \
        {'msg': self.message,
         'created_by' : self.created_by.username,
         'created_date' : self.created_date.strftime(DATETIME_FORMAT)
        }

admin.site.register(Tweet)