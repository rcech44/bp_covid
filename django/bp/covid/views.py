from django.shortcuts import render, redirect
from django.http import HttpResponse
import os
import sys
from exec.functions import *

# Create your views here.

cache_map = {}
cache_summary = {}
loaded_cache = False

def index(request):
    global cache
    global loaded_cache
    if (loaded_cache == False):
        new_data = thirty_day_map()
        loaded_cache = True
        cache = new_data
        print('Loading without cache')
    else:
        new_data = cache
        print('Loading cache')
    print(sys.getsizeof(new_data))
    data = get_today_summary()
    data['yesterday_date_text'] = "Dne " + (datetime.now() - timedelta(days=1)).strftime("%d.%m.%Y") + ":"
    return render(request, 'summary.html', {'nakazeni': data['nakazeni'],
                                            'vyleceni': data['vyleceni'],
                                            'umrti': data['umrti'],
                                            'ovlivneno': data['ovlivneno'],
                                            'rozdil_nakazeni': data['rozdil_nakazeni'],
                                            'rozdil_vyleceni': data['rozdil_vyleceni'],
                                            'rozdil_umrti': data['rozdil_umrti'],
                                            'rozdil_ovlivneno': data['rozdil_ovlivneno'],
                                            'yesterday_date_text': data['yesterday_date_text'],
                                            'data_covid': new_data
                                            })

def index2(request):
    global cache_map
    global cache_summary
    global loaded_cache
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
    data['yesterday_date_text_testy'] = "Dne " + (datetime.now() - timedelta(days=1)).strftime("%d.%m.%Y") + " poz. PCR testů:"
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

def map(request):
    return render(request, 'map.html', {})

def statistics(request):
    graph = thirty_day_summary_graph()
    return render(request, 'statistics.html', {'labels': graph['days'], 'data': graph['values'], 'colors': graph['colors'], 'colors_border': graph['colors_border']})