var slider;
var output;
var summary_nakazeni;
var summary_vyleceni;
var summary_umrti;
var summary_obyvatel;
var okres_nazev;
var okres_kod;
var okres_nakazeni;
var okres_nakazeni_sto_tisic;
var okres_celkem_nakazeni;
var okres_celkem_vyleceni;
var okres_datum;
var nakazenych;
var okresy_names = JSON.parse(okresy_nazvy);
var okresy_pocet_obyvatel = JSON.parse(pocet_obyvatel);
var covid_data = {};
var covid_data_days_max = {};
var covid_data_days_min = {};
var covid_summary = {};
var okres_clicked = "";
var okres_clicked_map_object = -1;
var analyze_fields = ["nakazeni-analyze", "ockovani-analyze", "umrti-analyze", "ovlivneno-analyze"];
var current_analysis = "nakazeni-analyze";
var analysis_selected = false;
var analysis_changed = true;
var slider_values;
var days_since_covid;
var slider_current_type = "Den";
var slider_current_values = [0, 0];
var map_info_1;
var map_info_2;
var map_info_3;
var map_date;
var map_title;
var slider_current_selected_date;
var slider_text_value;
var ongoing_animation = true;
var animation_speed = 5;
var map_show_data = "Současně nakažení";
var text_current_data_sto_tisic;
var text_current_data;
var iframe;
var map_enabled = false;
var select_2;
var snackbar;
var data_minimum_type = "zero";
var data_recalculation = true;
var covid_start = new Date("03/01/2020");
var covid_start_string = "03/01/2020";
var vaccination_start = new Date("12/27/2020");
var current_values = []
var analysis_name_value;
var analysis_name_min_value;
var analysis_name_max_value;
var current_analysis_color;

// Initialize and modify webpage on startup
function onIframeLoad() {
    loadPageComponents();
    loadTimeFrameSlider();
    initPage();
}

// DOM elements setter
function loadPageComponents() {
    okres_nazev = document.getElementById("text_okres_nazev");
    okres_kod = document.getElementById("text_okres_kod");
    okres_nakazeni = document.getElementById("text_okres_nakazeni");
    okres_nakazeni_sto_tisic = document.getElementById("text_okres_nakazeni_sto_tisic");
    okres_celkem_nakazeni = document.getElementById("text_okres_celkem_nakazeni");
    okres_celkem_vyleceni = document.getElementById("text_okres_celkem_vyleceni");
    okres_datum = document.getElementById("text_okres_datum");
    okres_pocet_obyvatel = document.getElementById("text_okres_pocet_obyvatel");
    okres_pocet_obyvatel_procento = document.getElementById("text_okres_pocet_obyvatel_procento");
    text_current_data_sto_tisic = document.getElementById("text_current_data_sto_tisic");
    text_current_data = document.getElementById("text_current_data");
    map_date = document.getElementById("text_datum_mapa");
    text_current_data_sto_tisic = document.getElementById("text_current_data_sto_tisic");
    text_current_data = document.getElementById("text_current_data");
    map_info_1 = document.getElementById("map_info_1");
    map_info_2 = document.getElementById("map_info_2");
    map_info_3 = document.getElementById("map_info_3");
    map_date = document.getElementById("map_date");
    map_title = document.getElementById("map_title");
    slider = document.getElementById("slider");
    output = document.getElementById("slider_text");
    slider_text_value = document.getElementById("slider-value");
    iframe = document.getElementById("iframe");
    select_2 = document.getElementById("sel2");
    snackbar = document.getElementById("snackbar");
}

function initPage() {
    slider.oninput = updatePage;
    iframe = document.getElementById("iframe");
    const elements = iframe.contentWindow.document.getElementsByClassName("leaflet-control-layers-toggle");
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
    var parent = iframe.contentWindow.document.querySelector("g");
    for (let i = 0; i < 77; i++) {
        var child = parent.firstElementChild;
        parent.removeChild(child);
    }
    var children = parent.children;
    for (let i = 0; i < 77; i++) {
        children[i].setAttribute("fill-opacity", 0.7);
        children[i].setAttribute("fill", "#ffffff");
        children[i].setAttribute("stroke-width", 0.7);
        children[i].setAttribute("name", okresy_names[i][1]);
        children[i].setAttribute("okres_lau", okresy_names[i][0]);
        children[i].addEventListener('click', function () {
            onClickMap(this.getAttribute('name'), this.getAttribute('okres_lau'), this);
            okres_clicked_map_object = i;
        });
    }
    // updatePage();
}

