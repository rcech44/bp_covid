import json
from pprint import pprint
from urllib.request import urlopen

with urlopen('https://gist.githubusercontent.com/carmoreira/deb0b3a5c101d1b2a47600ab225be262/raw/cb139cf24eb933b4694d07fd8bd0e979cca54d28/distictsCzechiaLow.json') as response:
    geo = json.load(response)
    # pprint(geo)
    for okres in geo['features']:
        print(f"{okres['properties']['NUTS4']} - {okres['properties']['name']}")