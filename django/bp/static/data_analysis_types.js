// This dictionary holds information about what to draw from data according to current selected analysis when requested

data_analysis_types = {
    "Současně nakažení":
    {
        value: "aktivni_pripady",
        max_value: "max_aktivni",
        min_value: "min_aktivni",
        max_range: 'max_aktivni_pripady',
        text: "Současný počet nakažených",
        value_100: "aktivni_pripady_sto_tisic",
        max_value_100: "max_aktivni_sto_tisic",
        min_value_100: "min_aktivni_sto_tisic",
        max_range_100: 'max_aktivni_pripady_sto_tisic',
        text_100: "Současný počet nakažených na 100 tisíc obyvatel"
    },
    "Nové případy":
    {
        value: "nove_pripady",
        max_value: "max_nove",
        min_value: "min_nove",
        max_range: 'max_nove_pripady',
        text: "Počet nově nakažených",
        value_100: "nove_pripady_sto_tisic",
        max_value_100: "max_nove_sto_tisic",
        min_value_100: "min_nove_sto_tisic",
        max_range_100: 'max_nove_pripady_sto_tisic',
        text_100: "Počet nově nakažených na 100 tisíc obyvatel"
    },
    "Nové případy za poslední týden":
    {
        value: "nove_pripady_7",
        max_value: "max_nove_7",
        min_value: "min_nove_7",
        max_range: 'max_nove_pripady_7',
        text: "Počet nově nakažených za posledních 7 dní",
        value_100: "nove_pripady_7_sto_tisic",
        max_value_100: "max_nove_7_sto_tisic",
        min_value_100: "min_nove_7_sto_tisic",
        max_range_100: 'max_nove_pripady_7_sto_tisic',
        text_100: "Počet nově nakažených za posledních 7 dní na 100 tisíc obyvatel"
    },
    "Nové případy za poslední dva týdny":
    {
        value: "nove_pripady_14",
        max_value: "max_nove_14",
        min_value: "min_nove_14",
        max_range: 'max_nove_pripady_14',
        text: "Počet nově nakažených za posledních 14 dní",
        value_100: "nove_pripady_14_sto_tisic",
        max_value_100: "max_nove_14_sto_tisic",
        min_value_100: "min_nove_14_sto_tisic",
        max_range_100: 'max_nove_pripady_14_sto_tisic',
        text_100: "Počet nově nakažených za posledních 14 dní na 100 tisíc obyvatel"
    },
    "Nové případy lidí starších 65 let":
    {
        value: "nove_pripady_65",
        max_value: "max_nove_65",
        min_value: "min_nove_65",
        max_range: 'max_nove_pripady_65',
        text: "Počet nově nakažených lidí starších 65 let",
        value_100: "nove_pripady_65_sto_tisic",
        max_value_100: "max_nove_65_sto_tisic",
        min_value_100: "min_nove_65_sto_tisic",
        max_range_100: 'max_nove_pripady_65_sto_tisic',
        text_100: "Počet nově nakažených lidí starších 65 let na 100 tisíc obyvatel"
    },
    "Všechny dávky tento den":
    {
        value: "davka_celkem_den",
        max_value: "davka_celkem_den_max",
        min_value: "davka_celkem_den_min",
        text: "Naočkovaní obyvatelé",
        value_100: "davka_celkem_den_sto_tisic",
        max_value_100: "davka_celkem_den_max_sto_tisic",
        min_value_100: "davka_celkem_den_min_sto_tisic",
        text_100: "Naočkovaní obyvatelé na 100 tisíc obyvatel",
        max_range: 'max_celkem_den',
        max_range_100: 'max_celkem_den_sto_tisic'
    },
    "Všechny dávky doposud":
    {
        value: "davka_celkem_doposud",
        max_value: "davka_celkem_doposud_max",
        min_value: "davka_celkem_doposud_min",
        text: "Naočkovaní obyvatelé",
        value_100: "davka_celkem_doposud_sto_tisic",
        max_value_100: "davka_celkem_doposud_max_sto_tisic",
        min_value_100: "davka_celkem_doposud_min_sto_tisic",
        text_100: "Naočkovaní obyvatelé na 100 tisíc obyvatel",
        max_range: 'max_celkem_doposud',
        max_range_100: 'max_celkem_doposud_sto_tisic'
    },
    "První dávka tento den":
    {
        value: "davka_1_den",
        max_value: "davka_1_max",
        min_value: "davka_1_min",
        text: "Naočkovaní obyvatelé první dávkou tento den",
        value_100: "davka_1_den_sto_tisic",
        max_value_100: "davka_1_max_sto_tisic",
        min_value_100: "davka_1_min_sto_tisic",
        text_100: "Naočkovaní obyvatelé první dávkou tento den na 100 tisíc obyvatel",
        max_range: 'max_celkem_davka_1_den',
        max_range_100: 'max_celkem_davka_1_den_sto_tisic'
    },
    "První dávka doposud":
    {
        value: "davka_1_doposud",
        max_value: "davka_1_doposud_max",
        min_value: "davka_1_doposud_min",
        text: "Naočkovaní obyvatelé první dávkou",
        value_100: "davka_1_doposud_sto_tisic",
        max_value_100: "davka_1_doposud_max_sto_tisic",
        min_value_100: "davka_1_doposud_min_sto_tisic",
        text_100: "Naočkovaní obyvatelé první dávkou na 100 tisíc obyvatel",
        max_range: 'max_celkem_davka_1_doposud',
        max_range_100: 'max_celkem_davka_1_doposud_sto_tisic'
    },
    "Druhá dávka tento den":
    {
        value: "davka_2_den",
        max_value: "davka_2_max",
        min_value: "davka_2_min",
        text: "Naočkovaní obyvatelé druhou dávkou tento den",
        value_100: "davka_2_den_sto_tisic",
        max_value_100: "davka_2_max_sto_tisic",
        min_value_100: "davka_2_min_sto_tisic",
        text_100: "Naočkovaní obyvatelé druhou dávkou tento den na 100 tisíc obyvatel",
        max_range: 'max_celkem_davka_2_den',
        max_range_100: 'max_celkem_davka_2_den_sto_tisic'
    },
    "Druhá dávka doposud":
    {
        value: "davka_2_doposud",
        max_value: "davka_2_doposud_max",
        min_value: "davka_2_doposud_min",
        text: "Naočkovaní obyvatelé druhou dávkou",
        value_100: "davka_2_doposud_sto_tisic",
        max_value_100: "davka_2_doposud_max_sto_tisic",
        min_value_100: "davka_2_doposud_min_sto_tisic",
        text_100: "Naočkovaní obyvatelé druhou dávkou na 100 tisíc obyvatel",
        max_range: 'max_celkem_davka_2_doposud',
        max_range_100: 'max_celkem_davka_2_doposud_sto_tisic'
    },
    "Třetí dávka tento den":
    {
        value: "davka_3_den",
        max_value: "davka_3_max",
        min_value: "davka_3_min",
        text: "Naočkovaní obyvatelé třetí dávkou tento den",
        value_100: "davka_3_den_sto_tisic",
        max_value_100: "davka_3_max_sto_tisic",
        min_value_100: "davka_3_min_sto_tisic",
        text_100: "Naočkovaní obyvatelé třetí dávkou tento den na 100 tisíc obyvatel",
        max_range: 'max_celkem_davka_3_den',
        max_range_100: 'max_celkem_davka_3_den_sto_tisic'
    },
    "Třetí dávka doposud":
    {
        value: "davka_3_doposud",
        max_value: "davka_3_doposud_max",
        min_value: "davka_3_doposud_min",
        text: "Naočkovaní obyvatelé třetí dávkou",
        value_100: "davka_3_doposud_sto_tisic",
        max_value_100: "davka_3_doposud_max_sto_tisic",
        min_value_100: "davka_3_doposud_min_sto_tisic",
        text_100: "Naočkovaní obyvatelé třetí dávkou na 100 tisíc obyvatel",
        max_range: 'max_celkem_davka_3_doposud',
        max_range_100: 'max_celkem_davka_3_doposud_sto_tisic'
    },
    "Čtvrtá dávka tento den":
    {
        value: "davka_4_den",
        max_value: "davka_4_max",
        min_value: "davka_4_min",
        text: "Naočkovaní obyvatelé čtvrtou dávkou tento den",
        value_100: "davka_4_den_sto_tisic",
        max_value_100: "davka_4_max_sto_tisic",
        min_value_100: "davka_4_min_sto_tisic",
        text_100: "Naočkovaní obyvatelé čtvrtou dávkou tento den na 100 tisíc obyvatel",
        max_range: 'max_celkem_davka_4_den',
        max_range_100: 'max_celkem_davka_4_den_sto_tisic'
    },
    "Čtvrtá dávka doposud":
    {
        value: "davka_4_doposud",
        max_value: "davka_4_doposud_max",
        min_value: "davka_4_doposud_min",
        text: "Naočkovaní obyvatelé čtvrtou dávkou",
        value_100: "davka_4_doposud_sto_tisic",
        max_value_100: "davka_4_doposud_max_sto_tisic",
        min_value_100: "davka_4_doposud_min_sto_tisic",
        text_100: "Naočkovaní obyvatelé čtvrtou dávkou na 100 tisíc obyvatel",
        max_range: 'max_celkem_davka_4_doposud',
        max_range_100: 'max_celkem_davka_4_doposud_sto_tisic'
    },
    "Aktuální celkový počet zemřelých doposud":
    {
        value: "umrti_doposud",
        max_value: "max_umrti_doposud",
        min_value: "min_umrti_doposud",
        text: "Celkový počet zemřelých k danému dni",
        value_100: "umrti_doposud_sto_tisic",
        max_value_100: "max_umrti_doposud_sto_tisic",
        min_value_100: "min_umrti_doposud_sto_tisic",
        text_100: "Celkový počet zemřelých k danému dni na 100 tisíc obyvatel",
        max_range: 'celkem_max_doposud',
        max_range_100: 'celkem_max_sto_tisic_doposud'
    },
    "Počet nově zemřelých daný den":
    {
        value: "umrti_den",
        max_value: "max_umrti_den",
        min_value: "min_umrti_den",
        text: "Počet nově zemřelých daný den",
        value_100: "umrti_den_sto_tisic",
        max_value_100: "max_umrti_den_sto_tisic",
        min_value_100: "min_umrti_den_sto_tisic",
        text_100: "Počet nově zemřelých daný den na 100 tisíc obyvatel",
        max_range: 'celkem_max_den',
        max_range_100: 'celkem_max_sto_tisic_den'
    },
    "Aktuální celkový počet otestovaných doposud":
    {
        value: "celkem",
        max_value: "celkem_max_den",
        min_value: "celkem_min_den",
        text: "Celkový počet otestovaných k danému dni",
        value_100: "celkem_sto_tisic",
        max_value_100: "celkem_max_den_sto_tisic",
        min_value_100: "celkem_min_den_sto_tisic",
        text_100: "Celkový počet otestovaných k danému dni na 100 tisíc obyvatel",
        max_range: 'rozsah_max_celkem',
        max_range_100: 'rozsah_max_celkem_sto_tisic'
    },
    "Počet nově otestovaných daný den":
    {
        value: "prirustek",
        max_value: "max_den",
        min_value: "min_den",
        text: "Počet nově otestovaných daný den",
        value_100: "prirustek_sto_tisic",
        max_value_100: "max_den_sto_tisic",
        min_value_100: "min_den_sto_tisic",
        text_100: "Počet nově otestovaných daný den na 100 tisíc obyvatel",
        max_range: 'rozsah_max_prirustek',
        max_range_100: 'rozsah_max_prirustek_sto_tisic'
    }
}