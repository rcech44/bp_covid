import json
import pprint
from urllib.request import urlopen
import urllib.parse

with urlopen('https://onemocneni-aktualne.mzcr.cz/api/v3/kraj-okres-nakazeni-vyleceni-umrti?apiToken=c54d8c7d54a31d016d8f3c156b98682a&datum[after]=03-10-2022&itemsPerPage=1000') as response:
    data = json.load(response)

# print(len(data['hydra:member']))
# pprint.pprint(data)

# with open("okresy_dict.json", "r") as outfile:
#     okresy = json.load(outfile)

result = []

for okres in data['hydra:member']:
    if okres['okres_lau_kod'] != None:
        num = okres['kumulativni_pocet_nakazenych'] - okres['kumulativni_pocet_vylecenych']
        print(f"{okres['okres_lau_kod']} - {okres['kraj_nuts_kod']} - {num}")
        result.append(num)

print(f"Max: {max(result)}")
print(f"Min: {min(result)}")

# pprint.pprint(data)