from django.utils import simplejson as json
from django.http import HttpResponse

def ajax_get_user(request, slug):
    return HttpResponse(json.dumps({'success': True}))