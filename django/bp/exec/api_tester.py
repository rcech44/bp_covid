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
# url = "https://onemocneni-aktualne.mzcr.cz/api/v3/ockovani-geografie?page=1&itemsPerPage=10000&datum%5Bbefore%5D=XYZ&datum%5Bafter%5D=XYZ&orp_bydliste_kod=1000&apiToken=c54d8c7d54a31d016d8f3c156b98682a"
# data = {}
# starting_datum = datetime.strptime("2021-02-12", '%Y-%m-%d')
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
#                 orp_nazev = ockovani_info['orp_bydliste']
#                 poradi_davky = ockovani_info['poradi_davky']
#                 pocet_davek = ockovani_info['pocet_davek']
#                 # pocet_davek_den_query = "davka_" + str(pocet_davek) + "_den"
#                 # cur.execute('SELECT cislo_okres FROM orp_okres_ciselnik WHERE cislo_orp = ?', [orp_kod])
#                 celkem += pocet_davek
#                 # response = cur.fetchone()
#                     # print(f"What is this? Kod: {orp_kod} Nazev: {orp_nazev}")
#                 okres_kod = "CZ0100"

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
#                 print(f"Processed {curr_datum}, total values: {celkem}")

# except sqlite3.Error as e:
#     print(e)

# UMRTI DOWNLOADER 1
# url = 'https://onemocneni-aktualne.mzcr.cz/api/v3/umrti?page=1&itemsPerPage=10000&datum%5Bbefore%5D=XYZ&datum%5Bafter%5D=XYZ&apiToken=c54d8c7d54a31d016d8f3c156b98682a'
# okresy = {"CZ0100": 0, "CZ0201": 0, "CZ0202": 0,"CZ0203": 0,"CZ0204": 0,"CZ0205": 0,"CZ0206": 0,"CZ0207": 0,"CZ0208": 0,"CZ0209": 0,"CZ020A": 0, "CZ020B": 0,"CZ020C": 0,"CZ0311": 0,"CZ0312": 0,"CZ0313": 0,"CZ0314": 0,"CZ0315": 0,"CZ0316": 0,"CZ0317": 0,"CZ0321": 0,"CZ0322": 0,"CZ0323": 0,"CZ0324": 0,"CZ0325": 0,"CZ0326": 0,"CZ0327": 0,"CZ0411": 0,"CZ0412": 0,"CZ0413": 0,"CZ0421": 0,"CZ0422": 0,"CZ0423": 0,"CZ0424": 0,"CZ0425": 0,"CZ0426": 0,"CZ0427": 0,"CZ0511": 0,"CZ0512": 0,"CZ0513": 0,"CZ0514": 0,"CZ0521": 0,"CZ0522": 0,"CZ0523": 0,"CZ0524": 0,"CZ0525": 0,"CZ0531": 0,"CZ0532": 0,"CZ0533": 0,"CZ0534": 0,"CZ0631": 0,"CZ0632": 0,"CZ0633": 0,"CZ0634": 0,"CZ0635": 0,"CZ0641": 0,"CZ0642": 0,"CZ0643": 0,"CZ0644": 0,"CZ0645": 0,"CZ0646": 0,"CZ0647": 0,"CZ0711": 0,"CZ0712": 0,"CZ0713": 0,"CZ0714": 0,"CZ0715": 0,"CZ0721": 0,"CZ0722": 0,"CZ0723": 0,"CZ0724": 0,"CZ0801": 0,"CZ0802": 0,"CZ0803": 0,"CZ0804": 0,"CZ0805": 0,"CZ0806": 0}
# try:
#     with sqlite3.connect('../sql/database.sqlite') as conn:
#         cur = conn.cursor()
#         cur.execute('SELECT id, datum FROM umrti_datum_okres ORDER BY id DESC LIMIT 1')
#         response = cur.fetchone()
#         last_database_date = datetime.strptime(response[1], '%Y-%m-%d')
#         last_database_date_str = response[1]
#         cur.execute('SELECT id, datum, okres, umrti_doposud FROM umrti_datum_okres WHERE datum = ? ORDER BY id DESC', [last_database_date_str])
#         response = cur.fetchall()
#         start_date = (last_database_date + timedelta(days=1))
#         today_date = datetime.now()
#         yesterday_date = datetime.now() - timedelta(days=1)
#         current_date = start_date
#         i = 0

