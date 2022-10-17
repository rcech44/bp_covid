import math
from time import sleep
import json
from urllib.request import urlopen
import urllib.parse
import mysql.connector
from datetime import datetime, timedelta
import random

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
            cur.execute('SELECT * FROM covid_summary ORDER BY id ASC LIMIT 30')
            response = cur.fetchall()
            if response is not None:
                for row in response:
                    if (row[11] + row[24]) > maximum_value:
                        maximum_value = row[11] + row[24]
                for row in response:

                    # Calculate color gradient
                    value = row[11] + row[24]
                    difference1 = value / maximum_value
                    difference2 = 1 - difference1
                    final_color = [round(color_red[0] * difference1 + color_green[0] * difference2), \
                                   round(color_red[1] * difference1 + color_green[1] * difference2), \
                                   round(color_red[2] * difference1 + color_green[2] * difference2)]

                    # 'rgb(255, 99, 132)'
                    date_format = datetime.strptime(row[1], '%Y-%m-%d')
                    graph['colors'].append(f"rgba({str(final_color[0])}, {str(final_color[1])}, {str(final_color[2])}, 0.5)")
                    graph['colors_border'].append(f"rgb({str(final_color[0] - 30)}, {str(final_color[1] - 30)}, {str(final_color[2] - 30)})")
                    graph['days'].append(date_format.strftime("%d.%m."))
                    graph['values'].append(row[11])

    except mysql.connector.Error as e:
        pass

    return graph

# get_today_summary()