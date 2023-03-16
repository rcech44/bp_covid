from django.urls import path
import covid.views

from . import views

urlpatterns = [
    path('', covid.views.root, name='root'),
    path('main/', covid.views.main, name='main'),
    path('main_material/', covid.views.main_material, name='main_material'),
    path('main_material_navbar/', covid.views.main_material_navbar, name='main_material_navbar'),
    path('map/', covid.views.map, name='map'),
    path('map_pip/', covid.views.map_pip, name='map_pip'),
    path('statistics/', covid.views.statistics, name='statistics'),
    path('api/range/days/from=<str:range_from>&to=<str:range_to>', covid.views.api_range_days, name='api_range_days')
]