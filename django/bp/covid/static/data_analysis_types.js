// This dictionary holds information about what to pick from data according to current selected analysis when requested

data_analysis_types = {
    "Současně nakažení":
    {
        value: "infections_active",
        max_value: "infections_active_max",
        max_range: 'infections_active_max_total',
        text: "Současný počet nakažených",
        value_100: "infections_active_100k",
        max_value_100: "infections_active_100k_max",
        max_range_100: 'infections_active_100k_max_total',
        text_100: "Současný počet nakažených na 100 tisíc obyvatel"
    },
    "Nové případy":
    {
        value: "infections_new",
        max_value: "infections_new_max",
        max_range: 'infections_new_max_total',
        text: "Počet nově nakažených",
        value_100: "infections_new_100k",
        max_value_100: "infections_new_100k_max",
        max_range_100: 'infections_new_100k_max_total',
        text_100: "Počet nově nakažených na 100 tisíc obyvatel"
    },
    "Nové případy za poslední týden":
    {
        value: "infections_new_7",
        max_value: "infections_new_7_max",
        max_range: 'infections_new_7_max_total',
        text: "Počet nově nakažených za posledních 7 dní",
        value_100: "infections_new_7_100k",
        max_value_100: "infections_new_7_100k_max",
        max_range_100: 'infections_new_7_100k_max_total',
        text_100: "Počet nově nakažených za posledních 7 dní na 100 tisíc obyvatel"
    },
    "Nové případy za poslední dva týdny":
    {
        value: "infections_new_14",
        max_value: "infections_new_14_max",
        max_range: 'infections_new_14_max_total',
        text: "Počet nově nakažených za posledních 14 dní",
        value_100: "infections_new_14_100k",
        max_value_100: "infections_new_14_100k_max",
        max_range_100: 'infections_new_14_100k_max_total',
        text_100: "Počet nově nakažených za posledních 14 dní na 100 tisíc obyvatel"
    },
    "Nové případy lidí starších 65 let":
    {
        value: "infections_new_65_age",
        max_value: "infections_new_65_age_max",
        max_range: 'infections_new_65_age_max_total',
        text: "Počet nově nakažených lidí starších 65 let",
        value_100: "infections_new_65_age_100k",
        max_value_100: "infections_new_65_age_100k_max",
        max_range_100: 'infections_new_65_age_100k_max_total',
        text_100: "Počet nově nakažených lidí starších 65 let na 100 tisíc obyvatel"
    },


    "Všechny dávky tento den":
    {
        value: "vaccination_doses_day",
        max_value: "vaccination_doses_day_max",
        text: "Naočkovaní obyvatelé",
        value_100: "vaccination_doses_day_100k",
        max_value_100: "vaccination_doses_day_100k_max",
        text_100: "Naočkovaní obyvatelé na 100 tisíc obyvatel",
        max_range: 'vaccination_doses_day_total',
        max_range_100: 'vaccination_doses_day_100k_total'
    },
    "Všechny dávky doposud":
    {
        value: "vaccination_doses_alltime",
        max_value: "vaccination_doses_alltime_max",
        text: "Naočkovaní obyvatelé",
        value_100: "vaccination_doses_alltime_100k",
        max_value_100: "vaccination_doses_alltime_100k_max",
        text_100: "Naočkovaní obyvatelé na 100 tisíc obyvatel",
        max_range: 'vaccination_doses_alltime_total',
        max_range_100: 'vaccination_doses_alltime_100k_total'
    },
    "První dávka tento den":
    {
        value: "vaccination_1_dose_day",
        max_value: "vaccination_1_dose_day_max",
        text: "Naočkovaní obyvatelé první dávkou tento den",
        value_100: "vaccination_1_dose_day_100k",
        max_value_100: "vaccination_1_dose_day_100k_max",
        text_100: "Naočkovaní obyvatelé první dávkou tento den na 100 tisíc obyvatel",
        max_range: 'vaccination_1_dose_day_total',
        max_range_100: 'vaccination_1_dose_day_100k_total'
    },
    "První dávka doposud":
    {
        value: "vaccination_1_dose_alltime",
        max_value: "vaccination_1_dose_alltime_max",
        text: "Naočkovaní obyvatelé první dávkou",
        value_100: "vaccination_1_dose_alltime_100",
        max_value_100: "vaccination_1_dose_alltime_100_max",
        text_100: "Naočkovaní obyvatelé první dávkou na 100 tisíc obyvatel",
        max_range: 'vaccination_1_dose_alltime_total',
        max_range_100: 'vaccination_1_dose_alltime_100k_total'
    },
    "Druhá dávka tento den":
    {
        value: "vaccination_2_dose_day",
        max_value: "vaccination_2_dose_day_max",
        text: "Naočkovaní obyvatelé druhou dávkou tento den",
        value_100: "vaccination_2_dose_day_100k",
        max_value_100: "vaccination_2_dose_day_100k_max",
        text_100: "Naočkovaní obyvatelé druhou dávkou tento den na 100 tisíc obyvatel",
        max_range: 'vaccination_2_dose_day_total',
        max_range_100: 'vaccination_2_dose_day_100k_total'
    },
    "Druhá dávka doposud":
    {
        value: "vaccination_2_dose_alltime",
        max_value: "vaccination_2_dose_alltime_max",
        text: "Naočkovaní obyvatelé druhou dávkou",
        value_100: "vaccination_2_dose_alltime_100",
        max_value_100: "vaccination_2_dose_alltime_100_max",
        text_100: "Naočkovaní obyvatelé druhou dávkou na 100 tisíc obyvatel",
        max_range: 'vaccination_2_dose_alltime_total',
        max_range_100: 'vaccination_2_dose_alltime_100k_total'
    },
    "Třetí dávka tento den":
    {
        value: "vaccination_3_dose_day",
        max_value: "vaccination_3_dose_day_max",
        text: "Naočkovaní obyvatelé třetí dávkou tento den",
        value_100: "vaccination_3_dose_day_100k",
        max_value_100: "vaccination_3_dose_day_100k_max",
        text_100: "Naočkovaní obyvatelé třetí dávkou tento den na 100 tisíc obyvatel",
        max_range: 'vaccination_3_dose_day_total',
        max_range_100: 'vaccination_3_dose_day_100k_total'
    },
    "Třetí dávka doposud":
    {
        value: "vaccination_3_dose_alltime",
        max_value: "vaccination_3_dose_alltime_max",
        text: "Naočkovaní obyvatelé třetí dávkou",
        value_100: "vaccination_3_dose_alltime_100",
        max_value_100: "vaccination_3_dose_alltime_100_max",
        text_100: "Naočkovaní obyvatelé třetí dávkou na 100 tisíc obyvatel",
        max_range: 'vaccination_3_dose_alltime_total',
        max_range_100: 'vaccination_3_dose_alltime_100k_total'
    },
    "Čtvrtá dávka tento den":
    {
        value: "vaccination_4_dose_day",
        max_value: "vaccination_4_dose_day_max",
        text: "Naočkovaní obyvatelé čtvrtou dávkou tento den",
        value_100: "vaccination_4_dose_day_100k",
        max_value_100: "vaccination_4_dose_day_100k_max",
        text_100: "Naočkovaní obyvatelé čtvrtou dávkou tento den na 100 tisíc obyvatel",
        max_range: 'vaccination_4_dose_day_total',
        max_range_100: 'vaccination_4_dose_day_100k_total'
    },
    "Čtvrtá dávka doposud":
    {
        value: "vaccination_4_dose_alltime",
        max_value: "vaccination_4_dose_alltime_max",
        text: "Naočkovaní obyvatelé čtvrtou dávkou",
        value_100: "vaccination_4_dose_alltime_100",
        max_value_100: "vaccination_4_dose_alltime_100_max",
        text_100: "Naočkovaní obyvatelé čtvrtou dávkou na 100 tisíc obyvatel",
        max_range: 'vaccination_4_dose_alltime_total',
        max_range_100: 'vaccination_4_dose_alltime_100k_total'
    },


    "Aktuální celkový počet zemřelých doposud":
    {
        value: "deaths_alltime",
        max_value: "deaths_alltime_max",
        text: "Celkový počet zemřelých k danému dni",
        value_100: "deaths_alltime_100k",
        max_value_100: "deaths_alltime_100k_max",
        text_100: "Celkový počet zemřelých k danému dni na 100 tisíc obyvatel",
        max_range: 'deaths_alltime_total',
        max_range_100: 'deaths_alltime_100k_total'
    },
    "Počet nově zemřelých daný den":
    {
        value: "deaths_day",
        max_value: "deaths_day_max",
        text: "Počet nově zemřelých daný den",
        value_100: "deaths_day_100k",
        max_value_100: "deaths_day_100k_max",
        text_100: "Počet nově zemřelých daný den na 100 tisíc obyvatel",
        max_range: 'deaths_day_total',
        max_range_100: 'deaths_day_100k_total'
    },


    "Aktuální celkový počet otestovaných doposud":
    {
        value: "pcr_tests_alltime",
        max_value: "pcr_tests_alltime_max",
        text: "Celkový počet otestovaných k danému dni",
        value_100: "pcr_tests_alltime_100k",
        max_value_100: "pcr_tests_alltime_100k_max",
        text_100: "Celkový počet otestovaných k danému dni na 100 tisíc obyvatel",
        max_range: 'pcr_tests_alltime_total',
        max_range_100: 'pcr_tests_alltime_100k_total'
    },
    "Počet nově otestovaných daný den":
    {
        value: "pcr_tests_day",
        max_value: "pcr_tests_day_max",
        text: "Počet nově otestovaných daný den",
        value_100: "pcr_tests_day_100k",
        max_value_100: "pcr_tests_day_100k_max",
        text_100: "Počet nově otestovaných daný den na 100 tisíc obyvatel",
        max_range: 'pcr_tests_day_total',
        max_range_100: 'pcr_tests_day_100k_total'
    }
}