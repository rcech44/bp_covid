from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import os
import sys
from exec.functions import *
from exec.api import *
from exec.cache import *

# Create your views here.

cache_map = {}
cache_summary = {}
loaded_cache = False

def old_version(request):
    global cache_map
    global cache_summary
    global loaded_cache

    if checkUpToDate() is False:
        loaded_cache = False

    if (loaded_cache == False):
        new_data = thirty_day_map()
        data = get_today_summary()
        loaded_cache = True
        cache_map = new_data
        cache_summary = data
        print('Loading without cache')
    else:
        new_data = cache_map
        data = cache_summary
        print('Loading cache')

    data['yesterday_date_text'] = "Dne " + (datetime.now() - timedelta(days=1)).strftime("%d.%m.%Y") + ":"
    data['yesterday_date_text_testy'] = "Dne " + (datetime.now() - timedelta(days=1)).strftime("%d.%m.%Y") + " poz.:"
    return render(request, 'main.html', {'nakazeni': data['nakazeni'],
                                            'vyleceni': data['vyleceni'],
                                            'umrti': data['umrti'],
                                            'ovlivneno': data['pocet_pcr_testu'],
                                            'rozdil_nakazeni': data['rozdil_nakazeni'],
                                            'rozdil_vyleceni': data['rozdil_vyleceni'],
                                            'rozdil_umrti': data['rozdil_umrti'],
                                            'rozdil_ovlivneno': data['pocet_pcr_testu_pozitivni'],
                                            'yesterday_date_text': data['yesterday_date_text'],
                                            'yesterday_date_text_testy': data['yesterday_date_text_testy'],
                                            'data_covid': new_data
                                            })

def main(request):
    checkUpToDate()
    return render(request, 'main.html', {'data_covid': {}})

def main_material(request):
    checkUpToDate()
    return render(request, 'main_material.html', {'data_covid': {}})

def main_material_navbar(request):
    checkUpToDate()
    return render(request, 'main_material_navbar.html', {'data_covid': {}})

def map(request):
    return render(request, 'map.html', {})

def map_pip(request):
    return render(request, 'map_pip.html', {})

def statistics(request):
    graph = thirty_day_summary_graph()
    return render(request, 'statistics.html', {'labels': graph['days'], 'data': graph['values'], 'colors': graph['colors'], 'colors_border': graph['colors_border']})

def root(request):
    return redirect('main')

def api_range_days(request, range_from, range_to):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')

    # https://stackoverflow.com/questions/4581789/how-do-i-get-user-ip-address-in-django
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    # if ip_allow_request(ip) == False:
    #     print(f"[REQUEST-API] Declined incoming request from {ip}")
    #     # Return 429 - Too many requests
    #     return HttpResponse({}, status=429)
    
    print(f"[REQUEST-API] Accepted incoming request from {ip}")
    data = getData(range_from, range_to)
    if data == "error":
        return HttpResponse({}, status=400)
    return JsonResponse(data)