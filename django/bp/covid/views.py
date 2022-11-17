from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
import os
import sys
from exec.functions import *
from exec.api import *

# Create your views here.

cache_map = {}
cache_summary = {}
loaded_cache = False

def main(request):
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

def main2(request):
    return render(request, 'main2.html', {'data_covid': {}})

def map(request):
    return render(request, 'map.html', {})

def statistics(request):
    graph = thirty_day_summary_graph()
    return render(request, 'statistics.html', {'labels': graph['days'], 'data': graph['values'], 'colors': graph['colors'], 'colors_border': graph['colors_border']})

def root(request):
    return redirect('main')

def api_range_days(request, range_from, range_to, type):
    data = getData(range_from, range_to, type)
    return JsonResponse(data, safe=False)