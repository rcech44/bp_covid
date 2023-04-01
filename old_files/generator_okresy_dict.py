import json
from urllib.request import urlopen
import urllib.parse
import pprint

# prepare data
urls = ['https://api.apitalks.store/czso.cz/okres?filter=%7B%22limit%22:30,%22skip%22:0%7D',
        'https://api.apitalks.store/czso.cz/okres?filter=%7B%22limit%22:30,%22skip%22:30%7D',
        'https://api.apitalks.store/czso.cz/okres?filter=%7B%22limit%22:30,%22skip%22:60%7D']
okresy = {}

# download data
for url in urls:
    req = urllib.request.Request(url)
    req.add_header('x-api-key', 'ZsZkZ2UGVOXiLVHSrcm9abZXfyq7cV14bZkx0xJ3')
    response = urllib.request.urlopen(req)
    data = json.load(response)
    for okres in data['data']:
        name = okres['TEXT']
        okresy[name] = okres['OKRES_LAU']

# process data and remove bad data
del okresy['Extra-Regio']
# del okresy['Praha']
arr = []
for key, value in okresy.items():
    temp = [key,value]
    arr.append(temp)
arr.sort(key=lambda tup: tup[1])
pprint.pprint(arr);

# create json
final_json = json.dumps(arr, ensure_ascii=False).encode('utf8')
with open("okresy_dict.json", "w") as outfile:
    outfile.write(final_json.decode())
