from django.utils import simplejson as json
from django.http import HttpResponse
from tweetfeed.models import TweetUser, Tweet
from django.shortcuts import render_to_response, get_object_or_404
from django.core import serializers
from haystack.query import SearchQuerySet
from haystack.backends.solr_backend import SearchBackend
from haystack.models import SearchResult
import settings

try:
    from pysolr import Solr, SolrError
except ImportError:
    raise Exception("The 'solr' backend requires the installation of 'pysolr'. Please refer to the documentation.")

solr_conn = Solr(settings.HAYSTACK_SOLR_URL, timeout=getattr(settings, 'HAYSTACK_SOLR_TIMEOUT', 10))

to_json = lambda data : serializers.serialize("json", data)

def _search_result_to_dict(result):
    return {
        'message' : result.message,
        'author' : result.author,
        'avatar_url' : result.avatar_url,
        'tweet_id' : result.tweet_id,
    }

def ajax_get_user(request, username):
    results = SearchQuerySet().filter(author=username).order_by('-tweet_id')

    tweets = map(_search_result_to_dict, results)

    return HttpResponse(json.dumps({ 'tweets' : tweets }))

def ajax_search(request, query):
    if query == "":
        results = SearchQuerySet().all().order_by('-created_date')
    else:
        results = SearchQuerySet().filter(text=query).order_by('-tweet_id')

    tweets = map(_search_result_to_dict, results)

    return HttpResponse(json.dumps({ 'tweets' : tweets }))

def ajax_trending(request):
    # Had to do a raw Solr query for this
    # Everyone should +1 https://github.com/toastdriven/django-haystack/pull/360
    params = {
        'facet': 'on',
        'fl': '* score',
        'start': '0',
        'facet.field': 'message',
        'wt': 'json',
        'fq': 'django_ct:(tweetfeed.tweet)',
        'facet.prefix': '#',
        'facet.mincount': '2',
        'facet.sort': 'count',
        'facet.limit': '10',
    }
    try:
        result = solr_conn.search('*:*', **params)
        facets = result.facets['facet_fields']['message']
    except (IOError, SolrError), e:
        facets = []

    return HttpResponse(json.dumps({ 'trends' : facets }))