// click function - AJAX request
function onClickMap(name, okres_lau, object) {
    // Save district
    okres_clicked = okres_lau;

    // Graph
    initChart();

    // Remove additional stroke-width from previous district
    if (okres_clicked_map_object != -1) {
        iframe.contentWindow.document.querySelector("g").children[okres_clicked_map_object].setAttribute("stroke-width", 0.5);
    }

    // Set selected district stroke-width
    object.setAttribute("stroke-width", 4.5);

    // Get needed variables
    selected_date_text = getFormattedDate(slider_current_selected_date);

    // Update text with selected district data
    okres_nazev.innerHTML = name;
    okres_kod.innerHTML = okres_lau;
    okres_pocet_obyvatel.innerHTML = okresy_pocet_obyvatel[okres_lau].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Update page
    updatePage();
}

// sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// handle animation button
async function handleAnimation() {
    if (analysis_changed) {
        toast("Prosím potvrďte nové změny");
        return;
    }
    ongoing_animation = true;
    var max_value = parseInt(slider.getAttribute('max'));
    var current_value = parseInt(slider.value);
    for (var cur = current_value; cur < max_value; cur++) {
        if (ongoing_animation == false) break;
        slider.value = cur + 1;
        updatePage();
        await sleep(animation_speed * 30);
    }
}

// handle stop animation button
function stopAnimation() {
    ongoing_animation = false;
}

// handle change animation speed clicker
function changeAnimationSpeed(value) {
    animation_speed = 11 - parseInt(value);
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    if (x != null)
        return parseInt(x).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else
        return 0;
}

// function to add days to given date
function addDays(date, days) {
    var ms = new Date(date).getTime() + (86400000 * days);
    var result = new Date(ms);
    return result;
}

// helper function to calculate color
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// return date formatted as string with Czech localization
function getFormattedDateLocal(date) {
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}

// return date formatted as string
function getFormattedDate(date) {
    var text = "";

    // format year
    text += date.getFullYear() + "-";

    // format month (possibly add 0)
    if ((date.getMonth() + 1) < 10) {
        text += "0" + (date.getMonth() + 1) + "-";
    }
    else {
        text += (date.getMonth() + 1) + "-";
    }

    // format day (possibly add 0)
    if ((date.getDate()) < 10) {
        text += "0" + date.getDate();
    }
    else {
        text += date.getDate();
    }

    // console.log(text);  
    return text;
}

