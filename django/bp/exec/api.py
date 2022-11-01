from datetime import datetime, timedelta
import sqlite3

pocet_obyvatel = {"CZ0100": 1275406, "CZ0201": 99323, "CZ0202": 96624,"CZ0203": 164493,"CZ0204": 103894,"CZ0205": 75683,"CZ0206": 109354,"CZ0207": 127592,"CZ0208": 101120,"CZ0209": 188384,"CZ020A": 151093,"CZ020B": 114366,"CZ020C": 54898,"CZ0311": 195533,"CZ0312": 60096,"CZ0313": 89283,"CZ0314": 70769,"CZ0315": 50230,"CZ0316": 69773,"CZ0317": 101363,"CZ0321": 54391,"CZ0322": 84614,"CZ0323": 188407,"CZ0324": 68918,"CZ0325": 80666,"CZ0326": 48770,"CZ0327": 52941,"CZ0411": 87958,"CZ0412": 110052,"CZ0413": 85200,"CZ0421": 126294,"CZ0422": 121480,"CZ0423": 117582,"CZ0424": 85381,"CZ0425": 106773,"CZ0426": 124472,"CZ0427": 116916,"CZ0511": 101962,"CZ0512": 90171,"CZ0513": 173890,"CZ0514": 71547,"CZ0521": 162400,"CZ0522": 78713,"CZ0523": 107973,"CZ0524": 78424,"CZ0525": 115073,"CZ0531": 103746,"CZ0532": 172224,"CZ0533": 102866,"CZ0534": 135682,"CZ0631": 93692,"CZ0632": 112415,"CZ0633": 71571,"CZ0634": 109183,"CZ0635": 117164,"CZ0641": 107912,"CZ0642": 379466,"CZ0643": 225514,"CZ0644": 114801,"CZ0645": 151096,"CZ0646": 92317,"CZ0647": 113462,"CZ0711": 36752,"CZ0712": 233588,"CZ0713": 107580,"CZ0714": 126613,"CZ0715": 118397,"CZ0721": 103445,"CZ0722": 139829,"CZ0723": 140171,"CZ0724": 188987,"CZ0801": 89547,"CZ0802": 212347,"CZ0803": 240319,"CZ0804": 149919,"CZ0805": 173753,"CZ0806": 312104}

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
                nove_pocet = 0
                nove_max = 0
                nove_min = 999999
                aktivni_pocet = 0
                aktivni_max = 0
                aktivni_min = 999999
                for okres in response:
                    if okres[2] is not None:
                        return_data[date][okres[2]] = {}
                        return_data[date][okres[2]]['nove_pripady'] = okres[3]
                        return_data[date][okres[2]]['aktivni_pripady'] = okres[4]
                        return_data[date][okres[2]]['nove_pripady_7'] = okres[5]
                        return_data[date][okres[2]]['nove_pripady_14'] = okres[6]
                        return_data[date][okres[2]]['nove_pripady_65_vek'] = okres[7]
                        return_data[date][okres[2]]['nove_pripady_sto_tisic'] = okres[3] / (pocet_obyvatel[okres[2]] / 100000)
                        return_data[date][okres[2]]['aktivni_pripady_sto_tisic'] = okres[4] / (pocet_obyvatel[okres[2]] / 100000)
                        nove_pocet += okres[3]
                        aktivni_pocet += okres[4]
                        if return_data[date][okres[2]]['nove_pripady_sto_tisic'] > nove_max: nove_max = return_data[date][okres[2]]['nove_pripady_sto_tisic']
                        if return_data[date][okres[2]]['nove_pripady_sto_tisic'] < nove_min: nove_min = return_data[date][okres[2]]['nove_pripady_sto_tisic']
                        if return_data[date][okres[2]]['aktivni_pripady_sto_tisic'] > aktivni_max: aktivni_max = return_data[date][okres[2]]['aktivni_pripady_sto_tisic']
                        if return_data[date][okres[2]]['aktivni_pripady_sto_tisic'] < aktivni_min: aktivni_min = return_data[date][okres[2]]['aktivni_pripady_sto_tisic']
                return_data[date]['max_aktivni_sto_tisic'] = aktivni_max
                return_data[date]['min_aktivni_sto_tisic'] = aktivni_min
                return_data[date]['max_nove_sto_tisic'] = nove_max
                return_data[date]['min_nove_sto_tisic'] = nove_min
                return_data[date]['nove_celkovy_pocet'] = nove_pocet
                return_data[date]['aktivni_celkovy_pocet'] = aktivni_pocet
    
    except sqlite3.Error as e:
        print(f"[API] Database error - {e}")
        return f"Database error - {e}"

    return return_data