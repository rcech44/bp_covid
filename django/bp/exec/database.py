import sqlite3

class SQLiteDatabase:
    _instance = None

    def __init__(self):
        pass

    def __new__(cls):
        if cls._instance is None:
            try:
                cls._instance = super().__new__(cls)
                # sqlite3.connect('sql/database.sqlite', check_same_thread=False)
                cls._instance.__conn = sqlite3.connect('sql/database.sqlite', check_same_thread=False)
                cls._instance.__cursor = cls._instance.__conn.cursor()
                cls._instance.__conn.execute("PRAGMA read_committed = true;");
            except sqlite3.Error as e:
                print(f"Error connecting to database: {e}")
                return None
        return cls._instance
    
    def get_connection(self):
        return self.__conn
        
    def insert_record(self, type, record):
        try:
            if type == "infection":
                self.__cursor.execute('INSERT INTO covid_infections (date, district, infections_new, infections_active, infections_new_7, infections_new_14, infections_new_65_age) VALUES (?, ?, ?, ?, ?, ?, ?)', \
                [
                    record['date'],
                    record['district'],
                    record['infections_new'],
                    record['infections_active'],
                    record['infections_new_7'],
                    record['infections_new_14'],
                    record['infections_new_65_age'],
                ])
                # self.commit()
            if type == "death":
                self.__cursor.execute('INSERT INTO covid_deaths (date, district, deaths_day, deaths_alltime) VALUES (?, ?, ?, ?)', \
                [
                    record['date'],
                    record['district'],
                    record['deaths_day'],
                    record['deaths_alltime'],
                ])
                # self.commit()
            if type == "vaccination":
                self.__cursor.execute('INSERT INTO covid_vaccinations (date, district, dose_1_day, dose_1_alltime, dose_2_day, dose_2_alltime, dose_3_day, dose_3_alltime, dose_4_day, dose_4_alltime, doses_day, doses_alltime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', \
                [
                    record['date'],
                    record['district'],
                    record['vaccination_1_dose_day'],
                    record['vaccination_1_dose_alltime'],
                    record['vaccination_2_dose_day'],
                    record['vaccination_2_dose_alltime'],
                    record['vaccination_3_dose_day'],
                    record['vaccination_3_dose_alltime'],
                    record['vaccination_4_dose_day'],
                    record['vaccination_4_dose_alltime'],
                    record['vaccination_doses_day'],
                    record['vaccination_doses_alltime'],
                ])
                # self.commit()
            if type == "pcr_test":
                self.__cursor.execute('INSERT INTO covid_pcr_tests (date, district, tests_new, tests_alltime, tests_new_correction, tests_alltime_correction) VALUES (?, ?, ?, ?, ?, ?)', \
                [
                    record['date'],
                    record['district'],
                    record['pcr_tests_day'],
                    record['pcr_tests_alltime'],
                    record['pcr_tests_day_correction'],
                    record['pcr_tests_alltime_correction']
                    
                ])
                # self.commit()
        except sqlite3.Error as e:
            print(f"Error while inserting to database: {e}")
    
    def get_date_of_latest_record(self, type):
        try:
            if type is None:
                table = "SELECT id, date FROM covid_infections ORDER BY date DESC LIMIT 1"     
            elif type == "infection":
                table = "SELECT id, date FROM covid_infections ORDER BY date DESC LIMIT 1"
            elif type == "vaccination":
                table = "SELECT id, date FROM covid_vaccinations ORDER BY date DESC LIMIT 1"
            elif type == "death":
                table = "SELECT id, date FROM covid_deaths ORDER BY date DESC LIMIT 1"
            elif type == "pcr_test":
                table = "SELECT id, date FROM covid_pcr_tests ORDER BY date DESC LIMIT 1"

            self.__cursor.execute(table)
            response = self.__cursor.fetchone()
            return response[1]
        except sqlite3.Error as e:
            print(f"Error while getting data from database: {e}")

    def get_record(self, type, district, day):
        try:
            if type == "infection":
                table = "SELECT * FROM covid_infections WHERE district = ? AND date = ?"
            if type == "pcr_test":
                table = "SELECT * FROM covid_pcr_tests WHERE district = ? AND date = ?"
            if type == "vaccination":
                table = "SELECT * FROM covid_vaccinations WHERE district = ? AND date = ?"
            if type == "death":
                table = "SELECT * FROM covid_deaths WHERE district = ? AND date = ?"

            self.__cursor.execute(table, [district, day])
            response = self.__cursor.fetchone()
            return response
        except sqlite3.Error as e:
            print(f"Error while getting data from database: {e}")

    def get_records_day(self, type, day):
        try:
            if type == "vaccination":
                table = "SELECT * FROM covid_vaccinations WHERE date = ?"
            if type == "death":
                table = "SELECT * FROM covid_deaths WHERE date = ?"
            if type == "infection":
                table = "SELECT * FROM covid_infections WHERE date = ?"
            if type == "pcr_test":
                table = "SELECT * FROM covid_pcr_tests WHERE date = ?"

            self.__cursor.execute(table, [day])
            response = self.__cursor.fetchall()
            return response
        except sqlite3.Error as e:
            print(f"Error while getting data from database: {e}")

    def get_orp(self, code):
        try:
            self.__cursor.execute("SELECT cislo_okres FROM district_orp_table WHERE cislo_orp = ?", [code])
            response = self.__cursor.fetchone()
            if response is None:
                return None
            return response[0]
        except sqlite3.Error as e:
            print(f"Error while getting data from database: {e}")

    def commit(self):
        try:
            self.__conn.commit()
            self.__cursor = self.__conn.cursor()
        except sqlite3.Error as e:
            print(f"Error while commiting to database: {e}")

    def close(self):
        try:
            self.__conn.close()
            self.__cursor = None
            self.__conn = None
        except sqlite3.Error as e:
            print(f"Error while closing database: {e}")
