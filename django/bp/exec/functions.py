import math
import pprint
from time import sleep
import json
from urllib.request import urlopen
import urllib.parse
import mysql.connector
from datetime import datetime, timedelta
import random
import numpy as np

def format_number(num):
    if num >= 0:
        return "+ " + str(f"{abs(num):,}")
    else:
        return "- " + str(f"{abs(num):,}")

def get_today_summary():
    result = {}
    datum_string_now = datetime.now().strftime("%Y-%m-%d")
    datum_string_yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

    # Download data from database
    try:
        with mysql.connector.connect(host="remotemysql.com", user="9qMwE320zO", password="gmnNuBYtIX", database="9qMwE320zO") as conn:
            cur = conn.cursor(buffered=True)
            cur.execute('SELECT * FROM covid_summary ORDER BY id DESC LIMIT 2')
            response = cur.fetchall()
            if response is not None:
                # Get current values
                result['nakazeni'] = f"{response[0][2]:,}"
                result['vyleceni'] = f"{response[0][23]:,}"
                result['umrti'] = f"{response[0][19]:,}"
                result['ovlivneno'] = f"{response[0][10]:,}"

                # Get values difference
                if response[0][1] == datum_string_now and response[1][1] == datum_string_yesterday:
                    result['rozdil_nakazeni'] = format_number(response[0][11] + response[0][24])
                    result['rozdil_vyleceni'] = format_number(response[0][23] - response[1][23])
                    result['rozdil_umrti'] = format_number(response[0][19] - response[1][19])
                    result['rozdil_ovlivneno'] = format_number(response[0][10] - response[1][10])
            else:
                return {}

    except mysql.connector.Error as e:
        print(e)

    return result

def thirty_day_summary_graph():
    graph = {}
    graph['days'] = []
    graph['values'] = []
    graph['colors'] = []
    graph['colors_border'] = []
    maximum_value = 0

    color_red = [255, 80, 80]
    color_green = [255, 191, 80]

    try:
        with mysql.connector.connect(host="remotemysql.com", user="9qMwE320zO", password="gmnNuBYtIX", database="9qMwE320zO") as conn:
            cur = conn.cursor(buffered=True)
            cur.execute('SELECT datum, SUM(nove_pripady) FROM covid_unikatni_okresy GROUP BY datum ORDER BY datum LIMIT 30')
            response = cur.fetchall()
            if response is not None:
                for row in response:
                    if (row[1]) > maximum_value:
                        maximum_value = row[1]
                for row in response:

                    # Calculate color gradient
                    value = row[1]
                    difference1 = value / maximum_value
                    difference2 = 1 - difference1
                    final_color = [round(color_red[0] * difference1 + color_green[0] * difference2), \
                                   round(color_red[1] * difference1 + color_green[1] * difference2), \
                                   round(color_red[2] * difference1 + color_green[2] * difference2)]

                    # 'rgb(255, 99, 132)'
                    date_format = datetime.strptime(row[0], '%Y-%m-%d')
                    graph['colors'].append(f"rgba({str(final_color[0])}, {str(final_color[1])}, {str(final_color[2])}, 0.8)")
                    graph['colors_border'].append(f"rgb({str(final_color[0] - 30)}, {str(final_color[1] - 30)}, {str(final_color[2] - 30)})")
                    graph['days'].append(date_format.strftime("%d.%m."))
                    graph['values'].append(row[1])

    except mysql.connector.Error as e:
        pass

    return graph

def thirty_day_map():
    data = {}
    try:
        with mysql.connector.connect(host="remotemysql.com", user="9qMwE320zO", password="gmnNuBYtIX", database="9qMwE320zO") as conn:
            cur = conn.cursor(buffered=True)
            cur.execute('SELECT * FROM covid_unikatni_okresy ORDER BY id')
            response = cur.fetchall()
            if response is not None:
                for row in response:
                    if row[1] not in data:
                        data[row[1]] = {}
                    if row[2] not in data[row[1]]:
                        data[row[1]][row[2]] = {}
                    data[row[1]][row[2]]['nove_pripady'] = row[3]
                    data[row[1]][row[2]]['aktivni_pripady'] = row[4]
                    data[row[1]][row[2]]['nove_pripady_7'] = row[5]
                    data[row[1]][row[2]]['nove_pripady_14'] = row[6]
                    data[row[1]][row[2]]['nove_pripady_65_vek'] = row[7]

            for datum in data:
                count_aktivni = 0
                count_nove = 0
                max_nove = 0
                min_nove = 99999999
                max_aktivni = 0
                min_aktivni = 99999999
                values_nove = []
                values_aktivni = []
                for okres in data[datum]:
                    count_aktivni += data[datum][okres]['aktivni_pripady']
                    count_nove += data[datum][okres]['nove_pripady']
                    values_nove.append(data[datum][okres]['nove_pripady'])
                    values_aktivni.append(data[datum][okres]['aktivni_pripady'])
                    if data[datum][okres]['aktivni_pripady'] > max_aktivni: max_aktivni = data[datum][okres]['aktivni_pripady']
                    if data[datum][okres]['aktivni_pripady'] < min_aktivni: min_aktivni = data[datum][okres]['aktivni_pripady']
                    if data[datum][okres]['nove_pripady'] > max_nove: max_nove = data[datum][okres]['nove_pripady']
                    if data[datum][okres]['nove_pripady'] < min_nove: min_nove = data[datum][okres]['nove_pripady']
                data[datum]['max_aktivni'] = max_aktivni
                data[datum]['min_aktivni'] = min_aktivni
                data[datum]['max_nove'] = max_nove
                data[datum]['min_nove'] = min_nove
                data[datum]['avg_aktivni'] = count_aktivni / 76
                data[datum]['avg_nove'] = count_nove / 76
                data[datum]['90th_percentile_nove'] = np.percentile(values_nove, 97)
                data[datum]['90th_percentile_aktivni'] = np.percentile(values_aktivni, 97)

            # pprint.pprint(data)


    except mysql.connector.Error as e:
        pass
    
    return data

# thirty_day_map()