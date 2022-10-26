from time import sleep
import json
from urllib.request import urlopen
import urllib.parse
import mysql.connector
from datetime import datetime, timedelta
import pprint
import sqlite3

url_obce = 'https://onemocneni-aktualne.mzcr.cz/api/v3/obce?page=1&itemsPerPage=10000&datum%5Bafter%5D=XYZ&datum%5Bbefore%5D=XYZ&apiToken=c54d8c7d54a31d016d8f3c156b98682a'
datum = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
dny = {'xd': 'xd'}
starting_datum = datetime.strptime("2022-02-18", '%Y-%m-%d')
i = 0

try:
    with sqlite3.connect('../sql/database.sqlite') as conn:
        cur = conn.cursor()
        while True:
            datum = (starting_datum + timedelta(days=i)).strftime("%Y-%m-%d")
            url = url_obce.replace('XYZ', datum)
            req = urllib.request.Request(url)
            req.add_header('accept', 'application/json')
            response = urllib.request.urlopen(req)
            obce = json.load(response)

            dny[datum] = {}
            for obec in obce:
                if obec['okres_lau_kod'] not in dny[datum]:
                    dny[datum][obec['okres_lau_kod']] = {}
                    dny[datum][obec['okres_lau_kod']]['nove_pripady'] = obec['nove_pripady']
                    dny[datum][obec['okres_lau_kod']]['aktivni_pripady'] = obec['aktivni_pripady']
                    dny[datum][obec['okres_lau_kod']]['nove_pripady_7'] = obec['nove_pripady_7_dni']
                    dny[datum][obec['okres_lau_kod']]['nove_pripady_14'] = obec['nove_pripady_14_dni']
                    dny[datum][obec['okres_lau_kod']]['nove_pripady_65_vek'] = obec['nove_pripady_65']
                else:
                    dny[datum][obec['okres_lau_kod']]['nove_pripady'] += obec['nove_pripady']
                    dny[datum][obec['okres_lau_kod']]['aktivni_pripady'] += obec['aktivni_pripady']
                    dny[datum][obec['okres_lau_kod']]['nove_pripady_7'] += obec['nove_pripady_7_dni']
                    dny[datum][obec['okres_lau_kod']]['nove_pripady_14'] += obec['nove_pripady_14_dni']
                    dny[datum][obec['okres_lau_kod']]['nove_pripady_65_vek'] += obec['nove_pripady_65']
            # print(dny)
            for okres in dny[datum]:
                cur.execute('INSERT INTO covid_datum_okres (datum, okres, nove_pripady, aktivni_pripady, nove_pripady_7, nove_pripady_14, nove_pripady_65_vek) VALUES (?, ?, ?, ?, ?, ?, ?)', \
                    [
                        datum,
                        okres,
                        dny[datum][okres]['nove_pripady'],
                        dny[datum][okres]['aktivni_pripady'],
                        dny[datum][okres]['nove_pripady_7'],
                        dny[datum][okres]['nove_pripady_14'],
                        dny[datum][okres]['nove_pripady_65_vek'],
                    ])
                conn.commit()
            print(f"Downloaded data from {datum}")
            i += 1

except sqlite3.Error as e:
    print(e)

# with open("test.log", "w") as log_file:
#     pprint.pprint(dny, log_file)

# datum = (datetime.now() - timedelta(days=i+1)).strftime("%Y-%m-%d")
# cur.execute('SELECT * FROM covid_summary ORDER BY id DESC LIMIT 2')
# conn.commit()

# result = {}
# total_count = 0
# req = urllib.request.Request(url_obce)
# req.add_header('accept', 'application/json')
# response = urllib.request.urlopen(req)
# obce = json.load(response)

# for obec in obce:
#     if obec['okres_lau_kod'] not in result:
#         result[obec['okres_lau_kod']] = obec['nove_pripady']
#         total_count += obec['nove_pripady']
#     else:
#         result[obec['okres_lau_kod']] += obec['nove_pripady']
#         total_count += obec['nove_pripady']


# print('Ocekavana hodnota: 219')
# print(total_count)