from time import sleep
import json
from urllib.request import urlopen
import urllib.parse
import mysql.connector
from datetime import datetime, timedelta

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
                    result['rozdil_nakazeni'] = format_number(response[0][2] - response[1][2])
                    result['rozdil_vyleceni'] = format_number(response[0][23] - response[1][23])
                    result['rozdil_umrti'] = format_number(response[0][19] - response[1][19])
                    result['rozdil_ovlivneno'] = format_number(response[0][10] - response[1][10])
            else:
                return {}

    except mysql.connector.Error as e:
        print(e)

    return result

get_today_summary()