// function that updates slider text
function updatePage() {
    current_values = []

    // Init needed variables
    var totalValue = 0;
    var okres_value;
    var maximum_day;
    var minimum_day;
    var selected_date = new Date();

    // Get all variables connected with date
    switch (slider_current_type) {
        case "Den":
            selected_date.setDate(selected_date.getDate() - Math.floor(days_since_covid - slider_current_values[0]) - 1);
            break;
        case "Týden":
            selected_date.setDate(selected_date.getDate() - Math.floor(days_since_covid - (slider_current_values[0] * 7)) - 1);
            break;
        case "Měsíc":
            selected_date.setDate(selected_date.getDate() - Math.floor(days_since_covid - (slider_current_values[0] * 30)) - 1);
            break;
        case "Rok":
            break;
    }

    selected_date = addDays(selected_date, slider.value);
    slider_current_selected_date = selected_date;
    var selected_date_text = getFormattedDate(selected_date);
    var selected_date_text_local = getFormattedDateLocal(selected_date);

    switch (current_analysis) {
        case "nakazeni-analyze":
            map_info_1.innerHTML = "<b>Nové případy za tento den:</b> " + numberWithCommas(new_data[selected_date_text]['nove_celkovy_pocet']);
            map_info_2.innerHTML = "<b>Současný počet případů za tento den:</b> " + numberWithCommas(new_data[selected_date_text]['aktivni_celkovy_pocet']);
            map_info_3.innerHTML = "<b>Celkový počet zaznamenaných případů v tento den:</b> " + numberWithCommas(new_data[selected_date_text]['celkem_pripady']);
            break;
        case "ockovani-analyze":
            map_info_1.innerHTML = "<b>Nová očkování za tento den:</b> " + numberWithCommas(new_data[selected_date_text]['davka_celkem_den']);
            map_info_3.innerHTML = "<b>Celkový počet obyvatel naočkovaných alespoň první a druhou dávkou:</b> " + numberWithCommas(new_data[selected_date_text]['davka_2_doposud']);
            map_info_2.innerHTML = "<b>Celkový počet zaznamenaných očkování doposud:</b> " + numberWithCommas(new_data[selected_date_text]['davka_celkem_doposud']);
            break;
    }

    // Update some values and texts on page
    output.innerHTML = selected_date.toLocaleDateString("cs-CZ");
    map_date.innerHTML = selected_date_text_local;

    // Map district updating - go through all districts
    var parent = iframe.contentWindow.document.querySelector("g");
    var children = parent.children;
    for (let i = 0; i < 77; i++) {
        // Get district LAU code
        var okres_lau = children[i].getAttribute('okres_lau');

        // Get needed values that are required for later computations and set some texts on page according to selected data
        switch (map_show_data) {
            case "Současně nakažení":
                if (data_recalculation) {
                    okres_value = new_data[selected_date_text][okres_lau]['aktivni_pripady_sto_tisic'].toFixed(2);
                    maximum_day = new_data[selected_date_text]['max_aktivni_sto_tisic'].toFixed(2);
                    minimum_day = new_data[selected_date_text]['min_aktivni_sto_tisic'].toFixed(2);
                    text_current_data.innerHTML = "Současný počet nakažených na 100 tisíc obyvatel";
                    analysis_name_value = "aktivni_pripady_sto_tisic";
                    analysis_name_min_value = "min_aktivni_sto_tisic";
                    analysis_name_max_value = "max_aktivni_sto_tisic";
                }
                else {
                    okres_value = new_data[selected_date_text][okres_lau]['aktivni_pripady'].toFixed(2);
                    maximum_day = new_data[selected_date_text]['max_aktivni'].toFixed(2);
                    minimum_day = new_data[selected_date_text]['min_aktivni'].toFixed(2);
                    text_current_data.innerHTML = "Současný počet nakažených";
                    analysis_name_value = "aktivni_pripady";
                    analysis_name_max_value = "max_aktivni";
                    analysis_name_min_value = "min_aktivni";
                }
                break;

            case "Nové případy":
                if (data_recalculation) {
                    okres_value = new_data[selected_date_text][okres_lau]['nove_pripady_sto_tisic'].toFixed(2);
                    maximum_day = new_data[selected_date_text]['max_nove_sto_tisic'].toFixed(2);
                    minimum_day = new_data[selected_date_text]['min_nove_sto_tisic'].toFixed(2);
                    text_current_data.innerHTML = "Počet nově nakažených na 100 tisíc obyvatel";
                    analysis_name_value = "nove_pripady_sto_tisic";
                    analysis_name_max_value = "max_nove_sto_tisic";
                    analysis_name_min_value = "min_nove_sto_tisic";
                }
                else {
                    okres_value = new_data[selected_date_text][okres_lau]['nove_pripady'].toFixed(2);
                    maximum_day = new_data[selected_date_text]['max_nove'].toFixed(2);
                    minimum_day = new_data[selected_date_text]['min_nove'].toFixed(2);
                    text_current_data.innerHTML = "Počet nově nakažených";
                    analysis_name_value = "nove_pripady";
                    analysis_name_max_value = "max_nove";
                    analysis_name_min_value = "min_nove";
                }
                break;

            case "Všechny dávky tento den":
                if (data_recalculation) {
                    okres_value = new_data[selected_date_text][okres_lau]['davka_celkem_den_sto_tisic'].toFixed(2);
                    maximum_day = new_data[selected_date_text]['davka_celkem_den_max_sto_tisic'].toFixed(2);
                    minimum_day = new_data[selected_date_text]['davka_celkem_den_min_sto_tisic'].toFixed(2);
                    text_current_data.innerHTML = "Naočkovaní obyvatelé na 100 tisíc obyvatel";
                    analysis_name_value = "davka_celkem_den_sto_tisic";
                    analysis_name_max_value = "davka_celkem_den_max_sto_tisic";
                    analysis_name_min_value = "davka_celkem_den_min_sto_tisic";
                }
                else {
                    okres_value = new_data[selected_date_text][okres_lau]['davka_celkem_den'].toFixed(2);
                    maximum_day = new_data[selected_date_text]['davka_celkem_den_max'].toFixed(2);
                    minimum_day = new_data[selected_date_text]['davka_celkem_den_min'].toFixed(2);
                    text_current_data.innerHTML = "Naočkovaní obyvatelé";
                    analysis_name_value = "davka_celkem_den";
                    analysis_name_max_value = "davka_celkem_den_max";
                    analysis_name_min_value = "davka_celkem_den_min";
                }
                break;

            case "Všechny dávky doposud":
                if (data_recalculation) {
                    okres_value = new_data[selected_date_text][okres_lau]['davka_celkem_doposud_sto_tisic'].toFixed(2);
                    maximum_day = new_data[selected_date_text]['davka_celkem_doposud_max_sto_tisic'].toFixed(2);
                    minimum_day = new_data[selected_date_text]['davka_celkem_doposud_min_sto_tisic'].toFixed(2);
                    text_current_data.innerHTML = "Naočkovaní obyvatelé na 100 tisíc obyvatel";
                    analysis_name_value = "davka_celkem_doposud_sto_tisic";
                    analysis_name_max_value = "davka_celkem_doposud_max_sto_tisic";
                    analysis_name_min_value = "davka_celkem_doposud_min_sto_tisic";
                }
                else {
                    okres_value = new_data[selected_date_text][okres_lau]['davka_celkem_doposud'].toFixed(2);
                    maximum_day = new_data[selected_date_text]['davka_celkem_doposud_max'].toFixed(2);
                    minimum_day = new_data[selected_date_text]['davka_celkem_doposud_min'].toFixed(2);
                    text_current_data.innerHTML = "Naočkovaní obyvatelé";
                    analysis_name_value = "davka_celkem_doposud";
                    analysis_name_max_value = "davka_celkem_doposud_max";
                    analysis_name_min_value = "davka_celkem_doposud_min";
                }
                break;

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
        }

        current_values.push(okres_value);
        totalValue += okres_value;
        if (data_minimum_type == "zero") minimum_day = 0;

        // Update text if current district is selected
        if (okres_clicked == okres_lau) {
            switch (map_show_data) {
                case "Současně nakažení":
                    okres_nakazeni.innerHTML = parseInt(new_data[selected_date_text][okres_lau]['aktivni_pripady']);
                    break;
                case "Nové případy":
                    okres_nakazeni.innerHTML = parseInt(new_data[selected_date_text][okres_lau]['nove_pripady']);
                    break;
            }
            okres_nakazeni.innerHTML = okres_value;
        }

        // Calculate colors
        var color1 = [];
        var color2 = [];
        switch (current_analysis) {
            case "nakazeni-analyze":
                color1 = [255, 105, 0];
                color2 = [255, 255, 255];
                break;
            case "ockovani-analyze":
                color1 = [0, 150, 0];
                color2 = [255, 255, 255];
                break;
            case "umrti-analyze":
                color1 = [30, 30, 30];
                color2 = [255, 255, 255];
                break;
            case "ovlivneno-analyze":
                color1 = [0, 0, 200];
                color2 = [255, 255, 255];
                break;
            default:
                color1 = [255, 0, 0];
                color2 = [0, 255, 0];
                break;
        }

        // Draw scale rectangle
        document.getElementById("scale_rectangle").style.background = "linear-gradient(90deg, rgba(" + color2[0] + "," + color2[1] + "," + color2[2] + ",1) 0%, rgba(" + color1[0] + "," + color1[1] + "," + color1[2] + ",1) 100%)";
        document.getElementById("scale_min").innerHTML = numberWithCommas(minimum_day);
        document.getElementById("scale_max").innerHTML = numberWithCommas(maximum_day);

        // Calculate other stuff and set color
        var min_max_difference = maximum_day - minimum_day;
        if (min_max_difference == 0) {
            children[i].setAttribute("fill", "#FFFFFF");
            continue;
        }
        var w1 = (okres_value - minimum_day) / min_max_difference;
        var w2 = 1 - w1;
        var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
        var color_string = "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
        children[i].setAttribute("fill", color_string);
    }
}

