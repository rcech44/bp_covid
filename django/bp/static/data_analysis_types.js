// This dictionary holds information about what to draw from data according to current selected analysis when requested

data_analysis_types = {
    "Současně nakažení":
    {
        value: "aktivni_pripady",
        max_value: "max_aktivni",
        min_value: "min_aktivni",
        text: "Současný počet nakažených",
        value_100: "aktivni_pripady_sto_tisic",
        max_value_100: "max_aktivni_sto_tisic",
        min_value_100: "min_aktivni_sto_tisic",
        text_100: "Současný počet nakažených na 100 tisíc obyvatel"
    },
    "Nové případy":
    {
        value: "nove_pripady",
        max_value: "max_nove",
        min_value: "min_nove",
        text: "Počet nově nakažených",
        value_100: "nove_pripady_sto_tisic",
        max_value_100: "max_nove_sto_tisic",
        min_value_100: "min_nove_sto_tisic",
        text_100: "Počet nově nakažených na 100 tisíc obyvatel"
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
        text_100: "Naočkovaní obyvatelé na 100 tisíc obyvatel"
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
        text_100: "Naočkovaní obyvatelé na 100 tisíc obyvatel"
    }
}

switch (map_show_data) {
    case "První dávka tento den":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['davka_1_den_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_1_max_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_1_min_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé první dávkou tento den na 100 tisíc obyvatel";
            analysis_name_value = "davka_1_den_sto_tisic";
            analysis_name_max_value = "davka_1_max_sto_tisic";
            analysis_name_min_value = "davka_1_min_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['davka_1_den'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_1_max'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_1_min'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé první dávkou tento den";
            analysis_name_value = "davka_1_den";
            analysis_name_max_value = "davka_1_max";
            analysis_name_min_value = "davka_1_min";
        }
        break;

    case "První dávka doposud":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['davka_1_doposud_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_1_doposud_max_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_1_doposud_min_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé první dávkou na 100 tisíc obyvatel";
            analysis_name_value = "davka_1_doposud_sto_tisic";
            analysis_name_max_value = "davka_1_doposud_max_sto_tisic";
            analysis_name_min_value = "davka_1_doposud_min_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['davka_1_doposud'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_1_doposud_max'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_1_doposud_min'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé první dávkou";
            analysis_name_value = "davka_1_doposud";
            analysis_name_max_value = "davka_1_doposud_max";
            analysis_name_min_value = "davka_1_doposud_min";
        }
        break;

    case "Druhá dávka tento den":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['davka_2_den_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_2_max_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_2_min_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé druhou dávkou tento den na 100 tisíc obyvatel";
            analysis_name_value = "davka_2_den_sto_tisic";
            analysis_name_max_value = "davka_2_max_sto_tisic";
            analysis_name_min_value = "davka_2_min_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['davka_2_den'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_2_max'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_2_min'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé druhou dávkou tento den";
            analysis_name_value = "davka_2_den";
            analysis_name_max_value = "davka_2_max";
            analysis_name_min_value = "davka_2_min";
        }
        break;

    case "Druhá dávka doposud":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['davka_2_doposud_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_2_doposud_max_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_2_doposud_min_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé druhou dávkou na 100 tisíc obyvatel";
            analysis_name_value = "davka_2_doposud_sto_tisic";
            analysis_name_max_value = "davka_2_doposud_max_sto_tisic";
            analysis_name_min_value = "davka_2_doposud_min_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['davka_2_doposud'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_2_doposud_max'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_2_doposud_min'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé druhou dávkou";
            analysis_name_value = "davka_2_doposud";
            analysis_name_max_value = "davka_2_doposud_max";
            analysis_name_min_value = "davka_2_doposud_min";
        }
        break;

    case "Třetí dávka tento den":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['davka_3_den_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_3_max_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_3_min_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé třetí dávkou tento den na 100 tisíc obyvatel";
            analysis_name_value = "davka_3_den_sto_tisic";
            analysis_name_max_value = "davka_3_max_sto_tisic";
            analysis_name_min_value = "davka_3_min_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['davka_3_den'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_3_max'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_3_min'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé třetí dávkou tento den";
            analysis_name_value = "davka_3_den";
            analysis_name_max_value = "davka_3_max";
            analysis_name_min_value = "davka_3_min";
        }
        break;

    case "Třetí dávka doposud":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['davka_3_doposud_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_3_doposud_max_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_3_doposud_min_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé třetí dávkou na 100 tisíc obyvatel";
            analysis_name_value = "davka_3_doposud_sto_tisic";
            analysis_name_max_value = "davka_3_doposud_max_sto_tisic";
            analysis_name_min_value = "davka_3_doposud_min_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['davka_3_doposud'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_3_doposud_max'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_3_doposud_min'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé třetí dávkou";
            analysis_name_value = "davka_3_doposud";
            analysis_name_max_value = "davka_3_doposud_max";
            analysis_name_min_value = "davka_3_doposud_min";
        }
        break;

    case "Čtvrtá dávka tento den":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['davka_4_den_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_4_max_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_4_min_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé čtvrtou dávkou tento den na 100 tisíc obyvatel";
            analysis_name_value = "davka_4_den_sto_tisic";
            analysis_name_max_value = "davka_4_max_sto_tisic";
            analysis_name_min_value = "davka_4_min_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['davka_4_den'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_4_max'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_4_min'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé čtvrtou dávkou tento den";
            analysis_name_value = "davka_4_den";
            analysis_name_max_value = "davka_4_max";
            analysis_name_min_value = "davka_4_min";
        }
        break;

    case "Čtvrtá dávka doposud":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['davka_4_doposud_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_4_doposud_max_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_4_doposud_min_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé čtvrtou dávkou na 100 tisíc obyvatel";
            analysis_name_value = "davka_4_doposud_sto_tisic";
            analysis_name_max_value = "davka_4_doposud_max_sto_tisic";
            analysis_name_min_value = "davka_4_doposud_min_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['davka_4_doposud'].toFixed(2);
            maximum_day = new_data[selected_date_text]['davka_4_doposud_max'].toFixed(2);
            minimum_day = new_data[selected_date_text]['davka_4_doposud_min'].toFixed(2);
            text_current_data.innerHTML = "Naočkovaní obyvatelé čtvrtou dávkou";
            analysis_name_value = "davka_4_doposud";
            analysis_name_max_value = "davka_4_doposud_max";
            analysis_name_min_value = "davka_4_doposud_min";
        }
        break;

    case "Aktuální celkový počet zemřelých doposud":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['umrti_doposud_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['max_umrti_doposud_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['min_umrti_doposud_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Celkový počet zemřelých k danému dni na 100 tisíc obyvatel";
            analysis_name_value = "umrti_doposud_sto_tisic";
            analysis_name_max_value = "max_umrti_doposud_sto_tisic";
            analysis_name_min_value = "min_umrti_doposud_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['umrti_doposud'].toFixed(2);
            maximum_day = new_data[selected_date_text]['max_umrti_doposud'].toFixed(2);
            minimum_day = new_data[selected_date_text]['min_umrti_doposud'].toFixed(2);
            text_current_data.innerHTML = "Celkový počet zemřelých k danému dni";
            analysis_name_value = "umrti_doposud";
            analysis_name_max_value = "max_umrti_doposud";
            analysis_name_min_value = "min_umrti_doposud";
        }
        break;

    case "Počet nově zemřelých daný den":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['umrti_den_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['max_umrti_den_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['min_umrti_den_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Počet nově zemřelých daný den na 100 tisíc obyvatel";
            analysis_name_value = "umrti_den_sto_tisic";
            analysis_name_max_value = "max_umrti_den_sto_tisic";
            analysis_name_min_value = "min_umrti_den_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['umrti_den'].toFixed(2);
            maximum_day = new_data[selected_date_text]['max_umrti_den'].toFixed(2);
            minimum_day = new_data[selected_date_text]['min_umrti_den'].toFixed(2);
            text_current_data.innerHTML = "Počet nově zemřelých daný den";
            analysis_name_value = "umrti_den";
            analysis_name_max_value = "max_umrti_den";
            analysis_name_min_value = "min_umrti_den";
        }
        break;

    case "Aktuální celkový počet otestovaných doposud":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['celkem_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['celkem_max_den_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['celkem_min_den_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Celkový počet otestovaných k danému dni na 100 tisíc obyvatel";
            analysis_name_value = "celkem_sto_tisic";
            analysis_name_max_value = "celkem_max_den_sto_tisic";
            analysis_name_min_value = "celkem_min_den_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['celkem'].toFixed(2);
            maximum_day = new_data[selected_date_text]['celkem_max_den'].toFixed(2);
            minimum_day = new_data[selected_date_text]['celkem_min_den'].toFixed(2);
            text_current_data.innerHTML = "Celkový počet otestovaných k danému dni";
            analysis_name_value = "celkem";
            analysis_name_max_value = "celkem_max_den";
            analysis_name_min_value = "celkem_min_den";
        }
        break;

    case "Počet nově otestovaných daný den":
        if (data_recalculation) {
            okres_value = new_data[selected_date_text][okres_lau]['prirustek_sto_tisic'].toFixed(2);
            maximum_day = new_data[selected_date_text]['max_den_sto_tisic'].toFixed(2);
            minimum_day = new_data[selected_date_text]['min_den_sto_tisic'].toFixed(2);
            text_current_data.innerHTML = "Počet nově otestovaných daný den na 100 tisíc obyvatel";
            analysis_name_value = "prirustek_sto_tisic";
            analysis_name_max_value = "max_den_sto_tisic";
            analysis_name_min_value = "min_den_sto_tisic";
        }
        else {
            okres_value = new_data[selected_date_text][okres_lau]['prirustek'].toFixed(2);
            maximum_day = new_data[selected_date_text]['max_den'].toFixed(2);
            minimum_day = new_data[selected_date_text]['min_den'].toFixed(2);
            text_current_data.innerHTML = "Počet nově otestovaných daný den";
            analysis_name_value = "prirustek";
            analysis_name_max_value = "max_den";
            analysis_name_min_value = "min_den";
        }
        break;
}