#         # Fill previous sums
#         for row in response:
#             okresy[row[2]] = row[3]

#         while True:
#             current_date = (start_date + timedelta(days=i))
#             current_date_text = current_date.strftime('%Y-%m-%d')
#             if current_date_text == today_date.strftime('%Y-%m-%d'):
#                 break
#             i += 1

#             # Get data from MZCR
#             url_edit = url.replace('XYZ', current_date_text)
#             req = urllib.request.Request(url_edit)
#             req.add_header('accept', 'application/json')
#             response = urllib.request.urlopen(req)
#             json_okresy = json.load(response)

#             # Add blank record to database for each record
#             for okres in okresy:
#                 cur.execute('INSERT INTO umrti_datum_okres (datum, okres, umrti_den, umrti_doposud) VALUES (?, ?, 0, ?)', [current_date_text, okres, okresy[okres]])
#                 conn.commit()

#             for record in json_okresy:
#                 okres = record['okres_lau_kod']
#                 okresy[okres] += 1
#                 cur.execute('UPDATE umrti_datum_okres SET umrti_den = umrti_den + 1 WHERE datum = ? AND okres = ?', [current_date_text, okres])
#                 cur.execute('UPDATE umrti_datum_okres SET umrti_doposud = umrti_doposud + 1 WHERE datum = ? AND okres = ?', [current_date_text, okres])
#                 conn.commit()

#             print(f"[DATABASE] Processed deaths at {current_date_text}")
        


# except sqlite3.Error as e:
#     print(e)
#     exit(0)


# TESTOVANI DOWNLOADER 1
url = 'https://onemocneni-aktualne.mzcr.cz/api/v3/kraj-okres-testy?page=1&itemsPerPage=100&datum%5Bbefore%5D=XYZ&datum%5Bafter%5D=XYZ&apiToken=c54d8c7d54a31d016d8f3c156b98682a'
okresy = {"CZ0100": 0, "CZ0201": 0, "CZ0202": 0,"CZ0203": 0,"CZ0204": 0,"CZ0205": 0,"CZ0206": 0,"CZ0207": 0,"CZ0208": 0,"CZ0209": 0,"CZ020A": 0, "CZ020B": 0,"CZ020C": 0,"CZ0311": 0,"CZ0312": 0,"CZ0313": 0,"CZ0314": 0,"CZ0315": 0,"CZ0316": 0,"CZ0317": 0,"CZ0321": 0,"CZ0322": 0,"CZ0323": 0,"CZ0324": 0,"CZ0325": 0,"CZ0326": 0,"CZ0327": 0,"CZ0411": 0,"CZ0412": 0,"CZ0413": 0,"CZ0421": 0,"CZ0422": 0,"CZ0423": 0,"CZ0424": 0,"CZ0425": 0,"CZ0426": 0,"CZ0427": 0,"CZ0511": 0,"CZ0512": 0,"CZ0513": 0,"CZ0514": 0,"CZ0521": 0,"CZ0522": 0,"CZ0523": 0,"CZ0524": 0,"CZ0525": 0,"CZ0531": 0,"CZ0532": 0,"CZ0533": 0,"CZ0534": 0,"CZ0631": 0,"CZ0632": 0,"CZ0633": 0,"CZ0634": 0,"CZ0635": 0,"CZ0641": 0,"CZ0642": 0,"CZ0643": 0,"CZ0644": 0,"CZ0645": 0,"CZ0646": 0,"CZ0647": 0,"CZ0711": 0,"CZ0712": 0,"CZ0713": 0,"CZ0714": 0,"CZ0715": 0,"CZ0721": 0,"CZ0722": 0,"CZ0723": 0,"CZ0724": 0,"CZ0801": 0,"CZ0802": 0,"CZ0803": 0,"CZ0804": 0,"CZ0805": 0,"CZ0806": 0}
try:
    with sqlite3.connect('../sql/database.sqlite') as conn:
        cur = conn.cursor()
        cur.execute('SELECT id, datum FROM testovani_datum_okres ORDER BY id DESC LIMIT 1')
        response = cur.fetchone()
        start_date = datetime.strptime(response[1], '%Y-%m-%d')
        today_date = datetime.now()
        current_date = start_date
        i = 0

        while True:
            current_date = (start_date + timedelta(days=i))
            current_date_text = current_date.strftime('%Y-%m-%d')
            if current_date_text == today_date.strftime('%Y-%m-%d'):
                break
            i += 1

            # Get data from MZCR
            url_edit = url.replace('XYZ', current_date_text)
            req = urllib.request.Request(url_edit)
            req.add_header('accept', 'application/json')
            response = urllib.request.urlopen(req)
            json_okresy = json.load(response)

            # Add record to database for each record returned
            for okres in json_okresy:
                cur.execute('INSERT INTO testovani_datum_okres (datum, okres, prirustek, celkem, prirustek_korekce, celkem_korekce) VALUES (?, ?, ?, ?, ?, ?)', [current_date_text, okres['okres_lau_kod'], okres['prirustkovy_pocet_testu_okres'], okres['kumulativni_pocet_testu_okres'], okres['prirustkovy_pocet_prvnich_testu_okres'], okres['kumulativni_pocet_prvnich_testu_okres'] ])
                conn.commit()

            print(f"[DATABASE] Processed tests at {current_date_text}")
        


