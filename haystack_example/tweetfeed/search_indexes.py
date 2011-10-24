from settings import HAYSTACK_USE_REALTIME_SEARCH
from haystack import site
from haystack import indexes
from models import Tweet

BaseSearch = indexes.SearchIndex
if HAYSTACK_USE_REALTIME_SEARCH:
    BaseSearch = indexes.RealTimeSearchIndex

class TweetIndex(BaseSearch):
    text = indexes.CharField(document=True, use_template=True)
    message = indexes.CharField(model_attr='message')
    author = indexes.CharField(model_attr='created_by__username')
    tweet_id = indexes.CharField(model_attr='tweet_id')
    avatar_url = indexes.CharField(model_attr='created_by__avatar_url')

    def index_queryset(self):
        return Tweet.objects.all()

site.register(Tweet, TweetIndex)