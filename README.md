This is a demo application demonstrating how to use Haystack with Django and Solr.

The technology stack is: Backbone.js, boostrap.js, Django, Solr, Haystack, sqlite

## Install

### Setup Django Environment

virtualenv --no-site-packages env

source env/bin/activate

easy_install django

pip install django-haystack

pip install pysolr

git clone git://github.com/jgoldberg/haystack-example.git haystack-example

### Create Database

cd haystack-example

python manage.py syncdb

python manage.py tweet_import --clear ../data/tweets

### Solr (MacOS + Homebrew)

(Follow these steps in another terminal window.)

brew install solr

cd haystack-example/conf/solr

solr \`pwd\`

### Index Database

python manage.py rebuild_index

### Start Django

python manage.py runserver

Visit: http://localhost:8000/
