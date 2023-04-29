from django.urls import path
import covid.views

from . import views

urlpatterns = [
    path('', covid.views.main, name='root'),
    path('main/', covid.views.main, name='main'),
    path('map/', covid.views.map, name='map'),
    path('map_pip/', covid.views.map_pip, name='map_pip'),
    path('api/from=<str:range_from>&to=<str:range_to>', covid.views.api, name='api')
]