// Select type of analysis (infected, recovered...)
function selectAnalysis(type) {
    analysis_changed = true;
    current_analysis = type;
    selectSliderType(slider_current_type);
    analyze_fields.forEach((element) => {
        // Set colors and other elements according to selected type of analysis
        if (element == type) {
            var topbar = document.getElementById("topbar");
            // var color = field.getAttribute('color');
            // var background_color = field.getAttribute('background-color');
            // var outer_iframe = document.getElementById("outer-iframe");
            // var inner_iframe = document.getElementById("inner-iframe");
            // var outer_iframe_current_color = outer_iframe.getAttribute('color');
            // var inner_iframe_current_color = inner_iframe.getAttribute('color');
            // outer_iframe.className = outer_iframe.className.replace(outer_iframe_current_color, color);
            // inner_iframe.className = inner_iframe.className.replace(inner_iframe_current_color, color);
            // outer_iframe.setAttribute("color", color);
            // inner_iframe.setAttribute("color", color);

            select_2.innerHTML = "";

            switch (element) {
                case 'nakazeni-analyze':
                    // topbar.style.background = "linear-gradient(90deg, rgba(255,255,255,1) 60%, #ff9800 100%)";
                    document.getElementById("nakazeni-analyze").classList.add("w3-orange");
                    document.getElementById("nakazeni-analyze").style.opacity = 1;
                    document.getElementById("nakazeni-analyze").style.borderStyle = "solid";
                    document.getElementById("nakazeni-analyze").style.borderWidth = "2px";
                    document.getElementById("nakazeni-analyze").style.borderColor = "#cc7900";
                    document.getElementById("ockovani-analyze").classList.remove("w3-green");
                    document.getElementById("ockovani-analyze").style.backgroundColor = "#FFFFFF";
                    document.getElementById("ockovani-analyze").style.opacity = 0.6;
                    document.getElementById("ockovani-analyze").style.borderStyle = "none";
                    document.getElementsByClassName("noUi-connect")[0].style.background = "#ff9800";
                    map_title.innerHTML = "<b>Vizualizace COVID-19 dat v České republice</b> | Počty nakažených";
                    var option1 = document.createElement('option');
                    option1.value = "Současně nakažení";
                    option1.innerHTML = "Současně nakažení";
                    var option2 = document.createElement('option');
                    option2.value = "Nové případy";
                    option2.innerHTML = "Nové případy";
                    select_2.appendChild(option1);
                    select_2.appendChild(option2);
                    current_analysis_color = "#ff9800";
                    // document.getElementById("slider").style.accentColor = "#ff9800";
                    // document.getElementById("slider").style.backgroundColor = "#ffffff";
                    break;
                case 'ockovani-analyze':
                    // topbar.style.background = "linear-gradient(90deg, rgba(255,255,255,1) 60%, #4caf50 100%)";
                    document.getElementById("nakazeni-analyze").classList.remove("w3-orange");
                    document.getElementById("nakazeni-analyze").style.backgroundColor = "#FFFFFF";
                    document.getElementById("nakazeni-analyze").style.opacity = 0.6;
                    document.getElementById("nakazeni-analyze").style.borderStyle = "none";
                    document.getElementById("ockovani-analyze").classList.add("w3-green");
                    document.getElementById("ockovani-analyze").style.opacity = 1;
                    document.getElementById("ockovani-analyze").style.borderStyle = "solid";
                    document.getElementById("ockovani-analyze").style.borderWidth = "2px";
                    document.getElementById("ockovani-analyze").style.borderColor = "#357c38";
                    document.getElementsByClassName("noUi-connect")[0].style.background = "#4caf50";
                    map_title.innerHTML = "<b>Vizualizace COVID-19 dat v České republice</b> | Počty naočkovaných";

                    var options = [
                        "Všechny dávky tento den",
                        "Všechny dávky doposud",
                        "První dávka tento den",
                        "První dávka doposud",
                        "Druhá dávka tento den",
                        "Druhá dávka doposud",
                        "Třetí dávka tento den",
                        "Třetí dávka doposud",
                        "Čtvrtá dávka tento den",
                        "Čtvrtá dávka doposud"
                    ];

                    options.forEach((element) => {
                        var opt = document.createElement('option');
                        opt.value = opt.innerHTML = element;
                        select_2.appendChild(opt);
                    }
                    );
                    current_analysis_color = "#4caf50";
                    // document.getElementById("slider").style.accentColor = "#4caf50";
                    // document.getElementById("slider").style.background = "#ffffff";
                    break;
                case 'umrti-analyze':
                    topbar.style.background = "linear-gradient(90deg, rgba(255,255,255,1) 37%, #616161 100%)";
                    document.getElementById("nakazeni-analyze").style.opacity = 0.6;
                    document.getElementById("ockovani-analyze").style.opacity = 0.6;
                    document.getElementById("umrti-analyze").style.opacity = 1;
                    document.getElementById("ovlivneno-analyze").style.opacity = 0.6;
                    document.getElementsByClassName("noUi-connect")[0].style.background = "#616161";
                    map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty úmrtí";
                    // document.getElementById("slider").style.accentColor = "#616161";
                    // document.getElementById("slider").style.background = "#ffffff";
                    break;
                case 'ovlivneno-analyze':
                    topbar.style.background = "linear-gradient(90deg, rgba(255,255,255,1) 37%, #00bcd4 100%)";
                    document.getElementById("nakazeni-analyze").style.opacity = 0.6;
                    document.getElementById("ockovani-analyze").style.opacity = 0.6;
                    document.getElementById("umrti-analyze").style.opacity = 0.6;
                    document.getElementById("ovlivneno-analyze").style.opacity = 1;
                    document.getElementsByClassName("noUi-connect")[0].style.background = "#00bcd4";
                    map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty testů";
                    // document.getElementById("slider").style.accentColor = "#00bcd4";
                    // document.getElementById("slider").style.background = "#ffffff";
                    break;
            }
        }

    })
    selectSliderData(select_2.value);
    // updatePage();
}

