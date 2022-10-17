from time import sleep
import json
from urllib.request import urlopen
import urllib.parse
import mysql.connector
from datetime import datetime, timedelta

datum_now = datetime.now().strftime("%Y-%m-%d")

url_obce = 'https://onemocneni-aktualne.mzcr.cz/api/v3/obce?page=1&itemsPerPage=10000&datum%5Bafter%5D=2022-10-11&datum%5Bbefore%5D=2022-10-11&apiToken=c54d8c7d54a31d016d8f3c156b98682a'

result = {}
total_count = 0
req = urllib.request.Request(url_obce)
req.add_header('accept', 'application/json')
response = urllib.request.urlopen(req)
obce = json.load(response)

for obec in obce:
    if obec['okres_lau_kod'] not in result:
        result[obec['okres_lau_kod']] = obec['nove_pripady']
        total_count += obec['nove_pripady']
    else:
        result[obec['okres_lau_kod']] += obec['nove_pripady']
        total_count += obec['nove_pripady']



print('Ocekavana hodnota: 219')
print(total_count)