import sqlite3

class SQLiteConnector:
    _instance = None

    def __init__(self):
        pass

    def __new__(cls):
        if cls._instance is None:
            try:
                cls._instance = super().__new__(cls)
                sqlite3.connect('sql/database.sqlite', check_same_thread=False)
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
                self.__cursor.execute('INSERT INTO covid_datum_okres (datum, okres, nove_pripady, aktivni_pripady, nove_pripady_7, nove_pripady_14, nove_pripady_65_vek) VALUES (?, ?, ?, ?, ?, ?, ?)', \
                [
                    record['date'],
                    record['district'],
                    record['nove_pripady'],
                    record['aktivni_pripady'],
                    record['nove_pripady_7'],
                    record['nove_pripady_14'],
                    record['nove_pripady_65_vek'],
                ])
                # self.commit()
            if type == "death":
                self.__cursor.execute('INSERT INTO umrti_datum_okres (datum, okres, umrti_den, umrti_doposud) VALUES (?, ?, ?, ?)', \
                [
                    record['date'],
                    record['district'],
                    record['umrti_den'],
                    record['umrti_doposud'],
                ])
                # self.commit()
            if type == "vaccination":
                self.__cursor.execute('INSERT INTO ockovani_datum_okres (datum, okres, davka_1_den, davka_1_doposud, davka_2_den, davka_2_doposud, davka_3_den, davka_3_doposud, davka_4_den, davka_4_doposud, davka_celkem_den, davka_celkem_doposud) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', \
                [
                    record['date'],
                    record['district'],
                    record['davka_1_den'],
                    record['davka_1_doposud'],
                    record['davka_2_den'],
                    record['davka_2_doposud'],
                    record['davka_3_den'],
                    record['davka_3_doposud'],
                    record['davka_4_den'],
                    record['davka_4_doposud'],
                    record['davka_celkem_den'],
                    record['davka_celkem_doposud'],
                ])
                # self.commit()
            if type == "pcr_test":
                self.__cursor.execute('INSERT INTO testovani_datum_okres (datum, okres, prirustek, celkem, prirustek_korekce, celkem_korekce) VALUES (?, ?, ?, ?, ?, ?)', \
                [
                    record['date'],
                    record['district'],
                    record['prirustek'],
                    record['celkem'],
                    record['prirustek_korekce'],
                    record['celkem_korekce']
                    
                ])
                # self.commit()
        except sqlite3.Error as e:
            print(f"Error while inserting to database: {e}")
    
    def get_date_of_latest_record(self, type):
        try:
            if type is None:
                table = "SELECT id, datum FROM covid_datum_okres ORDER BY datum DESC LIMIT 1"     
            elif type == "infection":
                table = "SELECT id, datum FROM covid_datum_okres ORDER BY datum DESC LIMIT 1"
            elif type == "vaccination":
                table = "SELECT id, datum FROM ockovani_datum_okres ORDER BY datum DESC LIMIT 1"
            elif type == "death":
                table = "SELECT id, datum FROM umrti_datum_okres ORDER BY datum DESC LIMIT 1"
            elif type == "pcr_test":
                table = "SELECT id, datum FROM testovani_datum_okres ORDER BY datum DESC LIMIT 1"

            self.__cursor.execute(table)
            response = self.__cursor.fetchone()
            return response[1]
        except sqlite3.Error as e:
            print(f"Error while getting data from database: {e}")

    def get_record(self, type, district, day):
        try:
            if type == "vaccination":
                table = "SELECT * FROM ockovani_datum_okres WHERE okres = ? AND datum = ?"
            if type == "death":
                table = "SELECT * FROM umrti_datum_okres WHERE okres = ? AND datum = ?"

            self.__cursor.execute(table, [district, day])
            response = self.__cursor.fetchone()
            return response
        except sqlite3.Error as e:
            print(f"Error while getting data from database: {e}")

    def get_records_day(self, type, day):
        try:
            if type == "vaccination":
                table = "SELECT * FROM ockovani_datum_okres WHERE datum = ?"
            if type == "death":
                table = "SELECT * FROM umrti_datum_okres WHERE datum = ?"
            if type == "infection":
                table = "SELECT * FROM covid_datum_okres WHERE datum = ?"
            if type == "pcr_test":
                table = "SELECT * FROM testovani_datum_okres WHERE datum = ?"

            self.__cursor.execute(table, [day])
            response = self.__cursor.fetchall()
            return response
        except sqlite3.Error as e:
            print(f"Error while getting data from database: {e}")

    def get_orp(self, code):
        try:
            self.__cursor.execute("SELECT cislo_okres FROM orp_okres_ciselnik WHERE cislo_orp = ?", [code])
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