// Initializer for time frame slider
function loadTimeFrameSlider() {
    var today = new Date();
    var covid_start = new Date("03/01/2020");
    var difference = today.getTime() - covid_start.getTime();
    days_since_covid = difference / (1000 * 3600 * 24);
    slider_values = [];
    for (var i = 0; i < days_since_covid; i++) {
        slider_values[i] = i + 1;
    }
    var valuesSlider = document.getElementById('values-slider');
    var snapValues = [
        document.getElementById('slider-min'),
        document.getElementById('slider-max')
    ];
    var valuesForSlider = slider_values;
    var format = {
        to: function (value) {
            return valuesForSlider[Math.round(value)];
        },
        from: function (value) {
            return valuesForSlider.indexOf(Number(value));
        }
    };
    noUiSlider.create(valuesSlider, {
        start: [8, 24],
        // A linear range from 0 to 15 (16 values)
        range: { min: 0, max: valuesForSlider.length - 2 },
        connect: [false, true, false],
        // steps of 1
        step: 1,
        format: format
    });
    valuesSlider.noUiSlider.set(['7', '28']);
    valuesSlider.noUiSlider.on('update', function (values, handle) {
        analysis_changed = true;
        var selected_date = new Date();
        switch (slider_current_type) {
            case "Den":
                selected_date.setDate(selected_date.getDate() - (slider_values.length - values[handle]));
                slider_text_value.innerHTML = "<i>" + (values[1] - values[0]) + " dní</i>";
                break;
            case "Týden":
                selected_date.setDate(selected_date.getDate() - (slider_values.length - (values[handle] * 7)));
                slider_text_value.innerHTML = "<i>" + (values[1] - values[0]) + " týdnů</i>";
                break;
            case "Měsíc":
                selected_date.setDate(selected_date.getDate() - (slider_values.length - (values[handle] * 30)));
                slider_text_value.innerHTML = "<i>" + (values[1] - values[0]) + " měsíců</i>";
                break;
            case "Rok":
                break;
        }
        var selected_date_text = getFormattedDateLocal(selected_date);
        snapValues[handle].innerHTML = "<b>" + selected_date_text + "</b>";
        slider_current_values[handle] = values[handle];
    });
    document.getElementsByClassName("noUi-target")[0].style.background = "#ffffff";
}

