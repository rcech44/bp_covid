"""bp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import include, path
import covid.views


urlpatterns = [
    path('', covid.views.root, name='root'),
    path('admin/', admin.site.urls, name='admin'),
    path('main/', covid.views.main, name='main'),
    path('main2/', covid.views.main2, name='main2'),
    path('map/', covid.views.map, name='map'),
    path('statistics/', covid.views.statistics, name='statistics'),
    path('api/range/days/from=<str:range_from>&to=<str:range_to>&type=<str:type>', covid.views.api_range_days, name='api_range_days')
]
