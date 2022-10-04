import json
import pprint
from urllib.request import urlopen
import urllib.parse

with urlopen('https://onemocneni-aktualne.mzcr.cz/api/v3/kraj-okres-nakazeni-vyleceni-umrti?apiToken=c54d8c7d54a31d016d8f3c156b98682a&datum[after]=18.9.2022') as response:
    data = json.load(response)

with open("okresy_dict.json", "r") as outfile:
    okresy = json.load(outfile)

for okres in data['hydra:member']:
    if okres['okres_lau_kod'] in okresy['data']:
        print(f"{okresy['data'][okres['okres_lau_kod']]}: {okres['kumulativni_pocet_nakazenych']}")

# pprint.pprint(data)