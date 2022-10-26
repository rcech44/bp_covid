from datetime import datetime, timedelta
import sqlite3

def getData(range_from, range_to, type):
    return_data = {}
    all_requested_dates = []

    # Check for correct date
    try:
        d1 = datetime.strptime(range_from, '%Y-%m-%d')
        d2 = datetime.strptime(range_to, '%Y-%m-%d')
        if (d1 > d2):
            print('[API] Requested dates are not valid - from is larger than to')
            return 'Requested dates are not valid - from is larger than to'
    except Exception as e:
        print(f"[API] Requested dates are not valid - {e}")
        return 'Requested dates are not valid'

    # If correct, generate all needed dates
    count = 0
    while True:
        d = (datetime.strptime(range_from, '%Y-%m-%d') + timedelta(days=count)).strftime("%Y-%m-%d")
        all_requested_dates.append(d)
        if d == range_to:
            break
        count += 1

    # Get the data
    try:
        with sqlite3.connect('sql/database.sqlite') as conn:
            cur = conn.cursor()
            for date in all_requested_dates:
                cur.execute('SELECT * FROM covid_datum_okres WHERE datum = ?', [date])
                response = cur.fetchall()
                return_data[date] = {}
                for okres in response:
                    if okres[2] is not None:
                        return_data[date][okres[2]] = {}
                        return_data[date][okres[2]]['nove_pripady'] = okres[3]
                        return_data[date][okres[2]]['aktivni_pripady'] = okres[4]
                        return_data[date][okres[2]]['nove_pripady_7'] = okres[5]
                        return_data[date][okres[2]]['nove_pripady_14'] = okres[6]
                        return_data[date][okres[2]]['nove_pripady_65_vek'] = okres[7]
    
    except sqlite3.Error as e:
        print(f"[API] Database error - {e}")
        return f"Database error - {e}"

    return return_data