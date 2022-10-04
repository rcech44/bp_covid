import json
from urllib.request import urlopen
import urllib.parse
import pprint

# prepare data
urls = ['https://api.apitalks.store/czso.cz/okres?filter=%7B%22limit%22:30,%22skip%22:0%7D',
        'https://api.apitalks.store/czso.cz/okres?filter=%7B%22limit%22:30,%22skip%22:30%7D',
        'https://api.apitalks.store/czso.cz/okres?filter=%7B%22limit%22:30,%22skip%22:60%7D']
okresy = []

with urlopen('https://gist.githubusercontent.com/carmoreira/deb0b3a5c101d1b2a47600ab225be262/raw/cb139cf24eb933b4694d07fd8bd0e979cca54d28/distictsCzechiaLow.json') as response:
    geo = json.load(response)

# download data
# for url in urls:
#     req = urllib.request.Request(url)
#     req.add_header('x-api-key', 'ZsZkZ2UGVOXiLVHSrcm9abZXfyq7cV14bZkx0xJ3')
#     response = urllib.request.urlopen(req)
#     data = json.load(response)
for okres in geo['features']:
    # print(f"{okres['properties']['NUTS4']} - {okres['properties']['name']}")
    okresy.append([okres['properties']['NUTS4'], okres['properties']['name']])
        # okresy['data'][name] = okres['TEXT']

# process data and remove bad data
# del okresy['data']['CZZZZZ']
# del okresy['data']['Praha']
# okresy.sort()
pprint.pprint(okresy);

# create json
final_json = json.dumps(okresy, ensure_ascii=False).encode('utf8')
with open("web/okresy_data.js", "w+") as outfile:
    outfile.write('data = \'')
    outfile.write(final_json.decode())
    outfile.write('\'')
