from django.shortcuts import render, redirect
from django.http import HttpResponse
import os

# Create your views here.

def index(request):
    return render(request, 'summary.html', {})

def map(request):
    return render(request, 'index_test.html', {})