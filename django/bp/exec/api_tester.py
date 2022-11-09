from time import sleep
import json
from urllib.request import urlopen
import urllib.parse
import mysql.connector
from datetime import datetime, timedelta
import pprint
import sqlite3

import urllib.parse
import urllib.request

# url = 'https://api.apitalks.store/czso.cz/obec-a-vojensky-ujezd'

# req = urllib.request.Request(url)
# req.add_header('x-api-key', 'ZsZkZ2UGVOXiLVHSrcm9abZXfyq7cV14bZkx0xJ3')
# req.add_header('Content-Type', 'application/json')
# response = urllib.request.urlopen(req)
# data = json.load(response)

# pprint.pprint(data)

# url_obce = 'https://onemocneni-aktualne.mzcr.cz/api/v3/obce?page=1&itemsPerPage=10000&datum%5Bafter%5D=XYZ&datum%5Bbefore%5D=XYZ&apiToken=c54d8c7d54a31d016d8f3c156b98682a'
# datum = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
# dny = {'xd': 'xd'}
# starting_datum = datetime.strptime("2022-02-18", '%Y-%m-%d')
# i = 0



# OCKOVANI DOWNLOADER 1
# url = "https://onemocneni-aktualne.mzcr.cz/api/v3/ockovani-geografie?page=1&itemsPerPage=10000&datum%5Bbefore%5D=XYZ&datum%5Bafter%5D=XYZ&apiToken=c54d8c7d54a31d016d8f3c156b98682a"
# data = {}
# starting_datum = datetime.strptime("2020-12-27", '%Y-%m-%d')
# datum_i = 0
# celkem = 0
# davka_1_celkem = 0
# davka_2_celkem = 0
# davka_3_celkem = 0
# davka_4_celkem = 0

# try:
#     with sqlite3.connect('../sql/database.sqlite') as conn:
#         while True:
#             cur = conn.cursor()
#             # curr_datum = starting_datum.strftime('%Y-%m-%d')
#             curr_datum = (starting_datum + timedelta(days=datum_i)).strftime('%Y-%m-%d')
#             url_edit = url.replace('XYZ', curr_datum)
#             datum_i += 1
#             req = urllib.request.Request(url_edit)
#             req.add_header('accept', 'application/json')
#             response = urllib.request.urlopen(req)
#             ockovani_den = json.load(response)
#             data[starting_datum] = {}
#             for ockovani_info in ockovani_den:
#                 orp_kod = ockovani_info['orp_bydliste_kod']
#                 poradi_davky = ockovani_info['poradi_davky']
#                 pocet_davek = ockovani_info['pocet_davek']
#                 pocet_davek_den_query = "davka_" + str(pocet_davek) + "_den"
#                 cur.execute('SELECT cislo_okres FROM orp_okres_ciselnik WHERE cislo_orp = ?', [orp_kod])
#                 celkem += pocet_davek
#                 response = cur.fetchone()
#                 if response is None:
#                     continue
#                 okres_kod = response[0]

#                 cur.execute('SELECT * FROM ockovani_datum_okres WHERE datum = ? AND okres = ?', [curr_datum, okres_kod])
#                 response = cur.fetchone()
#                 if response is None:
#                     cur.execute('INSERT INTO ockovani_datum_okres (datum, okres, davka_1_den, davka_1_doposud, davka_2_den, davka_2_doposud, davka_3_den, davka_3_doposud, davka_4_den, davka_4_doposud, davka_celkem_den, davka_celkem_doposud) VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)', [curr_datum, okres_kod])
#                     conn.commit()

#                 if poradi_davky == 1:
#                     davka_1_celkem += pocet_davek
#                     cur.execute('UPDATE ockovani_datum_okres SET davka_1_den = davka_1_den + ? WHERE datum = ? AND okres = ?', [pocet_davek, curr_datum, okres_kod])
#                 if poradi_davky == 2:
#                     davka_2_celkem += pocet_davek
#                     cur.execute('UPDATE ockovani_datum_okres SET davka_2_den = davka_2_den + ? WHERE datum = ? AND okres = ?', [pocet_davek, curr_datum, okres_kod])
#                 if poradi_davky == 3:
#                     davka_3_celkem += pocet_davek
#                     cur.execute('UPDATE ockovani_datum_okres SET davka_3_den = davka_3_den + ? WHERE datum = ? AND okres = ?', [pocet_davek, curr_datum, okres_kod])
#                 if poradi_davky == 4:
#                     davka_4_celkem += pocet_davek
#                     cur.execute('UPDATE ockovani_datum_okres SET davka_4_den = davka_4_den + ? WHERE datum = ? AND okres = ?', [pocet_davek, curr_datum, okres_kod])

#                 conn.commit()
#             print(f"Processed {curr_datum}, total values: {celkem}")

# except sqlite3.Error as e:
#     print(e)


# OCKOVANI DOWNLOADER 2
url = "https://onemocneni-aktualne.mzcr.cz/api/v3/ockovani-geografie?page=1&itemsPerPage=1&datum%5Bbefore%5D=XYZ&datum%5Bafter%5D=XYZ&apiToken=c54d8c7d54a31d016d8f3c156b98682a"
okresy = {}
datum_i = 0
celkem = 0

