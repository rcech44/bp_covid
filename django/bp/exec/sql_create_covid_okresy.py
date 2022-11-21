# text = "CREATE TABLE `covid_unikatni_okresy` (" \
#   "`id` bigint(20) unsigned NOT NULL AUTO_INCREMENT, " \
#   "`datum` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, " 

# okresy_nazvy = [["CZ0100", "Praha"], ["CZ0201", "Benešov"], ["CZ0202", "Beroun"], ["CZ0203", "Kladno"], ["CZ0204", "Kolín"], ["CZ0205", "Kutná Hora"], ["CZ0206", "Mělník"], ["CZ0207", "Mladá Boleslav"], ["CZ0208", "Nymburk"], ["CZ0209", "Praha-východ"], ["CZ020A", "Praha-západ"], ["CZ020B", "Příbram"], ["CZ020C", "Rakovník"], ["CZ0311", "České Budějovice"], ["CZ0312", "Český Krumlov"], ["CZ0313", "Jindřichův Hradec"], ["CZ0633", "Pelhřimov"], ["CZ0314", "Písek"], ["CZ0315", "Prachatice"], ["CZ0316", "Strakonice"], ["CZ0317", "Tábor"], ["CZ0321", "Domažlice"], ["CZ0411", "Cheb"], ["CZ0412", "Karlovy Vary"], ["CZ0322", "Klatovy"], ["CZ0323", "Plzeň-město"], ["CZ0324", "Plzeň-jih"], ["CZ0325", "Plzeň-sever"], ["CZ0326", "Rokycany"], ["CZ0413", "Sokolov"], ["CZ0327", "Tachov"], ["CZ0511", "Česká Lípa"], ["CZ0421", "Děčín"], ["CZ0422", "Chomutov"], ["CZ0512", "Jablonec n.N."], ["CZ0513", "Liberec"], ["CZ0423", "Litoměřice"], ["CZ0424", "Louny"], ["CZ0425", "Most"], ["CZ0426", "Teplice"], ["CZ0427", "Ústí n.L."], ["CZ0631", "Havlíčkův Brod"], ["CZ0521", "Hradec Králové"], ["CZ0531", "Chrudim"], ["CZ0522", "Jičín"], ["CZ0523", "Náchod"], ["CZ0532", "Pardubice"], ["CZ0524", "Rychnov n.K."], ["CZ0514", "Semily"], ["CZ0533", "Svitavy"], ["CZ0525", "Trutnov"], ["CZ0534", "Ústí n.O."], ["CZ0641", "Blansko"], ["CZ0642", "Brno-město"], ["CZ0643", "Brno-venkov"], ["CZ0644", "Břeclav"], ["CZ0724", "Zlín"], ["CZ0645", "Hodonín"], ["CZ0632", "Jihlava"], ["CZ0721", "Kroměříž"], ["CZ0713", "Prostějov"], ["CZ0634", "Třebíč"], ["CZ0722", "Uherské Hradiště"], ["CZ0646", "Vyškov"], ["CZ0647", "Znojmo"], ["CZ0635", "Žďár n.S."], ["CZ0801", "Bruntál"], ["CZ0802", "Frýdek-Místek"], ["CZ0803", "Karviná"], ["CZ0804", "Nový Jičín"], ["CZ0712", "Olomouc"], ["CZ0805", "Opava"], ["CZ0806", "Ostrava-město"], ["CZ0714", "Přerov"], ["CZ0715", "Šumperk"], ["CZ0723", "Vsetín"], ["CZ0711", "Jeseník"]]
# for okres in okresy_nazvy:
#     text += f"`{okres[0]}` bigint(20) DEFAULT NULL, "

# text += "UNIQUE KEY `id` (`id`))"

# print(text)

import sqlite3

data = {}

with open('obce.csv') as f:
    lines = f.readlines()
    for line in lines:
        splitted = line.split(';')
        data[splitted[0]] = {}
        data[splitted[0]]['nazev_obce'] = splitted[1]
        data[splitted[0]]['cislo_okresu'] = splitted[2]
        data[splitted[0]]['nazev_okresu'] = splitted[3]

try:
  with sqlite3.connect('database.sqlite') as conn:
      cur = conn.cursor()
      for key in data:
        cur.execute('INSERT INTO orp_okres_ciselnik (cislo_orp, nazev_orp, cislo_okres, nazev_okres) VALUES (?, ?, ?, ?)', [ key, data[key]['nazev_obce'], data[key]['cislo_okresu'], data[key]['nazev_okresu'] ])
      conn.commit()
except sqlite3.Error as e:
  pass
