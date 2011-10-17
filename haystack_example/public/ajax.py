from django.utils import simplejson as json
from django.http import HttpResponse
from tweetfeed.models import User
from django.shortcuts import render_to_response, get_object_or_404
from django.core import serializers

to_json = lambda data : serializers.serialize("json", data)

def ajax_get_user(request, username):
    user = get_object_or_404(User, username=username)
    profile = user.get_profile()

    return HttpResponse(json.dumps(profile.to_dict()))