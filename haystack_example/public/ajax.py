from django.utils import simplejson as json
from django.http import HttpResponse
from tweetfeed.models import User, Tweet
from django.shortcuts import render_to_response, get_object_or_404
from django.core import serializers
from haystack.query import SearchQuerySet

to_json = lambda data : serializers.serialize("json", data)

def ajax_get_user(request, username):
    user = get_object_or_404(User, username=username)
    profile = user.get_profile()

    return HttpResponse(json.dumps(profile.to_dict()))

def ajax_search(request, query):
    results = SearchQuerySet().filter(text=query).order_by('-created_date')[:5]

    tweets = map(lambda _pk : Tweet.objects.get(pk=_pk).to_dict(), [tweet.pk for tweet in results])

    return HttpResponse(json.dumps({'tweets' : tweets }))