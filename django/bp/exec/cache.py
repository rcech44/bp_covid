import sqlite3
from datetime import datetime, timedelta
from exec.database import *
from exec.database_models import *

class Cache:
    _instance = None
    _population = {"CZ0100": 1275406, "CZ0201": 99323, "CZ0202": 96624,"CZ0203": 164493,"CZ0204": 103894,"CZ0205": 75683,"CZ0206": 109354,"CZ0207": 127592,"CZ0208": 101120,"CZ0209": 188384,"CZ020A": 151093,"CZ020B": 114366,"CZ020C": 54898,"CZ0311": 195533,"CZ0312": 60096,"CZ0313": 89283,"CZ0314": 70769,"CZ0315": 50230,"CZ0316": 69773,"CZ0317": 101363,"CZ0321": 54391,"CZ0322": 84614,"CZ0323": 188407,"CZ0324": 68918,"CZ0325": 80666,"CZ0326": 48770,"CZ0327": 52941,"CZ0411": 87958,"CZ0412": 110052,"CZ0413": 85200,"CZ0421": 126294,"CZ0422": 121480,"CZ0423": 117582,"CZ0424": 85381,"CZ0425": 106773,"CZ0426": 124472,"CZ0427": 116916,"CZ0511": 101962,"CZ0512": 90171,"CZ0513": 173890,"CZ0514": 71547,"CZ0521": 162400,"CZ0522": 78713,"CZ0523": 107973,"CZ0524": 78424,"CZ0525": 115073,"CZ0531": 103746,"CZ0532": 172224,"CZ0533": 102866,"CZ0534": 135682,"CZ0631": 93692,"CZ0632": 112415,"CZ0633": 71571,"CZ0634": 109183,"CZ0635": 117164,"CZ0641": 107912,"CZ0642": 379466,"CZ0643": 225514,"CZ0644": 114801,"CZ0645": 151096,"CZ0646": 92317,"CZ0647": 113462,"CZ0711": 36752,"CZ0712": 233588,"CZ0713": 107580,"CZ0714": 126613,"CZ0715": 118397,"CZ0721": 103445,"CZ0722": 139829,"CZ0723": 140171,"CZ0724": 188987,"CZ0801": 89547,"CZ0802": 212347,"CZ0803": 240319,"CZ0804": 149919,"CZ0805": 173753,"CZ0806": 312104}

    def __init__(self):
        pass

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.__data = {}
            cls._instance.__initialized = False
            cls._instance.__last_day = None

        return cls._instance
    
    def get_instance(self):
        return self._instance

    def get_data(self, range_from, range_to):
        result = {}
        max_values = {}
        count = 0

        # Check valid date
        try:
            datetime.strptime(range_from, '%Y-%m-%d')
            datetime.strptime(range_to, '%Y-%m-%d')
        except ValueError:
            return "error"

        # Get all values from main dictionary
        while True:
            d = (datetime.strptime(range_from, '%Y-%m-%d') + timedelta(days=count)).strftime("%Y-%m-%d")
            result[d] = {}
            try:
                result[d] = self.__data[d]
            except:
                return "error"
            if d == range_to:
                break
            count += 1

        # Find all maximums for new set of data
        result_values = result.values()

        # Maximum - infections
        max_values['infections_new_max_total'] =             	max(float(d['infections_new_max']) for d in result_values)
        max_values['infections_new_100k_max_total'] =           max(float(d['infections_new_100k_max']) for d in result_values)
        max_values['infections_new_7_max_total'] =              max(float(d['infections_new_7_max']) for d in result_values)
        max_values['infections_new_7_100k_max_total'] =         max(float(d['infections_new_7_100k_max']) for d in result_values)
        max_values['infections_new_14_max_total'] =           	max(float(d['infections_new_14_max']) for d in result_values)
        max_values['infections_new_14_100k_max_total'] =        max(float(d['infections_new_14_100k_max']) for d in result_values)
        max_values['infections_new_65_age_max_total'] =         max(float(d['infections_new_65_age_max']) for d in result_values)
        max_values['infections_new_65_age_100k_max_total'] =    max(float(d['infections_new_65_age_100k_max']) for d in result_values)

        # Maximum - vaccinations
        max_values['vaccination_doses_day_total'] =             max(float(d['vaccination_doses_day_max']) for d in result_values)
        max_values['vaccination_doses_day_100k_total'] =        max(float(d['vaccination_doses_day_100k_max']) for d in result_values)
        max_values['vaccination_doses_alltime_total'] =         max(float(d['vaccination_doses_alltime_max']) for d in result_values)
        max_values['vaccination_doses_alltime_100k_total'] =    max(float(d['vaccination_doses_alltime_100k_max']) for d in result_values)
        max_values['vaccination_1_dose_day_total'] =            max(float(d['vaccination_1_dose_day_max']) for d in result_values)
        max_values['vaccination_1_dose_day_100k_total'] =       max(float(d['vaccination_1_dose_day_100k_max']) for d in result_values)
        max_values['vaccination_1_dose_alltime_total'] =        max(float(d['vaccination_1_dose_alltime_max']) for d in result_values)
        max_values['vaccination_1_dose_alltime_100k_total'] =   max(float(d['vaccination_1_dose_alltime_100_max']) for d in result_values)
        max_values['vaccination_2_dose_day_total'] =            max(float(d['vaccination_2_dose_day_max']) for d in result_values)
        max_values['vaccination_2_dose_day_100k_total'] =       max(float(d['vaccination_2_dose_day_100k_max']) for d in result_values)
        max_values['vaccination_2_dose_alltime_total'] =        max(float(d['vaccination_2_dose_alltime_max']) for d in result_values)
        max_values['vaccination_2_dose_alltime_100k_total'] =   max(float(d['vaccination_2_dose_alltime_100_max']) for d in result_values)
        max_values['vaccination_3_dose_day_total'] =            max(float(d['vaccination_3_dose_day_max']) for d in result_values)
        max_values['vaccination_3_dose_day_100k_total'] =       max(float(d['vaccination_3_dose_day_100k_max']) for d in result_values)
        max_values['vaccination_3_dose_alltime_total'] =        max(float(d['vaccination_3_dose_alltime_max']) for d in result_values)
        max_values['vaccination_3_dose_alltime_100k_total'] =   max(float(d['vaccination_3_dose_alltime_100_max']) for d in result_values)
        max_values['vaccination_4_dose_day_total'] =            max(float(d['vaccination_4_dose_day_max']) for d in result_values)
        max_values['vaccination_4_dose_day_100k_total'] =       max(float(d['vaccination_4_dose_day_100k_max']) for d in result_values)
        max_values['vaccination_4_dose_alltime_total'] =        max(float(d['vaccination_4_dose_alltime_max']) for d in result_values)
        max_values['vaccination_4_dose_alltime_100k_total'] =   max(float(d['vaccination_4_dose_alltime_100_max']) for d in result_values)

        # Maximum - deaths
        max_values['deaths_alltime_total'] =                    max(float(d['deaths_alltime_max']) for d in result_values)
        max_values['deaths_alltime_100k_total'] =            	max(float(d['deaths_alltime_100k_max']) for d in result_values)
        max_values['deaths_day_total'] =                        max(float(d['deaths_day_max']) for d in result_values)
        max_values['deaths_day_100k_total'] =                	max(float(d['deaths_day_100k_max']) for d in result_values)

        # Maximum - PCR testing
        max_values['pcr_tests_alltime_total'] =                 max(float(d['pcr_tests_alltime_max']) for d in result_values)
        max_values['pcr_tests_alltime_100k_total'] =            max(float(d['pcr_tests_alltime_100k_max']) for d in result_values)
        max_values['pcr_tests_day_total'] =                    	max(float(d['pcr_tests_day_max']) for d in result_values)
        max_values['pcr_tests_day_100k_total'] =          		max(float(d['pcr_tests_day_100k_max']) for d in result_values)

        # Merge new dataset with found maximums
        result = result | max_values

        return result
    
    def update_data(self, update_dates):
        db = SQLiteDatabase()

        # Variables
        all_requested_dates = []
        date_today = datetime.now().strftime("%Y-%m-%d")

        # Update only given dates
        if update_dates is not None:
            all_requested_dates = update_dates
            print('[CACHE] Cache is updating...')

        # Generate all dates and fill cache with blank dates
        else:
            count = 0
            while True:
                d = (datetime.strptime('2020-03-01', '%Y-%m-%d') + timedelta(days=count)).strftime("%Y-%m-%d")
                if d == date_today:
                    break
                all_requested_dates.append(d)
                self.__data[d] = {}
                count += 1

        # Download all data
        try:
            with db.get_connection() as conn:

                # Init total values from existing cache
                if self.get_instance().__initialized:
                    infections_count = self.__data['infections_count']
                    vaccination_2_dose_alltime = self.__data['vaccination_2_dose_alltime']
                    vaccination_doses_count = self.__data['vaccination_doses_count']
                    pcr_tests_alltime_count = self.__data['pcr_tests_alltime_count']
                    deaths_alltime_count = self.__data['deaths_alltime_count']
                    vaccination_doses_count = self.__data['vaccination_doses_count']
                    pcr_tests_alltime_count = self.__data['pcr_tests_alltime_count']
                
                else:
                    vaccination_2_dose_alltime = vaccination_doses_count = pcr_tests_alltime_count = deaths_alltime_count = vaccination_doses_count = pcr_tests_alltime_count = 0
                    infections_count = 20


                ################################
                # Download infections
                ################################

                self.__data['infections_new_max_total'] = self.__data['infections_new_100k_max_total'] = self.__data['infections_active_max_total'] = self.__data['infections_active_100k_max_total'] = 0

                for date in all_requested_dates:
                    records = db.get_records_day("infection", date)
                    self.__data[date]['infections_count'] = infections_count
                    infections_new_count = self.__data[date]['infections_new_max'] = self.__data[date]['infections_new_100k_max'] = aktivni_pocet = self.__data[date]['infections_active_max'] = self.__data[date]['infections_active_100k_max'] = self.__data[date]['infections_new_7_max'] = self.__data[date]['infections_new_7_100k_max'] = self.__data[date]['infections_new_14_max'] = self.__data[date]['infections_new_14_100k_max'] = self.__data[date]['infections_new_65_age_max'] = self.__data[date]['infections_new_65_age_100k_max'] = 0
                    for record in records:
                        if record.district is not None:
                            self.__data[date][record.district] = {}
                            self.__data[date][record.district]['infections_new'] = record.infections_new
                            self.__data[date][record.district]['infections_active'] = record.infections_active
                            self.__data[date][record.district]['infections_new_7'] = record.infections_new_7
                            self.__data[date][record.district]['infections_new_14'] = record.infections_new_14
                            self.__data[date][record.district]['infections_new_65_age'] = record.infections_new_65_age
                            self.__data[date][record.district]['infections_new_100k'] = record.infections_new / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['infections_active_100k'] = record.infections_active / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['infections_new_7_100k'] = record.infections_new_7 / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['infections_new_14_100k'] = record.infections_new_14 / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['infections_new_65_age_100k'] = record.infections_new_65_age / (self._population[record.district] / 100000)

                            infections_new_count += record.infections_new
                            # aktivni_pocet += district[4]

                            self.__data[date]['infections_new_max'] =            	max(self.__data[date]['infections_new_max'], self.__data[date][record.district]['infections_new'])
                            self.__data[date]['infections_new_100k_max'] =       	max(self.__data[date]['infections_new_100k_max'], self.__data[date][record.district]['infections_new_100k'])
                            self.__data[date]['infections_active_max'] =            max(self.__data[date]['infections_active_max'], self.__data[date][record.district]['infections_active'])
                            self.__data[date]['infections_active_100k_max'] =    	max(self.__data[date]['infections_active_100k_max'], self.__data[date][record.district]['infections_active_100k'])
                            self.__data[date]['infections_new_7_max'] =             max(self.__data[date]['infections_new_7_max'], self.__data[date][record.district]['infections_new_7'])
                            self.__data[date]['infections_new_14_max'] =            max(self.__data[date]['infections_new_14_max'], self.__data[date][record.district]['infections_new_14'])
                            self.__data[date]['infections_new_65_age_max'] =        max(self.__data[date]['infections_new_65_age_max'], self.__data[date][record.district]['infections_new_65_age'])
                            self.__data[date]['infections_new_7_100k_max'] =     	max(self.__data[date]['infections_new_7_100k_max'], self.__data[date][record.district]['infections_new_7_100k'])
                            self.__data[date]['infections_new_14_100k_max'] =    	max(self.__data[date]['infections_new_14_100k_max'], self.__data[date][record.district]['infections_new_14_100k'])
                            self.__data[date]['infections_new_65_age_100k_max'] =   max(self.__data[date]['infections_new_65_age_100k_max'], self.__data[date][record.district]['infections_new_65_age_100k'])
                            self.__data['infections_new_max_total'] =               max(self.__data['infections_new_max_total'], self.__data[date][record.district]['infections_new'])
                            self.__data['infections_new_100k_max_total'] =     		max(self.__data['infections_new_100k_max_total'], self.__data[date][record.district]['infections_new_100k'])
                            self.__data['infections_active_max_total'] =            max(self.__data['infections_active_max_total'], self.__data[date][record.district]['infections_active'])
                            self.__data['infections_active_100k_max_total'] =  		max(self.__data['infections_active_100k_max_total'], self.__data[date][record.district]['infections_active_100k'])
                        else:
                            infections_new_count += record.infections_new

                    infections_count += infections_new_count
                    self.__data[date]['infections_count'] = infections_count
                    self.__data[date]['infections_new_count'] = infections_new_count

                self.__data['infections_count'] = infections_count
                
                ################################
                # Download vaccinations
                ################################
                    
                vaccination_doses_district_max = self.__data['vaccination_doses_district_max'] = self.__data['vaccination_1_dose_day_total'] = self.__data['vaccination_2_dose_day_total'] = self.__data['vaccination_3_dose_day_total'] = self.__data['vaccination_4_dose_day_total'] = self.__data['vaccination_doses_day_total'] = self.__data['vaccination_1_dose_alltime_total'] = self.__data['vaccination_2_dose_alltime_total'] = self.__data['vaccination_3_dose_alltime_total'] = self.__data['vaccination_4_dose_alltime_total'] = self.__data['vaccination_doses_alltime_total'] = self.__data['vaccination_1_dose_day_100k_total'] = self.__data['vaccination_2_dose_day_100k_total'] = self.__data['vaccination_3_dose_day_100k_total'] = self.__data['vaccination_4_dose_day_100k_total'] = self.__data['vaccination_doses_day_100k_total'] = self.__data['vaccination_1_dose_alltime_100k_total'] = self.__data['vaccination_2_dose_alltime_100k_total'] = self.__data['vaccination_3_dose_alltime_100k_total'] = self.__data['vaccination_4_dose_alltime_100k_total'] = self.__data['vaccination_doses_alltime_100k_total'] = 0

                for date in all_requested_dates:
                    records = db.get_records_day("vaccination", date)
                    self.__data[date]['vaccination_1_dose_day_max'] = self.__data[date]['vaccination_2_dose_day_max'] = self.__data[date]['vaccination_3_dose_day_max'] = self.__data[date]['vaccination_4_dose_day_max'] = self.__data[date]['vaccination_1_dose_day_100k_max'] = self.__data[date]['vaccination_2_dose_day_100k_max'] = self.__data[date]['vaccination_3_dose_day_100k_max'] = self.__data[date]['vaccination_4_dose_day_100k_max'] = self.__data[date]['vaccination_1_dose_alltime_max'] = self.__data[date]['vaccination_2_dose_alltime_max'] = self.__data[date]['vaccination_3_dose_alltime_max'] = self.__data[date]['vaccination_4_dose_alltime_max'] = self.__data[date]['vaccination_1_dose_alltime_100_max'] = self.__data[date]['vaccination_2_dose_alltime_100_max'] = self.__data[date]['vaccination_3_dose_alltime_100_max'] = self.__data[date]['vaccination_4_dose_alltime_100_max'] = self.__data[date]['vaccination_doses_day_max'] = self.__data[date]['vaccination_doses_day_100k_max'] = self.__data[date]['vaccination_doses_alltime_max'] = self.__data[date]['vaccination_doses_alltime_100k_max'] = vaccination_doses_day = 0
                    for record in records:
                        if record.district is not None:
                            # Process data and get 100 thousand count
                            self.__data[date][record.district]['vaccination_1_dose_day'] = record.dose_1_day
                            self.__data[date][record.district]['vaccination_1_dose_day_100k'] = record.dose_1_day / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['vaccination_1_dose_alltime'] = record.dose_1_alltime
                            self.__data[date][record.district]['vaccination_1_dose_alltime_100'] = record.dose_1_alltime / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['vaccination_2_dose_day'] = record.dose_2_day
                            self.__data[date][record.district]['vaccination_2_dose_day_100k'] = record.dose_2_day / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['vaccination_2_dose_alltime'] = record.dose_2_alltime
                            self.__data[date][record.district]['vaccination_2_dose_alltime_100'] = record.dose_2_alltime / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['vaccination_3_dose_day'] = record.dose_3_day
                            self.__data[date][record.district]['vaccination_3_dose_day_100k'] = record.dose_3_day / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['vaccination_3_dose_alltime'] = record.dose_3_alltime
                            self.__data[date][record.district]['vaccination_3_dose_alltime_100'] = record.dose_3_alltime / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['vaccination_4_dose_day'] = record.dose_4_day
                            self.__data[date][record.district]['vaccination_4_dose_day_100k'] = record.dose_4_day / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['vaccination_4_dose_alltime'] = record.dose_4_alltime
                            self.__data[date][record.district]['vaccination_4_dose_alltime_100'] = record.dose_4_alltime / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['vaccination_doses_day'] = record.doses_day
                            vaccination_doses_day += record.doses_day
                            vaccination_doses_alltime += record.doses_day
                            vaccination_2_dose_alltime += record.dose_2_day
                            vaccination_doses_count += (record.dose_1_day + record.dose_2_day + record.dose_3_day + record.dose_4_day)
                            self.__data[date][record.district]['vaccination_doses_day_100k'] = record.doses_day / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['vaccination_doses_alltime'] = record.doses_alltime
                            self.__data[date][record.district]['vaccination_doses_alltime_100k'] = record.doses_alltime / (self._population[record.district] / 100000)

                            # Get minimums and maximums
                            self.__data[date]['vaccination_1_dose_day_max'] =         		max(self.__data[date]['vaccination_1_dose_day_max'], self.__data[date][record.district]['vaccination_1_dose_day'])
                            self.__data[date]['vaccination_4_dose_day_max'] =         		max(self.__data[date]['vaccination_4_dose_day_max'], self.__data[date][record.district]['vaccination_4_dose_day'])
                            self.__data[date]['vaccination_2_dose_day_max'] =         		max(self.__data[date]['vaccination_2_dose_day_max'], self.__data[date][record.district]['vaccination_2_dose_day'])
                            self.__data[date]['vaccination_3_dose_day_max'] =         		max(self.__data[date]['vaccination_3_dose_day_max'], self.__data[date][record.district]['vaccination_3_dose_day'])
                            self.__data[date]['vaccination_1_dose_day_100k_max'] =          max(self.__data[date]['vaccination_1_dose_day_100k_max'], self.__data[date][record.district]['vaccination_1_dose_day_100k'])
                            self.__data[date]['vaccination_2_dose_day_100k_max'] =          max(self.__data[date]['vaccination_2_dose_day_100k_max'], self.__data[date][record.district]['vaccination_2_dose_day_100k'])
                            self.__data[date]['vaccination_3_dose_day_100k_max'] =          max(self.__data[date]['vaccination_3_dose_day_100k_max'], self.__data[date][record.district]['vaccination_3_dose_day_100k'])
                            self.__data[date]['vaccination_4_dose_day_100k_max'] =          max(self.__data[date]['vaccination_4_dose_day_100k_max'], self.__data[date][record.district]['vaccination_4_dose_day_100k'])
                            self.__data[date]['vaccination_1_dose_alltime_max'] =           max(self.__data[date]['vaccination_1_dose_alltime_max'], self.__data[date][record.district]['vaccination_1_dose_alltime'])
                            self.__data[date]['vaccination_2_dose_alltime_max'] =           max(self.__data[date]['vaccination_2_dose_alltime_max'], self.__data[date][record.district]['vaccination_2_dose_alltime'])
                            self.__data[date]['vaccination_3_dose_alltime_max'] =           max(self.__data[date]['vaccination_3_dose_alltime_max'], self.__data[date][record.district]['vaccination_3_dose_alltime'])
                            self.__data[date]['vaccination_4_dose_alltime_max'] =           max(self.__data[date]['vaccination_4_dose_alltime_max'], self.__data[date][record.district]['vaccination_4_dose_alltime'])
                            self.__data[date]['vaccination_1_dose_alltime_100_max'] =       max(self.__data[date]['vaccination_1_dose_alltime_100_max'], self.__data[date][record.district]['vaccination_1_dose_alltime_100'])
                            self.__data[date]['vaccination_2_dose_alltime_100_max'] =       max(self.__data[date]['vaccination_2_dose_alltime_100_max'], self.__data[date][record.district]['vaccination_2_dose_alltime_100'])
                            self.__data[date]['vaccination_3_dose_alltime_100_max'] =       max(self.__data[date]['vaccination_3_dose_alltime_100_max'], self.__data[date][record.district]['vaccination_3_dose_alltime_100'])
                            self.__data[date]['vaccination_4_dose_alltime_100_max'] =       max(self.__data[date]['vaccination_4_dose_alltime_100_max'], self.__data[date][record.district]['vaccination_4_dose_alltime_100'])
                            self.__data[date]['vaccination_doses_day_max'] =                max(self.__data[date]['vaccination_doses_day_max'], self.__data[date][record.district]['vaccination_doses_day'])
                            self.__data[date]['vaccination_doses_day_100k_max'] =           max(self.__data[date]['vaccination_doses_day_100k_max'], self.__data[date][record.district]['vaccination_doses_day_100k'])
                            self.__data[date]['vaccination_doses_alltime_max'] =            max(self.__data[date]['vaccination_doses_alltime_max'], self.__data[date][record.district]['vaccination_doses_alltime'])
                            self.__data[date]['vaccination_doses_alltime_100k_max'] =       max(self.__data[date]['vaccination_doses_alltime_100k_max'], self.__data[date][record.district]['vaccination_doses_alltime_100k'])
                            self.__data['vaccination_doses_district_max'] =                 max(self.__data['vaccination_doses_district_max'], self.__data[date][record.district]['vaccination_doses_alltime'])
                            self.__data['vaccination_1_dose_day_total'] =                   max(self.__data['vaccination_1_dose_day_total'], self.__data[date][record.district]['vaccination_1_dose_day'])
                            self.__data['vaccination_2_dose_day_total'] =                   max(self.__data['vaccination_2_dose_day_total'], self.__data[date][record.district]['vaccination_2_dose_day'])
                            self.__data['vaccination_3_dose_day_total'] =                   max(self.__data['vaccination_3_dose_day_total'], self.__data[date][record.district]['vaccination_3_dose_day'])
                            self.__data['vaccination_4_dose_day_total'] =                   max(self.__data['vaccination_4_dose_day_total'], self.__data[date][record.district]['vaccination_4_dose_day'])
                            self.__data['vaccination_doses_day_total'] =                    max(self.__data['vaccination_doses_day_total'], self.__data[date][record.district]['vaccination_doses_day'])
                            self.__data['vaccination_1_dose_alltime_total'] =               max(self.__data['vaccination_1_dose_alltime_total'], self.__data[date][record.district]['vaccination_1_dose_alltime'])
                            self.__data['vaccination_2_dose_alltime_total'] =               max(self.__data['vaccination_2_dose_alltime_total'], self.__data[date][record.district]['vaccination_2_dose_alltime'])
                            self.__data['vaccination_3_dose_alltime_total'] =               max(self.__data['vaccination_3_dose_alltime_total'], self.__data[date][record.district]['vaccination_3_dose_alltime'])
                            self.__data['vaccination_4_dose_alltime_total'] =               max(self.__data['vaccination_4_dose_alltime_total'], self.__data[date][record.district]['vaccination_4_dose_alltime'])
                            self.__data['vaccination_doses_alltime_total'] =                max(self.__data['vaccination_doses_alltime_total'], self.__data[date][record.district]['vaccination_doses_alltime'])
                            self.__data['vaccination_1_dose_day_100k_total'] =              max(self.__data['vaccination_1_dose_day_100k_total'], self.__data[date][record.district]['vaccination_1_dose_day_100k'])
                            self.__data['vaccination_2_dose_day_100k_total'] =              max(self.__data['vaccination_2_dose_day_100k_total'], self.__data[date][record.district]['vaccination_2_dose_day_100k'])
                            self.__data['vaccination_3_dose_day_100k_total'] =              max(self.__data['vaccination_3_dose_day_100k_total'], self.__data[date][record.district]['vaccination_3_dose_day_100k'])
                            self.__data['vaccination_4_dose_day_100k_total'] =              max(self.__data['vaccination_4_dose_day_100k_total'], self.__data[date][record.district]['vaccination_4_dose_day_100k'])
                            self.__data['vaccination_doses_day_100k_total'] =               max(self.__data['vaccination_doses_day_100k_total'], self.__data[date][record.district]['vaccination_doses_day_100k'])
                            self.__data['vaccination_1_dose_alltime_100k_total'] =          max(self.__data['vaccination_1_dose_alltime_100k_total'], self.__data[date][record.district]['vaccination_1_dose_alltime_100'])
                            self.__data['vaccination_2_dose_alltime_100k_total'] =          max(self.__data['vaccination_2_dose_alltime_100k_total'], self.__data[date][record.district]['vaccination_2_dose_alltime_100'])
                            self.__data['vaccination_3_dose_alltime_100k_total'] =          max(self.__data['vaccination_3_dose_alltime_100k_total'], self.__data[date][record.district]['vaccination_3_dose_alltime_100'])
                            self.__data['vaccination_4_dose_alltime_100k_total'] =          max(self.__data['vaccination_4_dose_alltime_100k_total'], self.__data[date][record.district]['vaccination_4_dose_alltime_100'])
                            self.__data['vaccination_doses_alltime_100k_total'] =           max(self.__data['vaccination_doses_alltime_100k_total'], self.__data[date][record.district]['vaccination_doses_alltime_100k'])

                    self.__data[date]['vaccination_doses_day'] = vaccination_doses_day
                    self.__data[date]['vaccination_doses_alltime'] = vaccination_doses_count
                    self.__data[date]['vaccination_2_dose_alltime'] = vaccination_2_dose_alltime
                
                self.__data['vaccination_doses_count'] = vaccination_doses_count
                self.__data['vaccination_2_dose_alltime'] = vaccination_2_dose_alltime
                self.__data['vaccination_doses_district_max'] = vaccination_doses_district_max

                ################################
                # Download deaths
                ################################

                self.__data['deaths_day_total'] = self.__data['deaths_day_100k_total'] = self.__data['deaths_alltime_total'] = self.__data['deaths_alltime_100k_total'] = 0
                for date in all_requested_dates:
                    records = db.get_records_day("death", date)
                    self.__data[date]['celkem_umrti'] = deaths_day_count = self.__data[date]['deaths_day_max'] = self.__data[date]['deaths_day_100k_max'] = self.__data[date]['deaths_alltime_max'] = self.__data[date]['deaths_alltime_100k_max'] = 0
                    for record in records:
                        if record.district is not None:
                            deaths_day_count += record.deaths_day
                            deaths_alltime_count += record.deaths_day
                            self.__data[date][record.district]['deaths_day'] = record.deaths_day
                            self.__data[date][record.district]['deaths_alltime'] = record.deaths_alltime
                            self.__data[date][record.district]['deaths_day_100k'] = record.deaths_day / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['deaths_alltime_100k'] = record.deaths_alltime / (self._population[record.district] / 100000)
                            
                            self.__data[date]['deaths_day_max'] =           max(self.__data[date]['deaths_day_max'], self.__data[date][record.district]['deaths_day'])
                            self.__data[date]['deaths_day_100k_max'] =      max(self.__data[date]['deaths_day_100k_max'], self.__data[date][record.district]['deaths_day_100k'])
                            self.__data[date]['deaths_alltime_max'] =       max(self.__data[date]['deaths_alltime_max'], self.__data[date][record.district]['deaths_alltime'])
                            self.__data[date]['deaths_alltime_100k_max'] = 	max(self.__data[date]['deaths_alltime_100k_max'], self.__data[date][record.district]['deaths_alltime_100k'])
                            self.__data['deaths_day_total'] =               max(self.__data['deaths_day_total'], self.__data[date][record.district]['deaths_day'])
                            self.__data['deaths_day_100k_total'] =          max(self.__data['deaths_day_100k_total'], self.__data[date][record.district]['deaths_day_100k'])
                            self.__data['deaths_alltime_total'] =           max(self.__data['deaths_alltime_total'], self.__data[date][record.district]['deaths_alltime'])
                            self.__data['deaths_alltime_100k_total'] =      max(self.__data['deaths_alltime_100k_total'], self.__data[date][record.district]['deaths_alltime_100k'])

                    self.__data[date]['deaths_day_count'] = deaths_day_count
                    self.__data[date]['deaths_alltime_count'] = deaths_alltime_count
                
                self.__data['deaths_alltime_count'] = deaths_alltime_count

                ################################
                # Download testing infromation
                ################################

                self.__data['pcr_tests_day_total'] = self.__data['pcr_tests_day_100k_total'] = self.__data['pcr_tests_alltime_total'] = self.__data['pcr_tests_alltime_100k_total'] = self.__data['rozsah_max_prirustek_korekce'] = self.__data['rozsah_max_prirustek_korekce_sto_tisic'] = self.__data['rozsah_max_celkem_korekce'] = self.__data['rozsah_max_celkem_korekce_sto_tisic'] = 0

                for date in all_requested_dates:
                    records = db.get_records_day("pcr_test", date)

                    self.__data[date]['celkem_testovani'] = pcr_tests_new_day_count = self.__data[date]['pcr_tests_day_max'] = self.__data[date]['pcr_tests_day_100k_max'] = self.__data[date]['pcr_tests_alltime_max'] = self.__data[date]['pcr_tests_alltime_100k_max'] = self.__data[date]['max_korekce_den'] = self.__data[date]['max_korekce_den_sto_tisic'] = self.__data[date]['celkem_max_korekce_den'] = self.__data[date]['celkem_max_korekce_den_sto_tisic'] = 0

                    for record in records:
                        if record.district is not None:
                            pcr_tests_day = pcr_tests_alltime = prirustek_korekce = celkem_korekce = 0
                            if record.tests_new is not None: pcr_tests_day = record.tests_new
                            if record.tests_alltime is not None: pcr_tests_alltime = record.tests_alltime
                            # if district[5] is not None: prirustek_korekce = district[5]
                            # if district[6] is not None: celkem_korekce = district[6]

                            pcr_tests_new_day_count += pcr_tests_day
                            pcr_tests_alltime_count += pcr_tests_day
                            self.__data[date][record.district]['pcr_tests_day'] = pcr_tests_day
                            self.__data[date][record.district]['pcr_tests_alltime'] = pcr_tests_alltime
                            self.__data[date][record.district]['pcr_tests_day_100k'] = pcr_tests_day / (self._population[record.district] / 100000)
                            self.__data[date][record.district]['pcr_tests_alltime_100k'] = pcr_tests_alltime / (self._population[record.district] / 100000)
                            # self.__data[date][record.district]['prirustek_korekce'] = prirustek_korekce
                            # self.__data[date][record.district]['celkem_korekce'] = celkem_korekce
                            # self.__data[date][record.district]['prirustek_korekce_sto_tisic'] = prirustek_korekce / (self._population[record.district] / 100000)
                            # self.__data[date][record.district]['celkem_korekce_sto_tisic'] = celkem_korekce / (self._population[record.district] / 100000)
                            
                            self.__data[date]['pcr_tests_day_max'] =                max(self.__data[date]['pcr_tests_day_max'], pcr_tests_day)
                            self.__data[date]['pcr_tests_day_100k_max'] =           max(self.__data[date]['pcr_tests_day_100k_max'], self.__data[date][record.district]['pcr_tests_day_100k'])
                            self.__data[date]['pcr_tests_alltime_max'] =            max(self.__data[date]['pcr_tests_alltime_max'], pcr_tests_alltime)
                            self.__data[date]['pcr_tests_alltime_100k_max'] = 		max(self.__data[date]['pcr_tests_alltime_100k_max'], self.__data[date][record.district]['pcr_tests_alltime_100k'])
                            # self.__data[date]['max_korekce_den'] =                      max(self.__data[date]['max_korekce_den'], prirustek_korekce)
                            # self.__data[date]['max_korekce_den_sto_tisic'] =            max(self.__data[date]['max_korekce_den_sto_tisic'], self.__data[date][record.district]['prirustek_korekce_sto_tisic'])
                            # self.__data[date]['celkem_max_korekce_den'] =               max(self.__data[date]['celkem_max_korekce_den'], celkem_korekce)
                            # self.__data[date]['celkem_max_korekce_den_sto_tisic'] =     max(self.__data[date]['celkem_max_korekce_den_sto_tisic'], self.__data[date][record.district]['celkem_korekce_sto_tisic'])
                            self.__data['pcr_tests_day_total'] =                    max(self.__data['pcr_tests_day_total'], pcr_tests_day)
                            self.__data['pcr_tests_day_100k_total'] =             	max(self.__data['pcr_tests_day_100k_total'], self.__data[date][record.district]['pcr_tests_day_100k'])
                            self.__data['pcr_tests_alltime_total'] =                max(self.__data['pcr_tests_alltime_total'], pcr_tests_alltime)
                            self.__data['pcr_tests_alltime_100k_total'] =           max(self.__data['pcr_tests_alltime_100k_total'], self.__data[date][record.district]['pcr_tests_alltime_100k'])
                            # self.__data['rozsah_max_prirustek_korekce'] =               max(self.__data['rozsah_max_prirustek_korekce'], self.__data[date][record.district]['prirustek_korekce_sto_tisic'])
                            # self.__data['rozsah_max_prirustek_korekce_sto_tisic'] =     max(self.__data['rozsah_max_prirustek_korekce_sto_tisic'], prirustek_korekce)
                            # self.__data['rozsah_max_celkem_korekce'] =                  max(self.__data['rozsah_max_celkem_korekce'], celkem_korekce)
                            # self.__data['rozsah_max_celkem_korekce_sto_tisic'] =        max(self.__data['rozsah_max_celkem_korekce'], self.__data[date][record.district]['celkem_korekce_sto_tisic'])

                    self.__data[date]['pcr_tests_new_day_count'] = pcr_tests_new_day_count
                    self.__data[date]['pcr_tests_alltime_count'] = pcr_tests_alltime_count
                    self.get_instance().__last_day = date
                
                self.__data['pcr_tests_alltime_count'] = pcr_tests_alltime_count

                # print('[CACHE] Cache is updated (' + str(get_deep_size(self.__data)) + ' bytes)')
                self.get_instance().__initialized = True
                print('[CACHE] Cache is updated')

        except sqlite3.Error as e:
            print(f"[CACHE] Database error - {e}")