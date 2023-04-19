import sqlite3
from datetime import datetime, timedelta
from exec.database import *

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
        max_values['infections_new_max_total'] =                        max(float(d['infections_new_max']) for d in result_values)
        max_values['max_nove_pripady_sto_tisic'] =              max(float(d['max_nove_sto_tisic']) for d in result_values)
        max_values['max_nove_pripady_7'] =                      max(float(d['max_nove_7']) for d in result_values)
        max_values['max_nove_pripady_7_sto_tisic'] =            max(float(d['max_nove_7_sto_tisic']) for d in result_values)
        max_values['max_nove_pripady_14'] =                     max(float(d['max_nove_14']) for d in result_values)
        max_values['max_nove_pripady_14_sto_tisic'] =           max(float(d['max_nove_14_sto_tisic']) for d in result_values)
        max_values['max_nove_pripady_65'] =                     max(float(d['max_nove_65']) for d in result_values)
        max_values['max_nove_pripady_65_sto_tisic'] =           max(float(d['max_nove_65_sto_tisic']) for d in result_values)

        # Maximum - vaccinations
        max_values['max_celkem_den'] =                          max(float(d['davka_celkem_den_max']) for d in result_values)
        max_values['max_celkem_den_sto_tisic'] =                max(float(d['davka_celkem_den_max_sto_tisic']) for d in result_values)
        max_values['max_celkem_doposud'] =                      max(float(d['davka_celkem_doposud_max']) for d in result_values)
        max_values['max_celkem_doposud_sto_tisic'] =            max(float(d['davka_celkem_doposud_max_sto_tisic']) for d in result_values)
        max_values['max_celkem_davka_1_den'] =                  max(float(d['davka_1_max']) for d in result_values)
        max_values['max_celkem_davka_1_den_sto_tisic'] =        max(float(d['davka_1_max_sto_tisic']) for d in result_values)
        max_values['max_celkem_davka_1_doposud'] =              max(float(d['davka_1_doposud_max']) for d in result_values)
        max_values['max_celkem_davka_1_doposud_sto_tisic'] =    max(float(d['davka_1_doposud_max_sto_tisic']) for d in result_values)
        max_values['max_celkem_davka_2_den'] =                  max(float(d['davka_2_max']) for d in result_values)
        max_values['max_celkem_davka_2_den_sto_tisic'] =        max(float(d['davka_2_max_sto_tisic']) for d in result_values)
        max_values['max_celkem_davka_2_doposud'] =              max(float(d['davka_2_doposud_max']) for d in result_values)
        max_values['max_celkem_davka_2_doposud_sto_tisic'] =    max(float(d['davka_2_doposud_max_sto_tisic']) for d in result_values)
        max_values['max_celkem_davka_3_den'] =                  max(float(d['davka_3_max']) for d in result_values)
        max_values['max_celkem_davka_3_den_sto_tisic'] =        max(float(d['davka_3_max_sto_tisic']) for d in result_values)
        max_values['max_celkem_davka_3_doposud'] =              max(float(d['davka_3_doposud_max']) for d in result_values)
        max_values['max_celkem_davka_3_doposud_sto_tisic'] =    max(float(d['davka_3_doposud_max_sto_tisic']) for d in result_values)
        max_values['max_celkem_davka_4_den'] =                  max(float(d['davka_4_max']) for d in result_values)
        max_values['max_celkem_davka_4_den_sto_tisic'] =        max(float(d['davka_4_max_sto_tisic']) for d in result_values)
        max_values['max_celkem_davka_4_doposud'] =              max(float(d['davka_4_doposud_max']) for d in result_values)
        max_values['max_celkem_davka_4_doposud_sto_tisic'] =    max(float(d['davka_4_doposud_max_sto_tisic']) for d in result_values)

        # Maximum - deaths
        max_values['celkem_max_doposud'] =                      max(float(d['max_umrti_doposud']) for d in result_values)
        max_values['celkem_max_sto_tisic_doposud'] =            max(float(d['max_umrti_doposud_sto_tisic']) for d in result_values)
        max_values['celkem_max_den'] =                          max(float(d['max_umrti_den']) for d in result_values)
        max_values['celkem_max_sto_tisic_den'] =                max(float(d['max_umrti_den_sto_tisic']) for d in result_values)

        # Maximum - PCR testing
        max_values['rozsah_max_celkem'] =                       max(float(d['celkem_max_den']) for d in result_values)
        max_values['rozsah_max_celkem_sto_tisic'] =             max(float(d['celkem_max_den_sto_tisic']) for d in result_values)
        max_values['rozsah_max_prirustek'] =                    max(float(d['max_den']) for d in result_values)
        max_values['rozsah_max_prirustek_sto_tisic'] =          max(float(d['max_den_sto_tisic']) for d in result_values)

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
                    celkem_pripady = self.__data['celkem_pripady']
                    davka_2_doposud = self.__data['davka_2_doposud']
                    absolute_celkem = self.__data['absolute_celkem']
                    celkem_doposud_testy = self.__data['celkem_doposud_testy']
                    celkem_doposud_umrti = self.__data['celkem_doposud_umrti']
                
                else:
                    davka_2_doposud = absolute_celkem = celkem_doposud_testy = celkem_doposud_umrti = 0
                    celkem_pripady = 20


                ################################
                # Download infections
                ################################

                self.__data['infections_new_max_total'] = self.__data['max_nove_pripady_sto_tisic'] = self.__data['infections_active_max_total'] = self.__data['infections_active_100k_max_total'] = 0

                for date in all_requested_dates:
                    response = db.get_records_day("infection", date)
                    self.__data[date]['celkem_pripady'] = celkem_pripady
                    nove_pocet = self.__data[date]['infections_new_max'] = self.__data[date]['max_nove_sto_tisic'] = aktivni_pocet = self.__data[date]['infections_active_max'] = self.__data[date]['infections_active_100k_max'] = self.__data[date]['max_nove_7'] = self.__data[date]['max_nove_7_sto_tisic'] = self.__data[date]['max_nove_14'] = self.__data[date]['max_nove_14_sto_tisic'] = self.__data[date]['max_nove_65'] = self.__data[date]['max_nove_65_sto_tisic'] = 0
                    for okres in response:
                        if okres[2] is not None:
                            self.__data[date][okres[2]] = {}
                            self.__data[date][okres[2]]['infections_new'] = okres[3]
                            self.__data[date][okres[2]]['infections_active'] = okres[4]
                            self.__data[date][okres[2]]['nove_pripady_7'] = okres[5]
                            self.__data[date][okres[2]]['nove_pripady_14'] = okres[6]
                            self.__data[date][okres[2]]['nove_pripady_65'] = okres[7]
                            self.__data[date][okres[2]]['nove_pripady_sto_tisic'] = okres[3] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['infections_active_100k'] = okres[4] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['nove_pripady_7_sto_tisic'] = okres[5] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['nove_pripady_14_sto_tisic'] = okres[6] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['nove_pripady_65_sto_tisic'] = okres[7] / (self._population[okres[2]] / 100000)

                            nove_pocet += okres[3]
                            aktivni_pocet += okres[4]

                            self.__data[date]['infections_new_max'] =                 max(self.__data[date]['infections_new_max'], self.__data[date][okres[2]]['infections_new'])
                            self.__data[date]['max_nove_sto_tisic'] =       max(self.__data[date]['max_nove_sto_tisic'], self.__data[date][okres[2]]['nove_pripady_sto_tisic'])
                            self.__data[date]['infections_active_max'] =              max(self.__data[date]['infections_active_max'], self.__data[date][okres[2]]['infections_active'])
                            self.__data[date]['infections_active_100k_max'] =    max(self.__data[date]['infections_active_100k_max'], self.__data[date][okres[2]]['infections_active_100k'])
                            self.__data[date]['max_nove_7'] =               max(self.__data[date]['max_nove_7'], self.__data[date][okres[2]]['nove_pripady_7'])
                            self.__data[date]['max_nove_14'] =              max(self.__data[date]['max_nove_14'], self.__data[date][okres[2]]['nove_pripady_14'])
                            self.__data[date]['max_nove_65'] =              max(self.__data[date]['max_nove_65'], self.__data[date][okres[2]]['nove_pripady_65'])
                            self.__data[date]['max_nove_7_sto_tisic'] =     max(self.__data[date]['max_nove_7_sto_tisic'], self.__data[date][okres[2]]['nove_pripady_7_sto_tisic'])
                            self.__data[date]['max_nove_14_sto_tisic'] =    max(self.__data[date]['max_nove_14_sto_tisic'], self.__data[date][okres[2]]['nove_pripady_14_sto_tisic'])
                            self.__data[date]['max_nove_65_sto_tisic'] =    max(self.__data[date]['max_nove_65_sto_tisic'], self.__data[date][okres[2]]['nove_pripady_65_sto_tisic'])
                            self.__data['infections_new_max_total'] =               max(self.__data['infections_new_max_total'], self.__data[date][okres[2]]['infections_new'])
                            self.__data['max_nove_pripady_sto_tisic'] =     max(self.__data['max_nove_pripady_sto_tisic'], self.__data[date][okres[2]]['nove_pripady_sto_tisic'])
                            self.__data['infections_active_max_total'] =            max(self.__data['infections_active_max_total'], self.__data[date][okres[2]]['infections_active'])
                            self.__data['infections_active_100k_max_total'] =  max(self.__data['infections_active_100k_max_total'], self.__data[date][okres[2]]['infections_active_100k'])
                        else:
                            nove_pocet += okres[3] 

                    celkem_pripady += nove_pocet
                    self.__data[date]['celkem_pripady'] = celkem_pripady
                    self.__data[date]['nove_celkovy_pocet'] = nove_pocet

                self.__data['celkem_pripady'] = celkem_pripady
                
                ################################
                # Download vaccinations
                ################################
                    
                okres_absolute_celkem = self.__data['okres_absolute_max'] = self.__data['max_celkem_davka_1_den'] = self.__data['max_celkem_davka_2_den'] = self.__data['max_celkem_davka_3_den'] = self.__data['max_celkem_davka_4_den'] = self.__data['max_celkem_den'] = self.__data['max_celkem_davka_1_doposud'] = self.__data['max_celkem_davka_2_doposud'] = self.__data['max_celkem_davka_3_doposud'] = self.__data['max_celkem_davka_4_doposud'] = self.__data['max_celkem_doposud'] = self.__data['max_celkem_davka_1_den_sto_tisic'] = self.__data['max_celkem_davka_2_den_sto_tisic'] = self.__data['max_celkem_davka_3_den_sto_tisic'] = self.__data['max_celkem_davka_4_den_sto_tisic'] = self.__data['max_celkem_den_sto_tisic'] = self.__data['max_celkem_davka_1_doposud_sto_tisic'] = self.__data['max_celkem_davka_2_doposud_sto_tisic'] = self.__data['max_celkem_davka_3_doposud_sto_tisic'] = self.__data['max_celkem_davka_4_doposud_sto_tisic'] = self.__data['max_celkem_doposud_sto_tisic'] = 0

                for date in all_requested_dates:
                    response = db.get_records_day("vaccination", date)
                    self.__data[date]['davka_1_max'] = self.__data[date]['davka_2_max'] = self.__data[date]['davka_3_max'] = self.__data[date]['davka_4_max'] = self.__data[date]['davka_1_max_sto_tisic'] = self.__data[date]['davka_2_max_sto_tisic'] = self.__data[date]['davka_3_max_sto_tisic'] = self.__data[date]['davka_4_max_sto_tisic'] = self.__data[date]['davka_1_doposud_max'] = self.__data[date]['davka_2_doposud_max'] = self.__data[date]['davka_3_doposud_max'] = self.__data[date]['davka_4_doposud_max'] = self.__data[date]['davka_1_doposud_max_sto_tisic'] = self.__data[date]['davka_2_doposud_max_sto_tisic'] = self.__data[date]['davka_3_doposud_max_sto_tisic'] = self.__data[date]['davka_4_doposud_max_sto_tisic'] = self.__data[date]['davka_celkem_den_max'] = self.__data[date]['davka_celkem_den_max_sto_tisic'] = self.__data[date]['davka_celkem_doposud_max'] = self.__data[date]['davka_celkem_doposud_max_sto_tisic'] = celkem_den = celkem_doposud = 0
                    for okres in response:
                        if okres[2] is not None:
                            # Process data and get 100 thousand count
                            self.__data[date][okres[2]]['davka_1_den'] = okres[3]
                            self.__data[date][okres[2]]['davka_1_den_sto_tisic'] = okres[3] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['davka_1_doposud'] = okres[4]
                            self.__data[date][okres[2]]['davka_1_doposud_sto_tisic'] = okres[4] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['davka_2_den'] = okres[5]
                            self.__data[date][okres[2]]['davka_2_den_sto_tisic'] = okres[5] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['davka_2_doposud'] = okres[6]
                            self.__data[date][okres[2]]['davka_2_doposud_sto_tisic'] = okres[6] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['davka_3_den'] = okres[7]
                            self.__data[date][okres[2]]['davka_3_den_sto_tisic'] = okres[7] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['davka_3_doposud'] = okres[8]
                            self.__data[date][okres[2]]['davka_3_doposud_sto_tisic'] = okres[8] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['davka_4_den'] = okres[9]
                            self.__data[date][okres[2]]['davka_4_den_sto_tisic'] = okres[9] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['davka_4_doposud'] = okres[10]
                            self.__data[date][okres[2]]['davka_4_doposud_sto_tisic'] = okres[10] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['davka_celkem_den'] = okres[11]
                            celkem_den += okres[11]
                            celkem_doposud += okres[12]
                            davka_2_doposud += okres[5]
                            absolute_celkem += (okres[3] + okres[5] + okres[7] + okres[9])
                            self.__data[date][okres[2]]['davka_celkem_den_sto_tisic'] = okres[11] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['davka_celkem_doposud'] = okres[12]
                            self.__data[date][okres[2]]['davka_celkem_doposud_sto_tisic'] = okres[12] / (self._population[okres[2]] / 100000)

                            # Get minimums and maximums
                            self.__data[date]['davka_1_max'] =                              max(self.__data[date]['davka_1_max'], self.__data[date][okres[2]]['davka_1_den'])
                            self.__data[date]['davka_2_max'] =                              max(self.__data[date]['davka_2_max'], self.__data[date][okres[2]]['davka_2_den'])
                            self.__data[date]['davka_3_max'] =                              max(self.__data[date]['davka_3_max'], self.__data[date][okres[2]]['davka_3_den'])
                            self.__data[date]['davka_4_max'] =                              max(self.__data[date]['davka_4_max'], self.__data[date][okres[2]]['davka_4_den'])
                            self.__data[date]['davka_1_max_sto_tisic'] =                    max(self.__data[date]['davka_1_max_sto_tisic'], self.__data[date][okres[2]]['davka_1_den_sto_tisic'])
                            self.__data[date]['davka_2_max_sto_tisic'] =                    max(self.__data[date]['davka_2_max_sto_tisic'], self.__data[date][okres[2]]['davka_2_den_sto_tisic'])
                            self.__data[date]['davka_3_max_sto_tisic'] =                    max(self.__data[date]['davka_3_max_sto_tisic'], self.__data[date][okres[2]]['davka_3_den_sto_tisic'])
                            self.__data[date]['davka_4_max_sto_tisic'] =                    max(self.__data[date]['davka_4_max_sto_tisic'], self.__data[date][okres[2]]['davka_4_den_sto_tisic'])
                            self.__data[date]['davka_1_doposud_max'] =                      max(self.__data[date]['davka_1_doposud_max'], self.__data[date][okres[2]]['davka_1_doposud'])
                            self.__data[date]['davka_2_doposud_max'] =                      max(self.__data[date]['davka_2_doposud_max'], self.__data[date][okres[2]]['davka_2_doposud'])
                            self.__data[date]['davka_3_doposud_max'] =                      max(self.__data[date]['davka_3_doposud_max'], self.__data[date][okres[2]]['davka_3_doposud'])
                            self.__data[date]['davka_4_doposud_max'] =                      max(self.__data[date]['davka_4_doposud_max'], self.__data[date][okres[2]]['davka_4_doposud'])
                            self.__data[date]['davka_1_doposud_max_sto_tisic'] =            max(self.__data[date]['davka_1_doposud_max_sto_tisic'], self.__data[date][okres[2]]['davka_1_doposud_sto_tisic'])
                            self.__data[date]['davka_2_doposud_max_sto_tisic'] =            max(self.__data[date]['davka_2_doposud_max_sto_tisic'], self.__data[date][okres[2]]['davka_2_doposud_sto_tisic'])
                            self.__data[date]['davka_3_doposud_max_sto_tisic'] =            max(self.__data[date]['davka_3_doposud_max_sto_tisic'], self.__data[date][okres[2]]['davka_3_doposud_sto_tisic'])
                            self.__data[date]['davka_4_doposud_max_sto_tisic'] =            max(self.__data[date]['davka_4_doposud_max_sto_tisic'], self.__data[date][okres[2]]['davka_4_doposud_sto_tisic'])
                            self.__data[date]['davka_celkem_den_max'] =                     max(self.__data[date]['davka_celkem_den_max'], self.__data[date][okres[2]]['davka_celkem_den'])
                            self.__data[date]['davka_celkem_den_max_sto_tisic'] =           max(self.__data[date]['davka_celkem_den_max_sto_tisic'], self.__data[date][okres[2]]['davka_celkem_den_sto_tisic'])
                            self.__data[date]['davka_celkem_doposud_max'] =                 max(self.__data[date]['davka_celkem_doposud_max'], self.__data[date][okres[2]]['davka_celkem_doposud'])
                            self.__data[date]['davka_celkem_doposud_max_sto_tisic'] =       max(self.__data[date]['davka_celkem_doposud_max_sto_tisic'], self.__data[date][okres[2]]['davka_celkem_doposud_sto_tisic'])
                            self.__data['okres_absolute_max'] =                             max(self.__data['okres_absolute_max'], self.__data[date][okres[2]]['davka_celkem_doposud'])
                            self.__data['max_celkem_davka_1_den'] =                         max(self.__data['max_celkem_davka_1_den'], self.__data[date][okres[2]]['davka_1_den'])
                            self.__data['max_celkem_davka_2_den'] =                         max(self.__data['max_celkem_davka_2_den'], self.__data[date][okres[2]]['davka_2_den'])
                            self.__data['max_celkem_davka_3_den'] =                         max(self.__data['max_celkem_davka_3_den'], self.__data[date][okres[2]]['davka_3_den'])
                            self.__data['max_celkem_davka_4_den'] =                         max(self.__data['max_celkem_davka_4_den'], self.__data[date][okres[2]]['davka_4_den'])
                            self.__data['max_celkem_den'] =                                 max(self.__data['max_celkem_den'], self.__data[date][okres[2]]['davka_celkem_den'])
                            self.__data['max_celkem_davka_1_doposud'] =                     max(self.__data['max_celkem_davka_1_doposud'], self.__data[date][okres[2]]['davka_1_doposud'])
                            self.__data['max_celkem_davka_2_doposud'] =                     max(self.__data['max_celkem_davka_2_doposud'], self.__data[date][okres[2]]['davka_2_doposud'])
                            self.__data['max_celkem_davka_3_doposud'] =                     max(self.__data['max_celkem_davka_3_doposud'], self.__data[date][okres[2]]['davka_3_doposud'])
                            self.__data['max_celkem_davka_4_doposud'] =                     max(self.__data['max_celkem_davka_4_doposud'], self.__data[date][okres[2]]['davka_4_doposud'])
                            self.__data['max_celkem_doposud'] =                             max(self.__data['max_celkem_doposud'], self.__data[date][okres[2]]['davka_celkem_doposud'])
                            self.__data['max_celkem_davka_1_den_sto_tisic'] =               max(self.__data['max_celkem_davka_1_den_sto_tisic'], self.__data[date][okres[2]]['davka_1_den_sto_tisic'])
                            self.__data['max_celkem_davka_2_den_sto_tisic'] =               max(self.__data['max_celkem_davka_2_den_sto_tisic'], self.__data[date][okres[2]]['davka_2_den_sto_tisic'])
                            self.__data['max_celkem_davka_3_den_sto_tisic'] =               max(self.__data['max_celkem_davka_3_den_sto_tisic'], self.__data[date][okres[2]]['davka_3_den_sto_tisic'])
                            self.__data['max_celkem_davka_4_den_sto_tisic'] =               max(self.__data['max_celkem_davka_4_den_sto_tisic'], self.__data[date][okres[2]]['davka_4_den_sto_tisic'])
                            self.__data['max_celkem_den_sto_tisic'] =                       max(self.__data['max_celkem_den_sto_tisic'], self.__data[date][okres[2]]['davka_celkem_den_sto_tisic'])
                            self.__data['max_celkem_davka_1_doposud_sto_tisic'] =           max(self.__data['max_celkem_davka_1_doposud_sto_tisic'], self.__data[date][okres[2]]['davka_1_doposud_sto_tisic'])
                            self.__data['max_celkem_davka_2_doposud_sto_tisic'] =           max(self.__data['max_celkem_davka_2_doposud_sto_tisic'], self.__data[date][okres[2]]['davka_2_doposud_sto_tisic'])
                            self.__data['max_celkem_davka_3_doposud_sto_tisic'] =           max(self.__data['max_celkem_davka_3_doposud_sto_tisic'], self.__data[date][okres[2]]['davka_3_doposud_sto_tisic'])
                            self.__data['max_celkem_davka_4_doposud_sto_tisic'] =           max(self.__data['max_celkem_davka_4_doposud_sto_tisic'], self.__data[date][okres[2]]['davka_4_doposud_sto_tisic'])
                            self.__data['max_celkem_doposud_sto_tisic'] =                   max(self.__data['max_celkem_doposud_sto_tisic'], self.__data[date][okres[2]]['davka_celkem_doposud_sto_tisic'])

                    self.__data[date]['davka_celkem_den'] = celkem_den
                    self.__data[date]['davka_celkem_doposud'] = celkem_doposud
                    self.__data[date]['davka_2_doposud'] = davka_2_doposud
                
                self.__data['absolute_celkem'] = absolute_celkem
                self.__data['davka_2_doposud'] = davka_2_doposud
                self.__data['okres_absolute_max'] = okres_absolute_celkem

                ################################
                # Download deaths
                ################################

                self.__data['celkem_max_den'] = self.__data['celkem_max_sto_tisic_den'] = self.__data['celkem_max_doposud'] = self.__data['celkem_max_sto_tisic_doposud'] = 0
                for date in all_requested_dates:
                    response = db.get_records_day("death", date)
                    self.__data[date]['celkem_umrti'] = celkem_den = self.__data[date]['max_umrti_den'] = self.__data[date]['max_umrti_den_sto_tisic'] = self.__data[date]['max_umrti_doposud'] = self.__data[date]['max_umrti_doposud_sto_tisic'] = 0
                    for okres in response:
                        if okres[2] is not None:
                            celkem_den += okres[3]
                            celkem_doposud_umrti += okres[3]
                            self.__data[date][okres[2]]['umrti_den'] = okres[3]
                            self.__data[date][okres[2]]['umrti_doposud'] = okres[4]
                            self.__data[date][okres[2]]['umrti_den_sto_tisic'] = okres[3] / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['umrti_doposud_sto_tisic'] = okres[4] / (self._population[okres[2]] / 100000)
                            
                            self.__data[date]['max_umrti_den'] =                            max(self.__data[date]['max_umrti_den'], self.__data[date][okres[2]]['umrti_den'])
                            self.__data[date]['max_umrti_den_sto_tisic'] =                  max(self.__data[date]['max_umrti_den_sto_tisic'], self.__data[date][okres[2]]['umrti_den_sto_tisic'])
                            self.__data[date]['max_umrti_doposud'] =                        max(self.__data[date]['max_umrti_doposud'], self.__data[date][okres[2]]['umrti_doposud'])
                            self.__data[date]['max_umrti_doposud_sto_tisic'] =              max(self.__data[date]['max_umrti_doposud_sto_tisic'], self.__data[date][okres[2]]['umrti_doposud_sto_tisic'])
                            self.__data['celkem_max_den'] =                                 max(self.__data['celkem_max_den'], self.__data[date][okres[2]]['umrti_den'])
                            self.__data['celkem_max_sto_tisic_den'] =                       max(self.__data['celkem_max_sto_tisic_den'], self.__data[date][okres[2]]['umrti_den_sto_tisic'])
                            self.__data['celkem_max_doposud'] =                             max(self.__data['celkem_max_doposud'], self.__data[date][okres[2]]['umrti_doposud'])
                            self.__data['celkem_max_sto_tisic_doposud'] =                   max(self.__data['celkem_max_sto_tisic_doposud'], self.__data[date][okres[2]]['umrti_doposud_sto_tisic'])

                    self.__data[date]['celkem_den'] = celkem_den
                    self.__data[date]['celkem_doposud'] = celkem_doposud_umrti
                
                self.__data['celkem_doposud_umrti'] = celkem_doposud_umrti

                ################################
                # Download testing infromation
                ################################

                self.__data['rozsah_max_prirustek'] = self.__data['rozsah_max_prirustek_sto_tisic'] = self.__data['rozsah_max_celkem'] = self.__data['rozsah_max_celkem_sto_tisic'] = self.__data['rozsah_max_prirustek_korekce'] = self.__data['rozsah_max_prirustek_korekce_sto_tisic'] = self.__data['rozsah_max_celkem_korekce'] = self.__data['rozsah_max_celkem_korekce_sto_tisic'] = 0

                for date in all_requested_dates:
                    response = db.get_records_day("pcr_test", date)

                    self.__data[date]['celkem_testovani'] = celkem_den_prirustek = celkem_den_celkem = self.__data[date]['max_den'] = self.__data[date]['max_den_sto_tisic'] = self.__data[date]['celkem_max_den'] = self.__data[date]['celkem_max_den_sto_tisic'] = self.__data[date]['max_korekce_den'] = self.__data[date]['max_korekce_den_sto_tisic'] = self.__data[date]['celkem_max_korekce_den'] = self.__data[date]['celkem_max_korekce_den_sto_tisic'] = 0

                    for okres in response:
                        if okres[2] is not None:
                            prirustek = celkem = prirustek_korekce = celkem_korekce = 0
                            if okres[3] is not None: prirustek = okres[3]
                            if okres[4] is not None: celkem = okres[4]
                            if okres[5] is not None: prirustek_korekce = okres[5]
                            if okres[6] is not None: celkem_korekce = okres[6]

                            celkem_den_prirustek += prirustek
                            celkem_den_celkem += okres[4]
                            celkem_doposud_testy += prirustek
                            self.__data[date][okres[2]]['prirustek'] = prirustek
                            self.__data[date][okres[2]]['celkem'] = celkem
                            self.__data[date][okres[2]]['prirustek_sto_tisic'] = prirustek / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['celkem_sto_tisic'] = celkem / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['prirustek_korekce'] = prirustek_korekce
                            self.__data[date][okres[2]]['celkem_korekce'] = celkem_korekce
                            self.__data[date][okres[2]]['prirustek_korekce_sto_tisic'] = prirustek_korekce / (self._population[okres[2]] / 100000)
                            self.__data[date][okres[2]]['celkem_korekce_sto_tisic'] = celkem_korekce / (self._population[okres[2]] / 100000)
                            
                            self.__data[date]['max_den'] =                              max(self.__data[date]['max_den'], prirustek)
                            self.__data[date]['max_den_sto_tisic'] =                    max(self.__data[date]['max_den_sto_tisic'], self.__data[date][okres[2]]['prirustek_sto_tisic'])
                            self.__data[date]['celkem_max_den'] =                       max(self.__data[date]['celkem_max_den'], celkem)
                            self.__data[date]['celkem_max_den_sto_tisic'] =             max(self.__data[date]['celkem_max_den_sto_tisic'], self.__data[date][okres[2]]['celkem_sto_tisic'])
                            self.__data[date]['max_korekce_den'] =                      max(self.__data[date]['max_korekce_den'], prirustek_korekce)
                            self.__data[date]['max_korekce_den_sto_tisic'] =            max(self.__data[date]['max_korekce_den_sto_tisic'], self.__data[date][okres[2]]['prirustek_korekce_sto_tisic'])
                            self.__data[date]['celkem_max_korekce_den'] =               max(self.__data[date]['celkem_max_korekce_den'], celkem_korekce)
                            self.__data[date]['celkem_max_korekce_den_sto_tisic'] =     max(self.__data[date]['celkem_max_korekce_den_sto_tisic'], self.__data[date][okres[2]]['celkem_korekce_sto_tisic'])
                            self.__data['rozsah_max_prirustek'] =                       max(self.__data['rozsah_max_prirustek'], prirustek)
                            self.__data['rozsah_max_prirustek_sto_tisic'] =             max(self.__data['rozsah_max_prirustek_sto_tisic'], self.__data[date][okres[2]]['prirustek_sto_tisic'])
                            self.__data['rozsah_max_celkem'] =                          max(self.__data['rozsah_max_celkem'], celkem)
                            self.__data['rozsah_max_celkem_sto_tisic'] =                max(self.__data['rozsah_max_celkem_sto_tisic'], self.__data[date][okres[2]]['celkem_sto_tisic'])
                            self.__data['rozsah_max_prirustek_korekce'] =               max(self.__data['rozsah_max_prirustek_korekce'], self.__data[date][okres[2]]['prirustek_korekce_sto_tisic'])
                            self.__data['rozsah_max_prirustek_korekce_sto_tisic'] =     max(self.__data['rozsah_max_prirustek_korekce_sto_tisic'], prirustek_korekce)
                            self.__data['rozsah_max_celkem_korekce'] =                  max(self.__data['rozsah_max_celkem_korekce'], celkem_korekce)
                            self.__data['rozsah_max_celkem_korekce_sto_tisic'] =        max(self.__data['rozsah_max_celkem_korekce'], self.__data[date][okres[2]]['celkem_korekce_sto_tisic'])

                    self.__data[date]['celkem_prirustek_den'] = celkem_den_prirustek
                    self.__data[date]['celkem_celkem_den'] = celkem_den_celkem
                    self.get_instance().__last_day = date
                
                self.__data['celkem_doposud_testy'] = celkem_doposud_testy

                # print('[CACHE] Cache is updated (' + str(get_deep_size(self.__data)) + ' bytes)')
                self.get_instance().__initialized = True
                print('[CACHE] Cache is updated')

        except sqlite3.Error as e:
            print(f"[CACHE] Database error - {e}")