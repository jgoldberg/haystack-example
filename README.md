## Install

### Setup Django Environment

virtualenv --no-site-packages env

source env/bin/activate

easy_install django

pip install django-haystack

pip install pysolr

git clone https://jgoldberg@github.com/jgoldberg/haystack-example.git haystack-example

### Create Database

cd haystack-example

python manage.py syncdb

python manage.py tweet_import --clear ../data/tweets

### Solr (MacOS + Homebrew)

(Follow these steps in another terminal window.)

brew install solr

cd haystack-example/conf/solr

solr `pwd`

### Index Database

python manage.py rebuild_index

### Start Django

python manage.py runserver

http://localhost:8000/
