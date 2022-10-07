import json
import pprint
from urllib.request import urlopen
import urllib.parse
import mysql.connector
import datetime

url = 'https://onemocneni-aktualne.mzcr.cz/api/v3/zakladni-prehled?page=1&itemsPerPage=100&apiToken=c54d8c7d54a31d016d8f3c156b98682a'

req = urllib.request.Request(url)
req.add_header('accept', 'application/json')
response = urllib.request.urlopen(req)
data = json.load(response)

pprint.pprint(data)

datum = datetime.datetime.now()
datum_string = datum.strftime("%Y-%m-%d")

try:
    with mysql.connector.connect(host="remotemysql.com", user="9qMwE320zO", password="gmnNuBYtIX", database="9qMwE320zO") as conn:
        cur = conn.cursor()
        cur.execute('SELECT * FROM covid_summary WHERE datum = %s', [datum_string])
        response = cur.fetchone()
        if response is None:
            cur.execute('INSERT INTO covid_summary (datum, ' \
                'aktivni_pripady, ' \
                'aktualne_hospitalizovani, ' \
                'ockovane_osoby_celkem, ' \
                'ockovane_osoby_vcerejsi_den, ' \
                'ockovane_osoby_vcerejsi_den_datum, ' \
                'potvrzene_pripady_65_celkem, ' \
                'potvrzene_pripady_65_vcerejsi_den, ' \
                'potvrzene_pripady_65_vcerejsi_den_datum, ' \
                'potvrzene_pripady_celkem, ' \
                'potvrzene_pripady_vcerejsi_den, ' \
                'potvrzene_pripady_vcerejsi_den_datum, ' \
                'provedene_antigenni_testy_celkem, ' \
                'provedene_antigenni_testy_vcerejsi_den, ' \
                'provedene_antigenni_testy_vcerejsi_den_datum, ' \
                'provedene_testy_celkem, ' \
                'provedene_testy_vcerejsi_den, ' \
                'provedene_testy_vcerejsi_den_datum, ' \
                'umrti, vykazana_ockovani_celkem, ' \
                'vykazana_ockovani_vcerejsi_den, ' \
                'vykazana_ockovani_vcerejsi_den_datum, ' \
                'vyleceni)')
except:
    print()