except sqlite3.Error as e:
    print(e)
    exit(0)


# OCKOVANI DOWNLOADER 2
# url = "https://onemocneni-aktualne.mzcr.cz/api/v3/ockovani-geografie?page=1&itemsPerPage=1&datum%5Bbefore%5D=XYZ&datum%5Bafter%5D=XYZ&apiToken=c54d8c7d54a31d016d8f3c156b98682a"
# okresy_names = {"CZ0100": 1275406, "CZ0201": 99323, "CZ0202": 96624,"CZ0203": 164493,"CZ0204": 103894,"CZ0205": 75683,"CZ0206": 109354,"CZ0207": 127592,"CZ0208": 101120,"CZ0209": 188384,"CZ020A": 151093,"CZ020B": 114366,"CZ020C": 54898,"CZ0311": 195533,"CZ0312": 60096,"CZ0313": 89283,"CZ0314": 70769,"CZ0315": 50230,"CZ0316": 69773,"CZ0317": 101363,"CZ0321": 54391,"CZ0322": 84614,"CZ0323": 188407,"CZ0324": 68918,"CZ0325": 80666,"CZ0326": 48770,"CZ0327": 52941,"CZ0411": 87958,"CZ0412": 110052,"CZ0413": 85200,"CZ0421": 126294,"CZ0422": 121480,"CZ0423": 117582,"CZ0424": 85381,"CZ0425": 106773,"CZ0426": 124472,"CZ0427": 116916,"CZ0511": 101962,"CZ0512": 90171,"CZ0513": 173890,"CZ0514": 71547,"CZ0521": 162400,"CZ0522": 78713,"CZ0523": 107973,"CZ0524": 78424,"CZ0525": 115073,"CZ0531": 103746,"CZ0532": 172224,"CZ0533": 102866,"CZ0534": 135682,"CZ0631": 93692,"CZ0632": 112415,"CZ0633": 71571,"CZ0634": 109183,"CZ0635": 117164,"CZ0641": 107912,"CZ0642": 379466,"CZ0643": 225514,"CZ0644": 114801,"CZ0645": 151096,"CZ0646": 92317,"CZ0647": 113462,"CZ0711": 36752,"CZ0712": 233588,"CZ0713": 107580,"CZ0714": 126613,"CZ0715": 118397,"CZ0721": 103445,"CZ0722": 139829,"CZ0723": 140171,"CZ0724": 188987,"CZ0801": 89547,"CZ0802": 212347,"CZ0803": 240319,"CZ0804": 149919,"CZ0805": 173753,"CZ0806": 312104}
# okresy = {}
# for key in okresy_names:
#     okresy[key] = {}
#     okresy[key]['1'] = 0
#     okresy[key]['2'] = 0
#     okresy[key]['3'] = 0
#     okresy[key]['4'] = 0
#     okresy[key]['celkem'] = 0
# datum_i = 0
# celkem = 0

