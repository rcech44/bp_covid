import math
import pprint
from time import sleep
import json
from urllib.request import urlopen
import urllib.parse
import mysql.connector
from datetime import datetime, timedelta
import random
import os
import sqlite3
import numpy as np

# import pprint

# data = {}

# with open('obce.csv') as f:
#     lines = f.readlines()
#     for line in lines:
#         splitted = line.split(';')
#         data[splitted[0]] = {}
#         data[splitted[0]]['nazev_obce'] = splitted[1]
#         data[splitted[0]]['cislo_okresu'] = splitted[2]
#         data[splitted[0]]['nazev_okresu'] = splitted[3]

# pprint.pprint(data)

# url_obce = 'https://onemocneni-aktualne.mzcr.cz/api/v3/obce?page=1&itemsPerPage=10000&datum%5Bafter%5D=XYZ&datum%5Bbefore%5D=XYZ&apiToken=c54d8c7d54a31d016d8f3c156b98682a'
# url_kraj = 'https://onemocneni-aktualne.mzcr.cz/api/v3/kraj-okres-nakazeni-vyleceni-umrti?page=1&itemsPerPage=100&datum%5Bbefore%5D=2022-11-25&datum%5Bafter%5D=2022-11-25&apiToken=c54d8c7d54a31d016d8f3c156b98682a'
# current_url = url_obce.replace('XYZ', '2023-01-09')
# req = urllib.request.Request(current_url)
# req.add_header('accept', 'application/json')
# response = urllib.request.urlopen(req)
# obce = json.load(response)
# nakazeni = 0
# for obec in obce:
#     if obec['okres_nazev'] == 'Blansko':
#         nakazeni += obec['aktivni_pripady']

# print(str(nakazeni))

dic = {
    '2022-10-10': {
        'max': 10,
        'min': 0
    },
    '2022-10-11': {
        'max': 20,
        'min': 1
    },
    '2022-10-12': {
        'max': 30,
        'min': 2
    },
    '2022-10-13': {
        'max': 40,
        'min': 3
    }
}

max_val = max(int(d['max']) for d in dic.values())
print(max_val)