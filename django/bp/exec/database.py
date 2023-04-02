import sqlite3

class SQLiteConnector:
    def __init__(self):
        self.__conn = None
        self.__cursor = None
        pass
    
    def connect(self):
        try:
            conn = sqlite3.connect('sql/database.sqlite')
            self.__conn = conn
            self.__cursor = self.__conn.cursor()
            return conn
        except sqlite3.Error as e:
            print(f"Error connecting to database: {e}")
            return None
        
    def insert_commit_record(self, type, record):
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
        except sqlite3.Error as e:
            print(f"Error while closing database: {e}")