# try:
#     with sqlite3.connect('../sql/database.sqlite') as conn:
#         cur = conn.cursor()
#         start_datum = datetime.strptime("2020-12-27", '%Y-%m-%d')
#         start_datum_one_day_before = (start_datum - timedelta(days=1))
#         datumy = []
#         curr_datum = ''
#         while curr_datum != '2022-11-08':
#             curr_datum = (start_datum + timedelta(days=datum_i)).strftime('%Y-%m-%d')
#             datum_i += 1
#             datumy.append(curr_datum)
        
#         # Process every date since 2020-12-27
#         for datum in datumy:
#             cur.execute('SELECT okres, davka_1_den, davka_2_den, davka_3_den, davka_4_den FROM ockovani_datum_okres WHERE datum = ?', [datum])
#             response = cur.fetchall()

#             # Process every district in given date
#             if response is not None:
#                 for row in response:
#                     okres = row[0]

#                     okresy[okres]['1'] += row[1]
#                     okresy[okres]['2'] += row[2]
#                     okresy[okres]['3'] += row[3]
#                     okresy[okres]['4'] += row[4]
#                     okresy[okres]['celkem'] += (row[1] + row[2] + row[3] + row[4])
#                     celkem_den = row[1] + row[2] + row[3] + row[4]
#                     if okres == "CZ0100":
#                         pass
                        
            
#             for key in okresy_names:
#                 cur.execute('SELECT * FROM ockovani_datum_okres WHERE datum = ? AND okres = ?', [datum, key])
#                 response = cur.fetchone()
#                 if response is None:
#                     cur.execute('INSERT INTO ockovani_datum_okres (datum, okres, davka_1_den, davka_1_doposud, davka_2_den, davka_2_doposud, davka_3_den, davka_3_doposud, davka_4_den, davka_4_doposud, davka_celkem_den, davka_celkem_doposud) VALUES (?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)', [datum, key])
#                     conn.commit()
    
#                 cur.execute('UPDATE ockovani_datum_okres SET davka_1_doposud = ? WHERE datum = ? AND okres = ?', [okresy[key]['1'], datum, key])
#                 cur.execute('UPDATE ockovani_datum_okres SET davka_2_doposud = ? WHERE datum = ? AND okres = ?', [okresy[key]['2'], datum, key])
#                 cur.execute('UPDATE ockovani_datum_okres SET davka_3_doposud = ? WHERE datum = ? AND okres = ?', [okresy[key]['3'], datum, key])
#                 cur.execute('UPDATE ockovani_datum_okres SET davka_4_doposud = ? WHERE datum = ? AND okres = ?', [okresy[key]['4'], datum, key])
#                 cur.execute('UPDATE ockovani_datum_okres SET davka_celkem_doposud = ? WHERE datum = ? AND okres = ?', [okresy[key]['celkem'], datum, key])
#                 cur.execute('UPDATE ockovani_datum_okres SET davka_celkem_den = (davka_1_den + davka_2_den + davka_3_den + davka_4_den) WHERE datum = ? AND okres = ?', [datum, key])
#                 conn.commit()
#                 print(f"Processed {datum}")


# except sqlite3.Error as e:
#     print(e)



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