try:
    with sqlite3.connect('../sql/database.sqlite') as conn:
        cur = conn.cursor()
        start_datum = datetime.strptime("2020-12-27", '%Y-%m-%d')
        datumy = []
        curr_datum = ''
        while curr_datum != '2022-11-08':
            curr_datum = (start_datum + timedelta(days=datum_i)).strftime('%Y-%m-%d')
            datum_i += 1
            datumy.append(curr_datum)
        for datum in datumy:
            cur.execute('SELECT okres, davka_1_den, davka_2_den, davka_3_den, davka_4_den FROM ockovani_datum_okres WHERE datum = ?', [datum])
            response = cur.fetchall()
            if response is not None:
                for row in response:
                    okres = row[0]
                    davka_1 = row[1]
                    davka_2 = row[2]
                    davka_3 = row[3]
                    davka_4 = row[4]
                    celkem_den = 0
                    if okres not in okresy:
                        okresy[okres] = {}
                        okresy[okres]['1'] = 0
                        okresy[okres]['2'] = 0
                        okresy[okres]['3'] = 0
                        okresy[okres]['4'] = 0
                        okresy[okres]['celkem'] = 0
                    okresy[okres]['1'] += davka_1
                    okresy[okres]['2'] += davka_2
                    okresy[okres]['3'] += davka_3
                    okresy[okres]['4'] += davka_4
                    okresy[okres]['celkem'] += (davka_1 + davka_2 + davka_3 + davka_4)
                    celkem_den = davka_1 + davka_2 + davka_3 + davka_4
                    cur.execute('UPDATE ockovani_datum_okres SET davka_1_doposud = ? WHERE datum = ? AND okres = ?', [okresy[okres]['1'], datum, okres])
                    cur.execute('UPDATE ockovani_datum_okres SET davka_2_doposud = ? WHERE datum = ? AND okres = ?', [okresy[okres]['2'], datum, okres])
                    cur.execute('UPDATE ockovani_datum_okres SET davka_3_doposud = ? WHERE datum = ? AND okres = ?', [okresy[okres]['3'], datum, okres])
                    cur.execute('UPDATE ockovani_datum_okres SET davka_4_doposud = ? WHERE datum = ? AND okres = ?', [okresy[okres]['4'], datum, okres])
                    cur.execute('UPDATE ockovani_datum_okres SET davka_celkem_doposud = ? WHERE datum = ? AND okres = ?', [okresy[okres]['celkem'], datum, okres])
                    cur.execute('UPDATE ockovani_datum_okres SET davka_celkem_den = ? WHERE datum = ? AND okres = ?', [celkem_den, datum, okres])
                    conn.commit()
            print(f"Processed {datum}")


except sqlite3.Error as e:
    print(e)



# try:
#     with sqlite3.connect('../sql/database.sqlite') as conn:
#         cur = conn.cursor()
#         while True:
#             datum = (starting_datum + timedelta(days=i)).strftime("%Y-%m-%d")
#             url = url_obce.replace('XYZ', datum)
#             req = urllib.request.Request(url)
#             req.add_header('accept', 'application/json')
#             response = urllib.request.urlopen(req)
#             obce = json.load(response)

#             dny[datum] = {}
#             for obec in obce:
#                 if obec['okres_lau_kod'] not in dny[datum]:
#                     dny[datum][obec['okres_lau_kod']] = {}
#                     dny[datum][obec['okres_lau_kod']]['nove_pripady'] = obec['nove_pripady']
#                     dny[datum][obec['okres_lau_kod']]['aktivni_pripady'] = obec['aktivni_pripady']
#                     dny[datum][obec['okres_lau_kod']]['nove_pripady_7'] = obec['nove_pripady_7_dni']
#                     dny[datum][obec['okres_lau_kod']]['nove_pripady_14'] = obec['nove_pripady_14_dni']
#                     dny[datum][obec['okres_lau_kod']]['nove_pripady_65_vek'] = obec['nove_pripady_65']
#                 else:
#                     dny[datum][obec['okres_lau_kod']]['nove_pripady'] += obec['nove_pripady']
#                     dny[datum][obec['okres_lau_kod']]['aktivni_pripady'] += obec['aktivni_pripady']
#                     dny[datum][obec['okres_lau_kod']]['nove_pripady_7'] += obec['nove_pripady_7_dni']
#                     dny[datum][obec['okres_lau_kod']]['nove_pripady_14'] += obec['nove_pripady_14_dni']
#                     dny[datum][obec['okres_lau_kod']]['nove_pripady_65_vek'] += obec['nove_pripady_65']
#             # print(dny)
#             for okres in dny[datum]:
#                 cur.execute('INSERT INTO covid_datum_okres (datum, okres, nove_pripady, aktivni_pripady, nove_pripady_7, nove_pripady_14, nove_pripady_65_vek) VALUES (?, ?, ?, ?, ?, ?, ?)', \
#                     [
#                         datum,
#                         okres,
#                         dny[datum][okres]['nove_pripady'],
#                         dny[datum][okres]['aktivni_pripady'],
#                         dny[datum][okres]['nove_pripady_7'],
#                         dny[datum][okres]['nove_pripady_14'],
#                         dny[datum][okres]['nove_pripady_65_vek'],
#                     ])
#                 conn.commit()
#             print(f"Downloaded data from {datum}")
#             i += 1

# except sqlite3.Error as e:
#     print(e)

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


