from django.db import models
from django.contrib import admin

DATETIME_FORMAT = "%m/%d/%Y %H:%M"

class TweetUser(models.Model):
    username = models.CharField(max_length=200)
    avatar_url = models.URLField()

    def __str__(self):
        return self.username

    def to_dict(self):
        return \
        {'username': self.username,
         'avatar_url': self.avatar_url,
         'tweets' : [tweet.to_dict() for tweet in self.tweet_set.all()],
        }

admin.site.register(TweetUser)

class Tweet(models.Model):
    message = models.CharField(max_length=30)
    created_by = models.ForeignKey('TweetUser')
    created_date = models.DateTimeField(auto_now_add=True)
    tweet_id = models.CharField(max_length=30)

    def to_dict(self):
        return \
        {'msg': self.message,
         'created_by' : self.created_by.username,
         'created_date' : self.created_date.strftime(DATETIME_FORMAT),
         'tweet_id' : self.tweet_id,
        }

    def __str__(self):
        return '%s: %s' % (self.created_by.username, self.message[:50])

admin.site.register(Tweet)