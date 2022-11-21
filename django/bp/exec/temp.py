import pprint

data = {}

with open('obce.csv') as f:
    lines = f.readlines()
    for line in lines:
        splitted = line.split(';')
        data[splitted[0]] = {}
        data[splitted[0]]['nazev_obce'] = splitted[1]
        data[splitted[0]]['cislo_okresu'] = splitted[2]
        data[splitted[0]]['nazev_okresu'] = splitted[3]

pprint.pprint(data)