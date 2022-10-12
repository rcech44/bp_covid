from django.shortcuts import render, redirect
from django.http import HttpResponse
import os
from covid.functions import *

# Create your views here.

def index(request):
    data = get_today_summary()
    data['yesterday_date_text'] = "Dne " + (datetime.now() - timedelta(days=1)).strftime("%d.%m.%Y") + ":"
    return render(request, 'summary.html', data)

def map(request):
    return render(request, 'map.html', {})

def statistics(request):
    return render(request, 'statistics.html', {})