function selectSliderType(value) {
    analysis_selected = true;
    analysis_changed = true;
    var valuesSlider = document.getElementById('values-slider');
    slider_current_type = value;

    var today = new Date();

    switch (current_analysis) {
        case 'nakazeni-analyze':
            var diff = today.getTime() - covid_start.getTime();
            break;
        case 'ockovani-analyze':
            var diff = today.getTime() - vaccination_start.getTime();
            break;
    }
    var days_since = diff / (1000 * 3600 * 24);

    switch (value) {
        case "Den":
            valuesSlider.noUiSlider.updateOptions({
                range:
                {
                    min: days_since_covid - days_since,
                    max: days_since_covid - 1
                }
            });
            break;
        case "Týden":
            valuesSlider.noUiSlider.updateOptions({
                range:
                {
                    min: ((days_since_covid - days_since) / 7),
                    max: (days_since_covid / 7) - 1
                }
            });
            break;
        case "Měsíc":
            valuesSlider.noUiSlider.updateOptions({
                range:
                {
                    min: ((days_since_covid - days_since) / 30),
                    max: (days_since_covid / 30) - 1
                }
            });
            break;
        case "Rok":
            break;
    }

    valuesSlider
}

function selectSliderData(value) {
    map_show_data = value;
    initChart();
    switch (value) {
        case "Současně nakažení":
            map_title.innerHTML = "<b>Vizualizace COVID-19 dat v České republice</b> | Počty nakažených - současný počet případů";
            break;
        case "Nové případy":
            map_title.innerHTML = "<b>Vizualizace COVID-19 dat v České republice</b> | Počty nakažených - počet nově zjištěných případů";
            break;

        case "Všechny dávky tento den":
            map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty očkovaných - celkový počet vydaných dávek očkování daný den";
            break;
        case "Všechny dávky doposud":
            map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty očkovaných - celkový počet vydaných dávek očkování doposud";
            break;

        case "První dávka tento den":
            map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty očkovaných - počet vydaných prvních dávek očkování daný den";
            break;
        case "První dávka doposud":
            map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty očkovaných - celkový počet vydaných prvních dávek očkování doposud";
            break;

        case "Druhá dávka tento den":
            map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty očkovaných - počet vydaných druhých dávek očkování daný den";
            break;
        case "Druhá dávka doposud":
            map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty očkovaných - celkový počet vydaných druhých dávek očkování doposud";
            break;

        case "Třetí dávka tento den":
            map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty očkovaných - počet vydaných třetích dávek očkování daný den";
            break;
        case "Třetí dávka doposud":
            map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty očkovaných - celkový počet vydaných třetích dávek očkování doposud";
            break;

        case "Čtvrtá dávka tento den":
            map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty očkovaných - počet vydaných čtvrtých dávek očkování daný den";
            break;
        case "Čtvrtá dávka doposud":
            map_title.innerHTML = "<b>Mapa okresů ČR</b> | Počty očkovaných - celkový počet vydaných čtvrtých dávek očkování doposud";
            break;
    }
    updatePage();
    initChart();
}

