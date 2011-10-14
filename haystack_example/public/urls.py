from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template

urlpatterns = patterns('public.views',
    url(r'^$', direct_to_template, {'template': 'public/index.html'}),
)

urlpatterns += patterns('public.ajax',
    url(r'ajax/user/(?P<slug>.+)$', 'ajax_get_user', name="ajax_get_user"),
)