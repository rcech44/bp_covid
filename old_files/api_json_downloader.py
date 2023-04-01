import json
import pprint
from urllib.request import urlopen
import urllib.parse

# kraj - okres - nakazeni, vyleceni, umrti = https://onemocneni-aktualne.mzcr.cz/api/v3/kraj-okres-nakazeni-vyleceni-umrti?apiToken=c54d8c7d54a31d016d8f3c156b98682a&datum[after]=18.9.2022
# zakladni prehled = https://onemocneni-aktualne.mzcr.cz/api/v3/zakladni-prehled/2022-09-19?apiToken=c54d8c7d54a31d016d8f3c156b98682a
# nakazeni - vyleceni - umrti - testy = https://onemocneni-aktualne.mzcr.cz/api/v3/nakazeni-vyleceni-umrti-testy/2022-09-18?apiToken=c54d8c7d54a31d016d8f3c156b98682a


with urlopen('https://onemocneni-aktualne.mzcr.cz/api/v3/kraj-okres-nakazeni-vyleceni-umrti?apiToken=c54d8c7d54a31d016d8f3c156b98682a&datum[after]=18.9.2022') as response:
    data = json.load(response)

# url = 'https://api.apitalks.store/czso.cz/okres'

# req = urllib.request.Request(url)
# req.add_header('x-api-key', 'ZsZkZ2UGVOXiLVHSrcm9abZXfyq7cV14bZkx0xJ3')
# response = urllib.request.urlopen(req)
# data = json.load(response)

pprint.pprint(data)