function confirmRangeAnalysis() {
    if (!analysis_selected) {
        toast("Vyberte prosím data k vizualizaci");
        return;
    }
    analysis_changed = false;
    if (map_enabled == false) {
        iframe.style.pointerEvents = "auto";
        map_enabled = true;
    }
    var value_min = new Date();
    var value_max = new Date();

    slider.setAttribute("min", 0);
    switch (slider_current_type) {
        case "Den":
            value_min.setDate(value_min.getDate() - (slider_values.length - slider_current_values[0]));
            value_max.setDate(value_max.getDate() - (slider_values.length - slider_current_values[1]));
            slider.setAttribute("max", slider_current_values[1] - slider_current_values[0]);
            break;
        case "Týden":
            value_min.setDate(value_min.getDate() - (slider_values.length - (slider_current_values[0] * 7)));
            value_max.setDate(value_max.getDate() - (slider_values.length - (slider_current_values[1] * 7)));
            slider.setAttribute("max", (slider_current_values[1] - slider_current_values[0]) * 7);
            break;
        case "Měsíc":
            value_min.setDate(value_min.getDate() - (slider_values.length - (slider_current_values[0] * 30)));
            value_max.setDate(value_max.getDate() - (slider_values.length - (slider_current_values[1] * 30)));
            slider.setAttribute("max", (slider_current_values[1] - slider_current_values[0]) * 30);
            break;
        case "Rok":
            break;
    }
    slider.value = "0";

    var url;
    switch (current_analysis) {
        case "nakazeni-analyze":
            url = "http://127.0.0.1:8000/api/range/days/from=" + getFormattedDate(value_min) + "&to=" + getFormattedDate(value_max) + "&type=infection";
            break;
        case "ockovani-analyze":
            url = "http://127.0.0.1:8000/api/range/days/from=" + getFormattedDate(value_min) + "&to=" + getFormattedDate(value_max) + "&type=vaccination";
            break;
    }

    loadingToast("Stahuji nová data...");
    $.ajax({
        url: url,
        headers: { 'accept': 'application/json' },
        type: "GET",
        success: function (result) {
            processGetDataFromSlider(result);
            initChart();
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function processGetDataFromSlider(result) {
    new_data = result;
    updatePage();
    toast("Byla aktualizována data.");
}

function toast(message) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerHTML = message;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 4000);
}

function loadingToast(message) {
    // Get the snackbar DIV
    snackbar.innerHTML = "<div class=\"spinner-border w3-center\" role=\"status\">" + "<span class=\"sr-only\"> Loading... </span>" + "</div>" + "<div>" + message + "</div>";

    // Add the "show" class to DIV
    snackbar.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { snackbar.className = snackbar.className.replace("show", ""); }, 5000);
}

function sliderDateChange(value) {
    if (analysis_changed) {
        toast("Prosím potvrďte nové změny");
        return;
    }
    var curr = parseInt(slider.value);
    slider.value = curr + value;
    updatePage();
}

function iframeCheckClick() {
    if (map_enabled == false) {
        toast("Prosím vyberte data na analyzování");
    }
}

function checkboxCovidWaveClick(el) {
    if (el.checked == false) {
        document.getElementsByClassName("noUi-target")[0].style.background = "#ffffff";
    }
    else {
        document.getElementsByClassName("noUi-target")[0].style.background = "linear-gradient(90deg, rgba(131,255,73,1) 0%, rgba(255,127,117,1) 21%, rgba(221,61,48,1) 30%, rgba(93,255,67,1) 49%, rgba(222,77,66,1) 68%, rgba(255,163,163,1) 100%)";
    }
}

// function checkboxGetMinimumType(val) {
//     this.data_minimum_type = val;
//     updatePage();
// }

function changeRecalculation() {
    this.data_recalculation = !this.data_recalculation;
    updatePage();
    initChart();
}

function showHideLeftUpperPanel() {
    var x = document.getElementById("left_upper_panel");
    var x2 = document.getElementById("button_left_upper_panel");
    if (x.style.display === "none") {
        x.style.display = "block";
        x2.innerHTML = "<b>Schovat nastavení</b>";
    } else {
        x.style.display = "none";
        x2.innerHTML = "<b>Zobrazit nastavení</b>";
    }
}

function showHideLeftBottomPanel1() {
    var x = document.getElementById("left_bottom_panel_1");
    document.getElementById("left_bottom_panel_2").style.display = "none";
    var x2 = document.getElementById("button_left_bottom_panel_1");
    if (x.style.display === "none") {
        x.style.display = "block";
        x2.innerHTML = "<b>Schovat informace o okrese</b>";
    } else {
        x.style.display = "none";
        x2.innerHTML = "<b>Zobrazit informace o okrese</b>";
    }
}

function showHideLeftBottomPanel2() {
    var x = document.getElementById("left_bottom_panel_2");
    document.getElementById("left_bottom_panel_1").style.display = "none";
    var x2 = document.getElementById("button_left_bottom_panel_2");
    if (x.style.display === "none") {
        x.style.display = "block";
        x2.innerHTML = "<b>Schovat graf</b>";
    } else {
        x.style.display = "none";
        x2.innerHTML = "<b>Zobrazit graf</b>";
    }
}

function initChart() {
    var val_min = slider_current_values[0];
    var val_max = slider_current_values[1];
    var no_x_labels = (slider_current_values[1] - slider_current_values[0]) / 7;
    if (okres_clicked == "") return;

    var date_start = addDays(covid_start_string, val_min - 1);
    var date_end = addDays(covid_start_string, val_max - 1);

    var xArray = [];
    var yArray = [];

    for (var i = val_min; i <= val_max; i++) {
        if (i == val_min) xArray.push(getFormattedDateLocal(date_start));
        else if (i == val_max) xArray.push(getFormattedDateLocal(date_end));
        else xArray.push(getFormattedDateLocal(addDays(covid_start_string, i)));
    }

    for (var i = val_min; i < val_max; i++) {
        var d = getFormattedDate(addDays(covid_start_string, i));
        var o = okres_clicked;
        var v = analysis_name_value;
        yArray.push(new_data[d][o][v]);
    }

    // Define Data
    var data = [{
        x: xArray,
        y: yArray,
        fill: 'tozeroy',
        mode: "lines",
        line: {
            color: current_analysis_color,
            width: 2
        }
    }];

    // Define Layout
    var layout = {
        plot_bgcolor: "rgba(255, 255, 255, 0.6)",
        paper_bgcolor: "rgba(255, 255, 255, 0.6)",
        xaxis: {
            visible: false
        },
        title: {
            text: map_show_data,
            font: {
                size: 20
            },
            y: 0.85
        },
        height: 300,
        margin: {
            l: 45,
            r: 30,
            b: 30,
            t: 80,
            pad: 4
        },
    };

    // Display using Plotly
    Plotly.newPlot("district_chart", data, layout, { displayModeBar: true });
}