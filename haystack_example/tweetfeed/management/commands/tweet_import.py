from django.core.management.base import BaseCommand, CommandError
from django.utils import simplejson as json
from optparse import make_option

class Command(BaseCommand):
    args = '<file>'
    help = 'Import a JSON dump of Tweets'
    option_list = BaseCommand.option_list + (
        make_option('--clear',
                action='store_true',
                dest='clear',
                default=False,
                help='Clear database before data import'),
        )

    def handle(self, *args, **options):
        if len(args) < 1:
            self.stdout.write('Error: Incorrect # of arguments\n')
            return

        users = {}

        f = open(args[0], 'r')

        user_count = 0
        tweet_count = 0

        from tweetfeed.models import Tweet, TweetUser

        if options['clear']:
            Tweet.objects.all().delete()
            TweetUser.objects.all().delete()

        try:
            data = json.load(f)

            for tweet in data[u'results']:
                username = tweet[u'from_user']
                text = tweet[u'text']
                tweet_id = tweet[u'id']
                
                if username not in users:
                    user = TweetUser()
                    user.username = username
                    user.save()
                    user_count = user_count + 1
                    users[username] = user
                else:
                    user = users[username]

                tweet = Tweet()
                tweet.message = text
                tweet.created_by = user
                tweet.created_date = tweet_id
                tweet.save()

                tweet_count = tweet_count + 1

        finally:
            f.close()
        
        self.stdout.write('Import Successful: Processed %d tweets and %d users.\n' % (tweet_count, user_count))
  