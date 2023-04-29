from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from exec.updater import *
from exec.api import *
from exec.cache import *

# Create your views here.

loaded_cache = False

def main(request):
    Updater.update_data()
    return render(request, 'index.html', {'data_covid': {}})

def map(request):
    return render(request, 'map.html', {})

def map_pip(request):
    return render(request, 'map_pip.html', {})

def root(request):
    return redirect('main')

def api(request, range_from, range_to):
    x_forwarded_for_header = request.META.get('HTTP_X_FORWARDED_FOR')

    if x_forwarded_for_header:
        ip = x_forwarded_for_header.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    if ClientAPI.allow_request(ip) == False:
        # Return 429 - Too many requests
        print(f"[REQUEST-API] Declined incoming request from {ip}")
        return HttpResponse({}, status=429)
    
    print(f"[REQUEST-API] Accepted incoming request from {ip}")
    data = ClientAPI.get_data(range_from, range_to)
    if data == "error":
        return HttpResponse({}, status=400)
    return JsonResponse(data)