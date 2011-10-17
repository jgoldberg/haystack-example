from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template, redirect_to

urlpatterns = patterns('public.ajax',
    url(r'ajax/user/(?P<username>.+)$', 'ajax_get_user', name="ajax_get_user"),
)

urlpatterns += patterns('public.views',
    url(r'^$', direct_to_template, {'template': 'public/index.html'}),
    url(r'^user/(?P<slug>.+)$', direct_to_template, {'template': 'public/index.html'}),
)
