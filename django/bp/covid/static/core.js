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
var okres_clicked_name = "";
var okres_clicked_map_object = -1;
var analyze_fields = ["nakazeni-analyze", "ockovani-analyze", "umrti-analyze", "testovani-analyze"];
var current_analysis = "nakazeni-analyze";
var current_pip_analysis = "nakazeni-analyze";
var analysis_selected = false;
var analysis_changed = true;
var analysis_first_picked = false;
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
var map_show_data = "Nové případy";
var map_show_data_PIP = "Nové případy";
var text_current_data_sto_tisic;
var text_current_data;
var iframe;
var iframe_pip;
var map_enabled = false;
var select_2;
var snackbar;
var data_minimum_type = "zero";
var data_recalculation = true;
var data_max_recalculation = false;
var covid_start = new Date("03/01/2020");
var covid_start_string = "03/01/2020";
var vaccination_start = new Date("12/27/2020");
var vaccination_start_string = "12/27/2020";
var deaths_start = new Date("03/22/2020");
var deaths_start_string = "03/22/2020";
var testing_start = new Date("08/01/2020");
var testing_start_string = "08/01/2020";
var covid_start_week = new Date("03/02/2020");
var covid_start_week_string = "03/02/2020";
var covid_start_weeks = [];
var covid_start_month = new Date("03/01/2020");
var covid_start_month_string = "03/01/2020";
var covid_start_months = [];
var current_values = []
var analysis_name_value;
var analysis_name_min_value;
var analysis_name_max_value;
var current_analysis_color;
var main_slider_range_max = (new Date().getTime() - covid_start.getTime()) / (1000 * 3600 * 24);
var current_time_window_low;
var current_time_window_high;
var warning_block;
var current_map_opacity = 0.6;
var current_district_opacity = 0.7;
var current_district_stroke_opacity = 0.7;
var current_ui_scale = 100;
var dark_mode = false;
var page_initialized = false;
var sheet_orange;
var sheet_green;
var sheet_purple;
var sheet_gray;
var sheet_default;

// Initialize and modify webpage on startup
function onIframeLoad() {
    loadUIScaleFromLocalStorage();
    loadPageComponents();
    loadTimeFrameSlider();
    initPage();
}

// Initialize and modify PIP on startup
function onIframePIPLoad() {
    initPIP();
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
    map_date_1 = document.getElementById("map_date_1");
    map_date_2 = document.getElementById("map_date_2");
    map_title = document.getElementById("map_title");
    slider = document.getElementById("slider");
    output = document.getElementById("slider_text");
    slider_text_value = document.getElementById("slider-value");
    iframe = document.getElementById("iframe");
    iframe_pip = document.getElementById("iframe_pip");
    select_2 = document.getElementById("sel2");
    snackbar = document.getElementById("snackbar");
    warning_block = document.getElementById("div_middle_top_part");
    sheet_orange = document.getElementById("material_css_orange");
    sheet_green = document.getElementById("material_css_green");
    sheet_purple = document.getElementById("material_css_purple");
    sheet_gray = document.getElementById("material_css_gray");
}

// Handle window resizing
function onResize() {
    var x = document.getElementById("map_title");
    if (window.innerWidth <= 1150) {
        x.style.display = "none";
    }
    else {
        x.style.display = "";
    }

    x = document.getElementById("left_upper_panel");
    x2 = document.getElementById("button_left_upper_panel");
}

// Initialize webpage on startup
function initPage() {
    try {
        onResize();
        generateWeeksMonths();

        window.addEventListener('resize', onResize);

        slider.oninput = updatePage;
        iframe = document.getElementById("iframe");
        iframe_pip = document.getElementById("iframe_pip");
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

        setMapOpacity();
        document.getElementById("button-hide-splash").disabled = false;
        document.getElementById("button-hide-splash").innerHTML = "Přejít k aplikaci";
        setTimeout(
            function(){
                $('#splashscreen_before').fadeOut(500);
                loadDarkModeFromLocalStorage();
            }, 500
        );
    }
    catch (err) {
        console.log(err);
        // try {
        //     newErrorToast(err.message);
        // }
        // catch (err) {
        //     console.log(err);
        // }
    }
}

// Initialize PIP on startup
function initPIP() {
    try {
        iframe_pip = document.getElementById("iframe_pip");
        const elements = iframe_pip.contentWindow.document.getElementsByClassName("leaflet-control-layers-toggle");
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }

        // Picture-in-picture
        var parent = iframe_pip.contentWindow.document.querySelector("g");
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
    }
    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
    }
    // updatePage();
}

// Click function - AJAX request
async function onClickMap(name, okres_lau, object) {
    try {
        // If no analysis havent been selected, dont do anything
        if (map_enabled == false) {
            return;
        }

        // Save district
        okres_clicked = okres_lau;
        okres_clicked_name = name;

        // Graph
        initChart();

        // Remove additional stroke-width from previous district
        if (okres_clicked_map_object != -1) {
            iframe.contentWindow.document.querySelector("g").children[okres_clicked_map_object].setAttribute("stroke-width", current_district_stroke_opacity);
        }

        // Set selected district stroke-width
        object.setAttribute("stroke-width", 4.5);

        // Get needed variables
        selected_date_text = getFormattedDate(slider_current_selected_date);

        // Get popup
        var popups = [];
        console.log(popups);
        while (popups.length == 0) {
            await sleep(10);
            popups = iframe.contentWindow.document.getElementsByClassName("leaflet-popup-content");
            console.log(popups);
        }

        // Edit popup properties
        var popup_element_content = popups[0].children[0];
        var popup_wrapper = iframe.contentWindow.document.getElementsByClassName("leaflet-popup-content-wrapper")[0];
        popups[0].style.width = "auto";
        popups[0].style.height = "auto";
        popup_element_content.innerHTML = "";

        // Create popup elements
        var popup_table = document.createElement("table");
        var popup_table_2 = document.createElement("table");
        var popup_row_1 = document.createElement("tr");
        var popup_row_2 = document.createElement("tr");
        var popup_row_3 = document.createElement("tr");
        var popup_row_4 = document.createElement("tr");
        var popup_row_1_cell_1 = document.createElement("td");
        var popup_row_1_cell_2 = document.createElement("td");
        var popup_row_2_cell_0 = document.createElement("td");
        var popup_row_2_cell_1 = document.createElement("td");
        var popup_row_2_cell_2 = document.createElement("td");
        var popup_row_3_cell_0 = document.createElement("td");
        var popup_row_3_cell_1 = document.createElement("td");
        var popup_row_3_cell_2 = document.createElement("td");
        var popup_row_4_cell_0 = document.createElement("td");
        var popup_row_4_cell_1 = document.createElement("td");
        var popup_row_4_cell_2 = document.createElement("td");
        var icon_1 = document.createElement("span");
        var icon_2 = document.createElement("span");
        var icon_3 = document.createElement("span");
        var popup_hr = document.createElement("hr");

        // Edit popup elements
        if (dark_mode) {
            popup_wrapper.style.backgroundColor = "rgb(29, 29, 29)";
            popup_wrapper.style.color = "white";
        }
        icon_1.className = "material-symbols-outlined";
        icon_2.className = "material-symbols-outlined";
        icon_3.className = "material-symbols-outlined";
        icon_1.innerHTML = "bar_chart";
        icon_2.innerHTML = "grouped_bar_chart";
        icon_3.innerHTML = "person";
        popup_table.style.width = "200px";
        popup_table_2.style.width = "200px";
        popup_hr.style.marginRight = "30px";
        popup_hr.style.marginLeft = "2px";
        popup_hr.style.marginTop = "3px";
        popup_hr.style.marginBottom = "5px";
        // popup_row_1_cell_1.setAttribute("width", "60%");
        // popup_row_2_cell_1.setAttribute("width", "60%");
        // popup_row_3_cell_1.setAttribute("width", "60%");
        // popup_row_4_cell_1.setAttribute("width", "60%");
        // popup_row_1_cell_2.setAttribute("width", "40%");
        // popup_row_2_cell_2.setAttribute("width", "40%");
        // popup_row_3_cell_2.setAttribute("width", "40%");
        // popup_row_4_cell_2.setAttribute("width", "40%");
        // popup_row_1_cell_1.innerHTML = "<b>Okres</b>";
        popup_row_2_cell_0.appendChild(icon_1);
        popup_row_2_cell_1.innerHTML = "<b>Počet</b>";
        popup_row_3_cell_0.appendChild(icon_2);
        popup_row_3_cell_1.innerHTML = "<b>Počet / 100 tisíc</b>";
        popup_row_4_cell_0.appendChild(icon_3);
        popup_row_4_cell_1.innerHTML = "<b>Počet obyvatel</b>";
        popup_row_1_cell_1.setAttribute("id", "text_okres_nazev");
        popup_row_1_cell_1.style.padding = "3px";
        // popup_row_1_cell_1.style.paddingBottom = "5px";
        popup_row_1_cell_1.style.fontSize = "17px";
        popup_row_1_cell_1.style.fontWeight = "bolder";
        // popup_row_1_cell_1.style.marginLeft = "15px";
        popup_row_2_cell_2.setAttribute("id", "text_okres_nakazeni");
        popup_row_2_cell_1.style.padding = "3px";
        popup_row_2_cell_1.style.paddingLeft = "5px";
        popup_row_3_cell_1.setAttribute("id", "text_current_data");
        popup_row_3_cell_2.setAttribute("id", "text_okres_nakazeni_100");
        popup_row_3_cell_1.style.padding = "3px";
        popup_row_3_cell_1.style.paddingLeft = "5px";
        popup_row_3_cell_1.style.paddingRight = "5px";
        // popup_row_3_cell_1.style.marginLeft = "15px";
        popup_row_4_cell_2.setAttribute("id", "text_okres_pocet_obyvatel");
        popup_row_4_cell_1.style.padding = "3px";
        popup_row_4_cell_1.style.paddingLeft = "5px";

        // Add district data into popup
        popup_row_1_cell_1.innerHTML = name;
        popup_row_2_cell_2.innerHTML = okres_lau;
        popup_row_3_cell_2.innerHTML = " ";
        popup_row_4_cell_2.innerHTML = okresy_pocet_obyvatel[okres_lau].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Add elements into popup
        popup_row_1.appendChild(popup_row_1_cell_1);
        popup_row_1.appendChild(popup_row_1_cell_2);
        popup_row_2.appendChild(popup_row_2_cell_0);
        popup_row_2.appendChild(popup_row_2_cell_1);
        popup_row_2.appendChild(popup_row_2_cell_2);
        popup_row_3.appendChild(popup_row_3_cell_0);
        popup_row_3.appendChild(popup_row_3_cell_1);
        popup_row_3.appendChild(popup_row_3_cell_2);
        popup_row_4.appendChild(popup_row_4_cell_0);
        popup_row_4.appendChild(popup_row_4_cell_1);
        popup_row_4.appendChild(popup_row_4_cell_2);
        popup_table.appendChild(popup_row_1);
        popup_table_2.appendChild(popup_row_2);
        popup_table_2.appendChild(popup_row_3);
        popup_table_2.appendChild(popup_row_4);
        popup_element_content.appendChild(popup_table);
        popup_element_content.appendChild(popup_hr);
        popup_element_content.appendChild(popup_table_2);

        // Delete popup close button
        var close_buttons = iframe.contentWindow.document.getElementsByClassName("leaflet-popup-close-button");
        while (close_buttons.length > 0) {
            close_buttons[0].parentNode.removeChild(close_buttons[0]);
        }

        var popup_tip = iframe.contentWindow.document.getElementsByClassName("leaflet-popup-tip-container");
        while (popup_tip.length > 0) {
            popup_tip[0].parentNode.removeChild(popup_tip[0]);
        }

        // Update page
        updatePage();
    }
    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
    }
}

// sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// handle animation button
async function handleAnimation() {
    try {
        if (analysis_changed) {
            newToast("Prosím potvrďte nové změny");
            return;
        }
        ongoing_animation = true;
        var max_value = parseInt(slider.getAttribute('max'));
        var current_value = parseInt(slider.value);
        for (var cur = current_value; cur < max_value; cur++) {
            if (ongoing_animation == false) break;
            // slider.value = cur + 1;
            slider.MaterialSlider.change(cur + 1);
            updatePage();
            await sleep(animation_speed * 30);
        }
    }
    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
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

// Add comma separator into number
// inspired by: https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    if (x != null)
        return Math.round(parseFloat(x)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else
        return 0;
}

// Function to add days to given date
function addDays(date, days) {
    var ms = new Date(date).getTime() + (86400000 * days);
    var result = new Date(ms);
    return result;
}

// Helper function to calculate color
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

// Return date formatted as string with Czech localization
function getFormattedDateLocal(date) {
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear();
}

// Return date formatted as string
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

// Function that updates slider text
function updatePage() {

    try {
        if (!analysis_first_picked) {
            newToast("Prosím potvrďte volbu datasetu v okně \"Časové okno\"");
            return;
        }

        if (analysis_changed) {
            newToast("Prosím potvrďte nové změny");
            return;
        }

        current_values = []

        // Init needed variables
        var totalValue = 0;
        var okres_value;
        var okres_value_PIP;
        var maximum_day;
        var maximum_day_PIP;
        var minimum_day;
        var minimum_day_PIP;
        var selected_date = new Date();
        var value_name;
        var value_name_second;
        var max_value_name;
        var min_value_name;
        var text;
        var value_name_PIP;
        var max_value_name_PIP;
        var min_value_name_PIP;
        var skip_normal_map;
        var skip_pip_map;
        var selected_100 = false;

        // Get all variables connected with date
        switch (slider_current_type) {
            case "Den":
                selected_date.setDate(selected_date.getDate() - Math.floor(days_since_covid - slider_current_values[0]) - 1);
                break;
            case "Týden":
                selected_date = new Date(covid_start_weeks[slider_current_values[0] - 1]);
                break;
            case "Měsíc":
                selected_date = new Date(covid_start_months[slider_current_values[0] - 1]);
                break;
            case "Rok":
                break;
        }

        selected_date = addDays(selected_date, slider.value);
        slider_current_selected_date = selected_date;
        var selected_date_text = getFormattedDate(selected_date);
        var selected_date_text_local = getFormattedDateLocal(selected_date);

        // Update some values and texts on page
        output.innerHTML = selected_date.toLocaleDateString("cs-CZ");
        map_date_1.innerHTML = selected_date_text_local;
        map_date_2.innerHTML = selected_date_text_local;

        map_info_1.style.display = "block";
        map_info_2.style.display = "block";
        warning_block.style.display = "none";
        switch (current_analysis) {
            case "nakazeni-analyze":
                map_info_1.innerHTML = "<b>Nové případy za tento den:</b> " + numberWithCommas(new_data[selected_date_text]['nove_celkovy_pocet']);
                // map_info_2.innerHTML = "<b>Současný počet případů za tento den:</b> " + numberWithCommas(new_data[selected_date_text]['aktivni_celkovy_pocet']);
                map_info_2.innerHTML = "<b>Celkový počet zaznamenaných případů v tento den:</b> " + numberWithCommas(new_data[selected_date_text]['celkem_pripady']);
                map_info_3.innerHTML = "";
                map_info_3.style.display = "none";
                break;
            case "ockovani-analyze":
                map_info_1.innerHTML = "<b>Nová očkování za tento den:</b> " + numberWithCommas(new_data[selected_date_text]['davka_celkem_den']);
                map_info_3.innerHTML = "<b>Celkový počet obyvatel naočkovaných alespoň první a druhou dávkou:</b> " + numberWithCommas(new_data[selected_date_text]['davka_2_doposud']);
                map_info_2.innerHTML = "<b>Celkový počet zaznamenaných očkování doposud:</b> " + numberWithCommas(new_data[selected_date_text]['davka_celkem_doposud']);
                map_info_3.style.display = "block";
                if (selected_date < vaccination_start) warning_block.style.display = "block";
                break;
            case "umrti-analyze":
                map_info_1.innerHTML = "<b>Počet zemřelých tento den:</b> " + numberWithCommas(new_data[selected_date_text]['celkem_den']);
                map_info_2.innerHTML = "<b>Celkový počet zemřelých k tomuto dni:</b> " + numberWithCommas(new_data[selected_date_text]['celkem_doposud']);
                map_info_3.innerHTML = "";
                map_info_3.style.display = "none";
                if (selected_date < deaths_start) warning_block.style.display = "block";
                break;
            case "testovani-analyze":
                map_info_1.innerHTML = "<b>Počet otestovaných tento den:</b> " + numberWithCommas(new_data[selected_date_text]['celkem_prirustek_den']);
                map_info_2.innerHTML = "<b>Celkový počet otestovaných k tomuto dni:</b> " + numberWithCommas(new_data[selected_date_text]['celkem_celkem_den']);
                map_info_3.innerHTML = "";
                map_info_3.style.display = "none";
                if (selected_date < testing_start) warning_block.style.display = "block";
                break;
        }

        // Map district updating - go through all districts
        var parent = iframe.contentWindow.document.querySelector("g");
        var children = parent.children;

        if (data_recalculation) {
            selected_100 = true;
            value_name = data_analysis_types[map_show_data]['value_100'];
            value_name_second = data_analysis_types[map_show_data]['value'];
            value_name_PIP = data_analysis_types[map_show_data_PIP]['value_100'];
            max_value_name = data_analysis_types[map_show_data]['max_value_100'];
            max_value_name_PIP = data_analysis_types[map_show_data_PIP]['max_value_100'];
            min_value_name = data_analysis_types[map_show_data]['min_value_100'];
            min_value_name_PIP = data_analysis_types[map_show_data_PIP]['min_value_100'];
            text = data_analysis_types[map_show_data]['text_100'];
            if (data_max_recalculation) {
                max_value_name = data_analysis_types[map_show_data]['max_range_100'];
                max_value_name_PIP = data_analysis_types[map_show_data_PIP]['max_range_100'];
            }
        }
        else {
            value_name = data_analysis_types[map_show_data]['value'];
            value_name_second = data_analysis_types[map_show_data]['value_100'];
            value_name_PIP = data_analysis_types[map_show_data_PIP]['value'];
            max_value_name = data_analysis_types[map_show_data]['max_value'];
            max_value_name_PIP = data_analysis_types[map_show_data_PIP]['max_value'];
            min_value_name = data_analysis_types[map_show_data]['min_value'];
            min_value_name_PIP = data_analysis_types[map_show_data_PIP]['min_value'];
            text = data_analysis_types[map_show_data]['text'];
            if (data_max_recalculation) {
                max_value_name = data_analysis_types[map_show_data]['max_range'];
                max_value_name_PIP = data_analysis_types[map_show_data_PIP]['max_range'];
            }
        }

        for (let i = 0; i < 77; i++) {
            skip_normal_map = false;
            skip_pip_map = false;

            // Get district LAU code
            var okres_lau = children[i].getAttribute('okres_lau');

            // Get needed values that are required for later computations and set some texts on page according to selected data
            okres_value = new_data[selected_date_text][okres_lau][value_name].toFixed(2);
            okres_value_second = new_data[selected_date_text][okres_lau][value_name_second].toFixed(2);
            okres_value_PIP = new_data[selected_date_text][okres_lau][value_name_PIP].toFixed(2);
            if (data_max_recalculation) {
                maximum_day = new_data[max_value_name].toFixed(2);
                maximum_day_PIP = new_data[max_value_name_PIP].toFixed(2);
            }
            else {
                maximum_day = new_data[selected_date_text][max_value_name].toFixed(2);
                maximum_day_PIP = new_data[selected_date_text][max_value_name_PIP].toFixed(2);
            }
            minimum_day = 0;
            minimum_day_PIP = 0;
            analysis_name_value = value_name;
            analysis_name_min_value = min_value_name;
            analysis_name_max_value = max_value_name;

            // Update text if current district is selected
            if (okres_clicked == okres_lau) {
                if (iframe.contentWindow.document.getElementById("text_okres_nakazeni") != null) {
                    if (selected_100) {
                        iframe.contentWindow.document.getElementById("text_okres_nakazeni_100").innerHTML = okres_value;
                        iframe.contentWindow.document.getElementById("text_okres_nakazeni").innerHTML = Math.round(okres_value_second);
                    }
                    else {
                        iframe.contentWindow.document.getElementById("text_okres_nakazeni_100").innerHTML = okres_value_second;
                        iframe.contentWindow.document.getElementById("text_okres_nakazeni").innerHTML = Math.round(okres_value_second);
                    }
                }
            }

            // Calculate colors
            var color1 = [];
            var color1_PIP = [];
            var color2 = [];
            var color2_PIP = [];
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
                case "testovani-analyze":
                    color1 = [128, 0, 128];
                    color2 = [255, 255, 255];
                    break;
                default:
                    color1 = [255, 0, 0];
                    color2 = [0, 255, 0];
                    break;
            }

            switch (current_pip_analysis) {
                case "nakazeni-analyze":
                    color1_PIP = [255, 105, 0];
                    color2_PIP = [255, 255, 255];
                    break;
                case "ockovani-analyze":
                    color1_PIP = [0, 150, 0];
                    color2_PIP = [255, 255, 255];
                    break;
                case "umrti-analyze":
                    color1_PIP = [30, 30, 30];
                    color2_PIP = [255, 255, 255];
                    break;
                case "testovani-analyze":
                    color1_PIP = [128, 0, 128];
                    color2_PIP = [255, 255, 255];
                    break;
                default:
                    color1_PIP = [255, 0, 0];
                    color2_PIP = [0, 255, 0];
                    break;
            }

            // Draw scale rectangle
            document.getElementById("scale_rectangle").style.background = "linear-gradient(90deg, rgba(" + color2[0] + "," + color2[1] + "," + color2[2] + ",1) 0%, rgba(" + color1[0] + "," + color1[1] + "," + color1[2] + ",1) 100%)";
            document.getElementById("scale_min").innerHTML = numberWithCommas(minimum_day);
            document.getElementById("scale_max").innerHTML = numberWithCommas(maximum_day);

            // PIP
            var parent_pip = iframe_pip.contentWindow.document.querySelector("g");
            var children_pip = parent_pip.children;

            // Calculate other stuff and set color
            var min_max_difference = maximum_day - minimum_day;
            var min_max_difference_PIP = maximum_day_PIP - minimum_day_PIP;
            if (min_max_difference == 0) {
                children[i].setAttribute("fill", "#FFFFFF");
                skip_normal_map = true;
            }
            if (min_max_difference_PIP == 0) {
                children_pip[i].setAttribute("fill", "#FFFFFF");
                skip_pip_map = true;
            }
            if (!skip_pip_map) {
                var w1_PIP = (okres_value_PIP - minimum_day_PIP) / min_max_difference_PIP;
                var w2_PIP = 1 - w1_PIP;
                var rgb_PIP = [Math.round(color1_PIP[0] * w1_PIP + color2_PIP[0] * w2_PIP),
                Math.round(color1_PIP[1] * w1_PIP + color2_PIP[1] * w2_PIP),
                Math.round(color1_PIP[2] * w1_PIP + color2_PIP[2] * w2_PIP)];
                var color_string_PIP = "#" + componentToHex(rgb_PIP[0]) + componentToHex(rgb_PIP[1]) + componentToHex(rgb_PIP[2]);
                children_pip[i].setAttribute("fill", color_string_PIP);
            }
            if (!skip_normal_map) {
                var w1 = (okres_value - minimum_day) / min_max_difference;
                var w2 = 1 - w1;
                var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
                Math.round(color1[1] * w1 + color2[1] * w2),
                Math.round(color1[2] * w1 + color2[2] * w2)];
                var color_string = "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
                children[i].setAttribute("fill", color_string);
            }
        }

    }
    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
    }
}

// Select type of analysis (infected, recovered...)
function selectAnalysis(type) {
    var infected_opacity = 0.6;
    var infected_borderBottom = "0px orange solid";
    var infected_fontWeight = "normal";

    var vaccination_opacity = 0.6;
    var vaccination_borderBottom = "0px green solid";
    var vaccination_fontWeight = "normal";

    var deaths_opacity = 0.6;
    var deaths_borderBottom = "0px gray solid";
    var deaths_fontWeight = "normal";

    var testing_opacity = 0.6;
    var testing_borderBottom = "0px purple solid";
    var testing_fontWeight = "normal";

    var options;
    var selectAnalysis_maptitle;
    var selectAnalysis_datasetdate;
    var selectAnalysis_sliderColor;

    try {
        current_analysis = type;
        analysis_selected = true;
        // selectSliderType(slider_current_type);
        analyze_fields.forEach(async (element) => {
            // Set colors and other elements according to selected type of analysis
            if (element == type) {
                var topbar = document.getElementById("topbar");
                select_2.innerHTML = "";

                switch (element) {
                    case 'nakazeni-analyze':
                        sheet_orange.disabled = false;
                        await sleep(50);
                        sheet_green.disabled = true;
                        sheet_purple.disabled = true;
                        sheet_gray.disabled = true;
                        infected_opacity = 1;
                        infected_borderBottom = "8px orange solid";
                        infected_fontWeight = "bolder";
                        selectAnalysis_maptitle = "Počty nakažených";
                        selectAnalysis_sliderColor = "#ff9800";
                        options = [
                            "Nové případy",
                            "Nové případy za poslední týden",
                            "Nové případy za poslední dva týdny",
                            "Nové případy lidí starších 65 let"
                        ];
                        current_analysis_color = "#ff9800";
                        selectAnalysis_datasetdate = "1.3.2020";
                        break;
                    case 'ockovani-analyze':
                        sheet_green.disabled = false;
                        await sleep(50);
                        sheet_orange.disabled = true;
                        sheet_purple.disabled = true;
                        sheet_gray.disabled = true;
                        vaccination_opacity = 1;
                        vaccination_borderBottom = "8px green solid";
                        vaccination_fontWeight = "bolder";
                        selectAnalysis_maptitle = "Počty naočkovaných";
                        selectAnalysis_sliderColor = "#4caf50";
                        options = [
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
                        current_analysis_color = "#4caf50";
                        selectAnalysis_maptitle = "27.12.2020";
                        break;
                    case 'umrti-analyze':
                        sheet_gray.disabled = false;
                        await sleep(50);
                        sheet_orange.disabled = true;
                        sheet_green.disabled = true;
                        sheet_purple.disabled = true;
                        deaths_opacity = 1;
                        deaths_borderBottom = "8px gray solid";
                        deaths_fontWeight = "bolder";
                        selectAnalysis_sliderColor = "#9e9e9e";
                        map_title.innerHTML = "Počty úmrtí";
                        var options = [
                            "Počet nově zemřelých daný den",
                            "Aktuální celkový počet zemřelých doposud"
                        ];
                        current_analysis_color = "#9e9e9e";
                        selectAnalysis_maptitle = "22.3.2020";
                        break;
                    case 'testovani-analyze':
                        sheet_purple.disabled = false;
                        await sleep(50);
                        sheet_orange.disabled = true;
                        sheet_green.disabled = true;
                        sheet_gray.disabled = true;
                        testing_opacity = 1;
                        testing_borderBottom = "8px purple solid";
                        testing_fontWeight = "bolder";
                        selectAnalysis_sliderColor = "#673ab7";
                        selectAnalysis_maptitle = "Počty otestovaných (PCR)";
                        var options = [
                            "Počet nově otestovaných daný den",
                            "Aktuální celkový počet otestovaných doposud"
                        ];
                        current_analysis_color = "#673ab7";
                        selectAnalysis_datasetdate = "1.8.2020";
                        break;
                }

                // new code
                document.getElementById("nakazeni-analyze").style.opacity = infected_opacity;
                document.getElementById("nakazeni-analyze").style.borderBottom = infected_borderBottom;
                document.getElementById("nakazeni-analyze").style.fontWeight = infected_fontWeight;
                document.getElementById("ockovani-analyze").style.opacity = vaccination_opacity;
                document.getElementById("ockovani-analyze").style.borderBottom = vaccination_borderBottom;
                document.getElementById("ockovani-analyze").style.fontWeight = vaccination_fontWeight;
                document.getElementById("umrti-analyze").style.opacity = deaths_opacity;
                document.getElementById("umrti-analyze").style.borderBottom = deaths_borderBottom;
                document.getElementById("umrti-analyze").style.fontWeight = deaths_fontWeight;
                document.getElementById("testovani-analyze").style.opacity = testing_opacity;
                document.getElementById("testovani-analyze").style.borderBottom = testing_borderBottom;
                document.getElementById("testovani-analyze").style.fontWeight = testing_fontWeight;
                document.getElementsByClassName("noUi-connect")[0].style.background = selectAnalysis_sliderColor;
                document.getElementById("analysis-text-datefrom").innerHTML = selectAnalysis_datasetdate
                map_title.innerHTML = selectAnalysis_maptitle;

                options.forEach((element) => {
                    var opt = document.createElement('option');
                    opt.value = opt.innerHTML = element;
                    select_2.appendChild(opt);
                }
                );

                if (analysis_selected)
                    selectSliderData(select_2.value);
            }

        })
    }
    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
    }

    // updatePage();
}

// Initializer for time frame slider
function loadTimeFrameSlider() {
    try {
        var today = new Date();
        var week_ago = new Date();
        week_ago.setDate(week_ago.getDate() - 7);
        var covid_start = new Date("03/01/2020");
        var difference = week_ago.getTime() - covid_start.getTime();
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

        // Disallow user to get yesterday values if they have not been yet released
        var slider_maximum_day;
        if (today.getHours() >= 10) {
            slider_maximum_day = valuesForSlider.length - 8;
        }
        else {
            slider_maximum_day = valuesForSlider.length - 9;
        }

        noUiSlider.create(valuesSlider, {
            start: [1, 100],
            limit: 200,
            behaviour: 'drag',
            // A linear range from 0 to 15 (16 values)
            range: { min: 0, max: slider_maximum_day },
            connect: [false, true, false],
            // steps of 1
            step: 1,
            format: format
        });
        valuesSlider.noUiSlider.set(['1', '100']);
        valuesSlider.noUiSlider.on('update', function (values, handle) {
            analysis_changed = true;
            // document.getElementById("unsaved_changes").style.display = "";

            var selected_date = new Date();
            switch (slider_current_type) {
                case "Den":
                    selected_date.setDate(selected_date.getDate() - (slider_values.length - values[handle]));
                    slider_text_value.innerHTML = "<i>" + (values[1] - values[0]) + " dní</i>";
                    document.getElementById("mb_usage").innerHTML = "Při potvrzení dojde ke stažení cca " + Math.round(0.1067 * (values[1] - values[0])) + " MB dat";
                    break;
                case "Týden":
                    selected_date = new Date(covid_start_weeks[values[handle] - 1]);
                    // selected_date.setDate(selected_date.getDate() - (slider_values.length - (values[handle] * 7)));
                    slider_text_value.innerHTML = "<i>" + (values[1] - values[0]) + " týdnů</i>";
                    document.getElementById("mb_usage").innerHTML = "Při potvrzení dojde ke stažení cca " + Math.round(0.747 * (values[1] - values[0])) + " MB dat";
                    break;
                case "Měsíc":
                    selected_date = new Date(covid_start_months[values[handle] - 1]);
                    // selected_date.setDate(selected_date.getDate() - (slider_values.length - (values[handle] * 30)));
                    slider_text_value.innerHTML = "<i>" + (values[1] - values[0]) + " měsíců</i>";
                    document.getElementById("mb_usage").innerHTML = "Při potvrzení dojde ke stažení cca " + Math.round(3.2 * (values[1] - values[0])) + " MB dat";
                    break;
                case "Rok":
                    break;
            }
            var selected_date_text = getFormattedDateLocal(selected_date);
            snapValues[handle].innerHTML = "<b>" + selected_date_text + "</b>";
            slider_current_values[handle] = values[handle];
            stopAnimation();
        });
        document.getElementsByClassName("noUi-target")[0].style.background = "#ffffff";
        document.getElementsByClassName("noUi-connect")[0].style.background = "#7a9fb1";
        // document.getElementById("unsaved_changes").style.display = "none";
    }
    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
    }

}

// Handle selection of PiP display type
function selectSliderPIPType(value) {
    try {
        document.getElementById("pip_type").innerHTML = value;

        var select_4 = document.getElementById("sel4");
        select_4.innerHTML = "";

        switch (value) {
            case 'Infekce':
                current_pip_analysis = 'nakazeni-analyze';
                map_show_data_PIP = 'Nové případy';

                var options = [
                    "Nové případy",
                    "Nové případy za poslední týden",
                    "Nové případy za poslední dva týdny",
                    "Nové případy lidí starších 65 let"
                ];

                options.forEach((element) => {
                    var opt = document.createElement('option');
                    opt.value = opt.innerHTML = element;
                    select_4.appendChild(opt);
                }
                );
                break;
            case 'Očkování':
                current_pip_analysis = 'ockovani-analyze';
                map_show_data_PIP = 'Všechny dávky tento den';

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
                    select_4.appendChild(opt);
                }
                );
                break;
            case 'Úmrtí':
                current_pip_analysis = 'umrti-analyze';
                map_show_data_PIP = 'Aktuální celkový počet zemřelých doposud';

                var options = [
                    "Aktuální celkový počet zemřelých doposud",
                    "Počet nově zemřelých daný den"
                ];

                options.forEach((element) => {
                    var opt = document.createElement('option');
                    opt.value = opt.innerHTML = element;
                    select_4.appendChild(opt);
                }
                );

                break;
            case 'PCR testování':
                current_pip_analysis = 'testovani-analyze';
                map_show_data_PIP = 'Aktuální celkový počet otestovaných doposud';

                var options = [
                    "Aktuální celkový počet otestovaných doposud",
                    "Počet nově otestovaných daný den"
                ];

                options.forEach((element) => {
                    var opt = document.createElement('option');
                    opt.value = opt.innerHTML = element;
                    select_4.appendChild(opt);
                }
                );
                break;
        }

        document.getElementById("pip_data").innerHTML = document.getElementById("sel4").value;
        updatePage();
    }
    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
    }

}

// Handle time component selection in time window settings
function selectSliderType(value) {
    try {
        analysis_selected = true;
        // analysis_changed = true;
        var valuesSlider = document.getElementById('values-slider');
        slider_current_type = value;

        var today = new Date();

        switch (current_analysis) {
            case 'nakazeni-analyze':
                var diff = today.getTime() - covid_start.getTime();
                break;
            case 'ockovani-analyze':
                var diff = today.getTime() - covid_start.getTime();
                break;
            case 'umrti-analyze':
                var diff = today.getTime() - covid_start.getTime();
                break;
            case 'testovani-analyze':
                var diff = today.getTime() - covid_start.getTime();
                break;
        }
        var days_since = diff / (1000 * 3600 * 24);

        // Disallow user to get yesterday values if they have not been yet released
        var slider_maximum;
        if (today.getHours() >= 10) {
            slider_maximum = 2;
        }
        else {
            slider_maximum = 3;
        }

        switch (value) {
            case "Den":
                valuesSlider.noUiSlider.updateOptions({
                    range:
                    {
                        min: days_since_covid - days_since,
                        max: days_since_covid - slider_maximum
                    }
                });
                main_slider_range_max = days_since_covid - slider_maximum;
                break;
            case "Týden":
                valuesSlider.noUiSlider.updateOptions({
                    range:
                    {
                        min: 0,
                        max: covid_start_weeks.length - 1
                    }
                });
                main_slider_range_max = covid_start_weeks.length - 1;
                break;
            case "Měsíc":
                valuesSlider.noUiSlider.updateOptions({
                    range:
                    {
                        min: 0,
                        max: covid_start_months.length - 1
                    }
                });
                main_slider_range_max = covid_start_months.length - 1;
                break;
        }

    }
    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
    }
    // valuesSlider
}

// Handle selection of PiP display data
function selectSliderPIPData(value) {
    document.getElementById("pip_data").innerHTML = value;
    map_show_data_PIP = value;
    updatePage();
}

// Handle selection of displayed data
function selectSliderData(value) {
    map_show_data = value;
    // initChart();
    switch (value) {
        case "Současně nakažení":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Současný počet případů";
            break;
        case "Nové případy":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově zjištěných případů";
            break;
        case "Nové případy za poslední týden":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově zjištěných případů za posledních 7 dní";
            break;
        case "Nové případy za poslední dva týdny":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově zjištěných případů za posledních 14 dní";
            break;
        case "Nové případy lidí starších 65 let":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově zjištěných případů lidí starších 65 let";
            break;

        case "Všechny dávky tento den":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných dávek očkování daný den";
            break;
        case "Všechny dávky doposud":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných dávek očkování doposud";
            break;

        case "První dávka tento den":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet vydaných prvních dávek očkování daný den";
            break;
        case "První dávka doposud":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných prvních dávek očkování doposud";
            break;

        case "Druhá dávka tento den":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet vydaných druhých dávek očkování daný den";
            break;
        case "Druhá dávka doposud":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných druhých dávek očkování doposud";
            break;

        case "Třetí dávka tento den":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet vydaných třetích dávek očkování daný den";
            break;
        case "Třetí dávka doposud":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných třetích dávek očkování doposud";
            break;

        case "Čtvrtá dávka tento den":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet vydaných čtvrtých dávek očkování daný den";
            break;
        case "Čtvrtá dávka doposud":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných čtvrtých dávek očkování doposud";
            break;

        case "Aktuální celkový počet zemřelých doposud":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet zemřelých doposud";
            break;
        case "Počet nově zemřelých daný den":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově zemřelých k danému dni";
            break;

        case "Aktuální celkový počet otestovaných doposud":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet otestovaných doposud";
            break;
        case "Počet nově otestovaných daný den":
            map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově otestovaných k danému dni";
            break;
    }
    updatePage();
    initChart();
}

// Handle confirmation of time window settings - downloading data
function confirmRangeAnalysis() {
    try {
        if (!analysis_selected) {
            newToast("Vyberte prosím data k vizualizaci");
            return;
        }

        var slider_current_max = main_slider_range_max;
        var slider_values_difference = slider_current_values[1] - slider_current_values[0];
        if ((slider_values_difference / slider_current_max) > 0.7) {
            if (!confirm('Zvolili jste rozsáhlé časové okno, načtení může trvat delší dobu (závisí na vašem internetovém připojení). Chcete pokračovat?')) {
                return;
            }
        }

        // document.getElementById("unsaved_changes").style.display = "none";

        analysis_changed = false;
        if (map_enabled == false) {
            iframe.style.pointerEvents = "auto";
            map_enabled = true;
        }
        var value_min = new Date();
        var value_max = new Date();
        var date1 = new Date();
        var date2 = new Date();

        switch (slider_current_type) {
            case "Den":
                value_min.setDate(value_min.getDate() - (slider_values.length - slider_current_values[0]));
                value_max.setDate(value_max.getDate() - (slider_values.length - slider_current_values[1]));
                break;
            case "Týden":
                value_min = new Date(covid_start_weeks[slider_current_values[0] - 1]);
                value_max = new Date(covid_start_weeks[slider_current_values[1] - 1]);
                date1 = new Date(covid_start_weeks[slider_current_values[0] - 1]);
                date2 = new Date(covid_start_weeks[slider_current_values[1] - 1]);
                break;
            case "Měsíc":
                value_min = new Date(covid_start_months[slider_current_values[0] - 1]);
                value_max = new Date(covid_start_months[slider_current_values[1] - 1]);
                date1 = new Date(covid_start_months[slider_current_values[0] - 1]);
                date2 = new Date(covid_start_months[slider_current_values[1] - 1]);
                //value_max.setDate(value_max.getDate() - (slider_values.length - (slider_current_values[1] * 30)));
                break;
        }

        current_time_window_low = value_min;
        current_time_window_high = value_max;

        // var url = "https://p01--bp-covid-northflank--k4spvy25x5nv.code.run/covid/api/range/days/from=" + getFormattedDate(value_min) + "&to=" + getFormattedDate(value_max);
        var url = "http://127.0.0.1:8000/covid/api/range/days/from=" + getFormattedDate(value_min) + "&to=" + getFormattedDate(value_max);

        // To calculate the time difference of two dates
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


        newToast("Stahuji nová data...");
        $.ajax({
            url: url,
            headers: { 'accept': 'application/json' },
            type: "GET",
            success: function (result) {
                slider.setAttribute("min", 0);
                slider.value = "0";

                switch (slider_current_type) {
                    case "Den":
                        slider.setAttribute("max", slider_current_values[1] - slider_current_values[0]);
                        break;
                    case "Týden":
                        slider.setAttribute("max", Difference_In_Days);
                        break;
                    case "Měsíc":
                        slider.setAttribute("max", Difference_In_Days);
                        break;
                }
                new_data = result;
                updatePage();
                newToast("Byla aktualizována data.");
                initChart();

                // Open animation tab
                slider.MaterialSlider.change(0);
                showHideAnimationWindow();
            },
            statusCode: {
                400: function () {
                    newErrorToast('Špatný API požadavek');
                },
                429: function () {
                    newToast('Vyčkejte před dalším požadavkem');
                },
                500: function () {
                    newToast('Chyba na straně serveru');
                }
            },
            error: function (error) {
                console.log(error);
                newToast('Prosím vyčkejte před dalším požadavkem')
            }
        })

        analysis_first_picked = true;
    }
    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
    }
}

// Toast handler
function toast(message) {
    // Get the snackbar DIV
    var x = document.getElementById("snackbar");
    x.innerHTML = message;

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 4000);
}

// Handle secondary slider movement
function sliderDateChange(value) {
    if (analysis_changed) {
        newToast("Prosím potvrďte nové změny");
        // document.getElementById("unsaved_changes").style.display = "";
        return;
    }
    var curr = parseInt(slider.value);
    slider.MaterialSlider.change(curr + value);
    // slider.value = curr + value;
    updatePage();
}

// Button handler for showing covid waves
function checkboxCovidWaveClick(el) {
    if (el.checked == false) {
        document.getElementsByClassName("noUi-target")[0].style.background = "#ffffff";
    }
    else {
        document.getElementsByClassName("noUi-target")[0].style.background = "linear-gradient(90deg, rgba(255,255,255,1) 0%, rgb(255, 152, 0) 21%, rgb(255, 245, 230) 30%, rgb(255, 245, 230) 49%, rgb(255, 152, 0) 68%, rgb(255, 245, 230) 90%)";
    }
}

// Button handler for switching recalculation (100k)
function changeRecalculation() {
    this.data_recalculation = !this.data_recalculation;
    updatePage();
    initChart();
}

// Button handler for switching recalculation (max for window)
function changeRecalculationMaxValue() {
    this.data_max_recalculation = !this.data_max_recalculation;
    updatePage();
    initChart();
}

// Handler for showing and hiding PiP window
function showHideRightUpperPanel() {
    var x = document.getElementById("right_upper_panel");
    var x2 = document.getElementById("pip_settings");
    var x3 = document.getElementById("div_right_upper_part");
    // var x2 = document.getElementById("button_right_upper_panel");
    if (x.style.display === "none") {
        x.style.display = "block";
        x2.style.display = "block";
        x3.style.width = "400px";
        // x2.innerHTML = "<b>Skrýt obraz v obraze</b>";
    } else {
        x.style.display = "none";
        x2.style.display = "none";
        x3.style.width = "200px";
        // x2.innerHTML = "<b>Zobrazit obraz v obraze</b>";
    }
}

// Handler for showing and hiding graph window
function showHideLeftBottomPanel2() {
    var x = document.getElementById("left_bottom_panel_2");
    // document.getElementById("left_bottom_panel_1").style.display = "none";
    // var x2 = document.getElementById("button_left_bottom_panel_2");
    var x3 = document.getElementById("right_bottom_container");
    var x4 = document.getElementById("left_bottom_panel_district_text");
    var x5 = document.getElementById("left_bottom_panel_time_window_text");
    if (x.style.display === "none") {
        x.style.display = "block";
        x4.style.display = "block";
        x5.style.display = "block";
        // x3.style.width = "570px";
        // x2.innerHTML = "<b>Skrýt graf</b>";
    } else {
        x.style.display = "none";
        x4.style.display = "none";
        x5.style.display = "none";
        // x3.style.width = "200px"
        // x2.innerHTML = "<b>Zobrazit graf</b>";
    }
    initChart();
}

// Handler for showing and hiding time window
function showHideTimeWindow() {
    var x = document.getElementById("time_window");
    document.getElementById("view_window").style.display = "none";
    document.getElementById("animation_window").style.display = "none";
    document.getElementById("time_window_button").style.fontWeight = "bold";
    document.getElementById("time_window_cell").style.borderBottom = "4px #6d6d6d solid";
    document.getElementById("view_window_button").style.fontWeight = "normal";
    document.getElementById("view_window_cell").style.borderBottom = "0px #6d6d6d solid";
    document.getElementById("animation_window_button").style.fontWeight = "normal";
    document.getElementById("animation_window_cell").style.borderBottom = "0px #6d6d6d solid";
    if (x.style.display === "none") {
        x.style.display = "block";
    }
}

// Handler for showing and hiding view personalization window
function showHideViewWindow() {
    var x = document.getElementById("view_window");
    var x2 = document.getElementById("animation_window");

    if (x2.style.display == "none") {
        x.classList.remove("w3-animate-right");
        x.classList.remove("w3-animate-left");
        x.classList.add("w3-animate-right");
    }
    else {
        x.classList.remove("w3-animate-right");
        x.classList.remove("w3-animate-left");
        x.classList.add("w3-animate-left");
    }

    document.getElementById("time_window").style.display = "none";
    document.getElementById("animation_window").style.display = "none";
    document.getElementById("time_window_button").style.fontWeight = "normal";
    document.getElementById("time_window_cell").style.borderBottom = "0px #6d6d6d solid";
    document.getElementById("view_window_button").style.fontWeight = "bold";
    document.getElementById("view_window_cell").style.borderBottom = "4px #6d6d6d solid";
    document.getElementById("animation_window_button").style.fontWeight = "normal";
    document.getElementById("animation_window_cell").style.borderBottom = "0px #6d6d6d solid";
    if (x.style.display === "none") {
        x.style.display = "block";
    }
}

// Handler for showing and hiding animation window
function showHideAnimationWindow() {
    var x = document.getElementById("animation_window");
    document.getElementById("time_window").style.display = "none";
    document.getElementById("view_window").style.display = "none";
    document.getElementById("time_window_button").style.fontWeight = "normal";
    document.getElementById("time_window_cell").style.borderBottom = "0px #6d6d6d solid";
    document.getElementById("view_window_button").style.fontWeight = "normal";
    document.getElementById("view_window_cell").style.borderBottom = "0px #6d6d6d solid";
    document.getElementById("animation_window_button").style.fontWeight = "bold";
    document.getElementById("animation_window_cell").style.borderBottom = "4px #6d6d6d solid";
    if (x.style.display === "none") {
        x.style.display = "block";
    }
}

// Handler for showing and hiding PiP window
function showHideBottomLeft() {
    var x = document.getElementById("info_table");
    var x3 = document.getElementById("info_table_separator");
    var x2 = document.getElementById("expand_button_1");
    if (x.style.display === "none") {
        x.style.display = "block";
        x3.style.display = "block";
        x2.innerHTML = "expand_more";
        map_date_2.style.display = "none";
    } else {
        x.style.display = "none";
        x3.style.display = "none";
        x2.innerHTML = "expand_less";
        map_date_2.style.display = "";
    }
}

// Graph initializer and updater
function initChart() {

    try {
        // If no district is selected, dont show graph
        if (okres_clicked == "") {
            return;
        }

        // Display district name
        var district_name_box = document.getElementById("left_bottom_panel_district_text");
        var time_box = document.getElementById("left_bottom_panel_time_window_text");
        district_name_box.innerHTML = "Zvolený okres: " + okres_clicked_name;
        time_box.innerHTML = "Časové okno: " + getFormattedDateLocal(current_time_window_low) + " - " + getFormattedDateLocal(current_time_window_high);

        var xArray = [];
        var yArray = [];
        var data_keys = Object.keys(new_data);
        var data_keys_dates = [];
        data_keys.forEach(element => {
            if (typeof new_data[element] === 'object' && new_data[element] !== null) {
                xArray.push(getFormattedDateLocal(new Date(element)));
                data_keys_dates.push(element);
            }
        });

        data_keys_dates.forEach(element => {
            var d = element;
            var o = okres_clicked;
            var v = analysis_name_value;
            yArray.push(new_data[d][o][v]);
        });

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
        var layout_light = {
            plot_bgcolor: "rgba(255, 255, 255, 1)",
            paper_bgcolor: "rgba(255, 255, 255, 1)",
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
                l: 30,
                r: 30,
                b: 30,
                t: 90,
                pad: 4
            },
        };

        var layout_dark = {
            plot_bgcolor: "rgba(29, 29, 29, 1)",
            paper_bgcolor: "rgba(29, 29, 29, 1)",
            xaxis: {
                visible: false
            },
            yaxis: {
                gridcolor: "rgb(67, 67, 67)"
            },
            title: {
                text: map_show_data,
                font: {
                    size: 20,
                    color: "rgba(255, 255, 255, 1)"
                },
                y: 0.85
            },
            height: 300,
            margin: {
                l: 30,
                r: 30,
                b: 30,
                t: 90,
                pad: 4
            },
        };

        // Display using Plotly
        if (dark_mode)
            Plotly.newPlot("district_chart", data, layout_dark, { displayModeBar: true });
        else
            Plotly.newPlot("district_chart", data, layout_light, { displayModeBar: true });
    }



    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
    }
}

function hideSplashScreen() {
    $('#splashscreen').fadeOut(350);
    setTimeout(
        function () {
            newToast("Velikost uživatelského rozhraní si můžete přizpůsobit v záložce Zobrazení v nastavení aplikace", 6000);
            document.getElementById("splashscreen").style.backgroundColor = "rgba(0, 0, 0, 0.686)";
        }, 500
    );
    // loadDarkModeFromLocalStorage();
    page_initialized = true;
}

function showSplashScreen() {
    $('#splashscreen').fadeIn(350);
}

function showChangelog() {
    $('#changelog').fadeIn(350);
}

function showContactScreen() {
    $('#contactscreen').fadeIn(350);
}

function hideContactScreen() {
    $('#contactscreen').fadeOut(350);
}

// Pregenerate all weeks and months so they are available to choose in time window
function generateWeeksMonths() {
    var odd = true;
    var current = covid_start_week;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    while (true) {
        if (today.getTime() <= current.getTime())
            break;
        var text = getFormattedDate(current);
        covid_start_weeks.push(text);
        current.setDate(current.getDate() + 7);
    }

    current = covid_start_month;
    while (true) {
        if (today.getTime() <= current.getTime())
            break;
        var text = getFormattedDate(current);
        covid_start_months.push(text);

        var month = current.getMonth() + 1;
        var year = current.getFullYear();
        var number_of_days = daysInMonth(month, year);
        current.setDate(current.getDate() + number_of_days);
    }
}

// Calculate days in a given month and year
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// Debugging function
function createError() {
    try {
        var x = document.getElementById("noid");
        x.style.display = "block";
    }
    catch (err) {
        newErrorToast(err.message);
    }
}

// Show new error toast
function newErrorToast(text) {
    'use strict';
    var snackbarContainer = document.querySelector('#error-toast-example');
    var data = { message: "Internal error: " + text, timeout: 5000 };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

// Show new toast
function newToast(text) {
    'use strict';
    var snackbarContainer = document.querySelector('#demo-toast-example');
    snackbarContainer.MaterialSnackbar.queuedNotifications_ = [];
    var data = { message: text, timeout: 2500 };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

// Show new toast
function newToast(text, length) {
    'use strict';
    var snackbarContainer = document.querySelector('#demo-toast-example');
    snackbarContainer.MaterialSnackbar.queuedNotifications_ = [];
    var data = { message: text, timeout: length };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

function setMapOpacity() {
    const collection = iframe.contentWindow.document.getElementsByClassName("leaflet-tile-pane");
    collection[0].style.opacity = 0.6;
}

function decreaseMapOpacity() {
    if (current_map_opacity < 0.1) {
        return;
    }
    current_map_opacity -= 0.1;
    var x = document.getElementById("map_opacity_text");
    x.innerHTML = (current_map_opacity * 100).toFixed(0) + "%";
    var tiles_layer = iframe.contentWindow.document.getElementsByClassName("leaflet-tile-pane")[0];
    tiles_layer.style.opacity = current_map_opacity;
    localStorage.setItem("maptransparency", current_map_opacity);
}

function increaseMapOpacity() {
    if (current_map_opacity > 0.9) {
        return;
    }
    current_map_opacity += 0.1;
    var x = document.getElementById("map_opacity_text");
    x.innerHTML = (current_map_opacity * 100).toFixed(0) + "%";
    var tiles_layer = iframe.contentWindow.document.getElementsByClassName("leaflet-tile-pane")[0];
    tiles_layer.style.opacity = current_map_opacity;
    localStorage.setItem("maptransparency", current_map_opacity);
}

// Create ripple effect on element
// inspired by: https://css-tricks.com/how-to-recreate-the-ripple-effect-of-material-design-buttons/
function createRipple(ripple_type, element_id) {
    var eventX = window.innerWidth - 400;
    var eventY = 30;
    const button = document.getElementById("ripple_effect");

    var element = document.getElementById(element_id);
    var element_dims = element.getBoundingClientRect();

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${element_dims.x + 40 - button.offsetLeft - radius}px`;
    circle.style.top = `${element_dims.y + 23 - button.offsetTop - radius}px`;
    circle.style.zIndex = 1;
    circle.classList.add(ripple_type);

    const ripple = button.getElementsByClassName(ripple_type)[0];

    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

function increaseDistrictOpacity() {
    if (current_district_opacity > 0.9) {
        return;
    }
    current_district_opacity += 0.1;
    var x = document.getElementById("district_opacity_text");
    x.innerHTML = (current_district_opacity * 100).toFixed(0) + "%";
    refreshMap();
}

function decreaseDistrictOpacity() {
    if (current_district_opacity < 0.1) {
        return;
    }
    current_district_opacity -= 0.1;
    var x = document.getElementById("district_opacity_text");
    x.innerHTML = (current_district_opacity * 100).toFixed(0) + "%";
    refreshMap();
}

function increaseDistrictStrokeOpacity() {
    if (current_district_stroke_opacity > 0.9) {
        return;
    }
    current_district_stroke_opacity += 0.1;
    var x = document.getElementById("district_stroke_opacity_text");
    x.innerHTML = (current_district_stroke_opacity * 100).toFixed(0) + "%";
    refreshMap();
}

function decreaseDistrictStrokeOpacity() {
    if (current_district_stroke_opacity < 0.1) {
        return;
    }
    current_district_stroke_opacity -= 0.1;
    var x = document.getElementById("district_stroke_opacity_text");
    x.innerHTML = (current_district_stroke_opacity * 100).toFixed(0) + "%";
    refreshMap();
}

// Helper function that refreshes map after theme switch
function refreshMap() {
    var parent = iframe.contentWindow.document.querySelector("g");
    var children = parent.children;
    for (let i = 0; i < 77; i++) {
        children[i].setAttribute("fill-opacity", current_district_opacity);
        children[i].setAttribute("stroke-width", current_district_stroke_opacity);
    }
}

// Dark/light mode handler
function toggleDarkMap() {
    try {
        dark_mode = !dark_mode;

        if (dark_mode) {

            // PIP
            var parent = iframe_pip.contentWindow.document.querySelector("g");
            var children = parent.children;
            for (let i = 0; i < 77; i++) {
                children[i].setAttribute("fill-opacity", 1);
            }

            // Switches
            var switches = document.getElementsByClassName("mdl-switch__track");

            for (var i = 0; i < switches.length; i++) {
                switches[i].style.backgroundColor = "#444444";
            }

            // Main slider
            var slider = document.getElementsByClassName("noUi-connects")[0];
            // slider.style.backgroundColor = "#444444";

            // Secondary slider
            // var slider = document.getElementsByClassName("mdl-slider__background-lower")[0];
            // slider.style.backgroundColor = "white";

            // var slider_high = document.getElementsByClassName("mdl-slider__background-upper")[0];
            // slider_high.style.backgroundColor = "#444444";

            // Map background
            var map = iframe.contentWindow.document.getElementById("map_a91c08a299bb6023baf393f504c6fb3e");
            var map_pip = iframe_pip.contentWindow.document.getElementById("map_a91c08a299bb6023baf393f504c6fb3ee");

            if (map.style.backgroundColor == "rgb(221, 221, 221)") {
                map.style.backgroundColor = "rgb(0, 0, 0)";
            }
            else if (map.style.backgroundColor == "rgb(0, 0, 0)") {
                map.style.backgroundColor = "rgb(221, 221, 221)";
            }
            else {
                map.style.backgroundColor = "rgb(0, 0, 0)";
            }

            // Top bar
            var topbar = document.getElementById("topbar");
            topbar.classList.remove("w3-white");
            topbar.classList.add("w3-metro-darken");

            // Top bar - first option
            var topbar_first = document.getElementById("nakazeni-analyze");
            topbar_first.style.backgroundColor = "#1d1d1d";
            topbar_first.onmouseover = function () { this.style.backgroundColor = '#efefef'; };
            topbar_first.onmouseout = function () { this.style.backgroundColor = 'white'; };
            topbar_first.onmouseover = function () { this.style.backgroundColor = '#434343'; };
            topbar_first.onmouseout = function () { this.style.backgroundColor = '#1d1d1d'; };

            // Top bar - second option
            var topbar_second = document.getElementById("umrti-analyze");
            topbar_second.style.backgroundColor = "#1d1d1d";
            topbar_second.onmouseover = function () { this.style.backgroundColor = '#efefef'; };
            topbar_second.onmouseout = function () { this.style.backgroundColor = 'white'; };
            topbar_second.onmouseover = function () { this.style.backgroundColor = '#434343'; };
            topbar_second.onmouseout = function () { this.style.backgroundColor = '#1d1d1d'; };

            // Top bar - third option
            var topbar_third = document.getElementById("ockovani-analyze");
            topbar_third.style.backgroundColor = "#1d1d1d";
            topbar_third.onmouseover = function () { this.style.backgroundColor = '#efefef'; };
            topbar_third.onmouseout = function () { this.style.backgroundColor = 'white'; };
            topbar_third.onmouseover = function () { this.style.backgroundColor = '#434343'; };
            topbar_third.onmouseout = function () { this.style.backgroundColor = '#1d1d1d'; };

            // Top bar - fourth option
            var topbar_fourth = document.getElementById("testovani-analyze");
            topbar_fourth.style.backgroundColor = "#1d1d1d";
            topbar_fourth.onmouseover = function () { this.style.backgroundColor = '#efefef'; };
            topbar_fourth.onmouseout = function () { this.style.backgroundColor = 'white'; };
            topbar_fourth.onmouseover = function () { this.style.backgroundColor = '#434343'; };
            topbar_fourth.onmouseout = function () { this.style.backgroundColor = '#1d1d1d'; };

            // Warning message
            var warning_message = document.getElementById("warning_message");
            warning_message.classList.remove("w3-white");
            warning_message.classList.add("w3-metro-darken");

            // Settings window
            var settings_window = document.getElementById("settings_window");
            settings_window.classList.remove("w3-white");
            settings_window.classList.add("w3-metro-darken");

            // Settings window - time window button
            var time_window_button = document.getElementById("time_window_button");
            time_window_button.classList.remove("w3-white");
            time_window_button.classList.add("w3-metro-darken");
            time_window_button.classList.add("w3-hover-dark-grey");

            // Settings window - time window confirm button
            var time_window_confirm_button = document.getElementById("time_window_confirm_button");
            time_window_confirm_button.classList.remove("mdl-button--colored");
            time_window_confirm_button.classList.add("mdl-button--colored");

            // Settings window - view window button
            var view_window_button = document.getElementById("view_window_button");
            view_window_button.classList.remove("w3-white");
            view_window_button.classList.add("w3-metro-darken");
            view_window_button.classList.add("w3-hover-dark-grey");

            // Settings window - animation window button
            var animation_window_button = document.getElementById("animation_window_button");
            animation_window_button.classList.remove("w3-white");
            animation_window_button.classList.add("w3-metro-darken");
            animation_window_button.classList.add("w3-hover-dark-grey");

            // Settings window - animation window start button
            var animation_window_start_button = document.getElementById("animation_window_start_button");
            animation_window_start_button.classList.remove("mdl-button--colored");
            animation_window_start_button.classList.add("mdl-button--colored");

            // Settings window - animation window pause button
            var animation_window_pause_button = document.getElementById("animation_window_pause_button");
            animation_window_pause_button.classList.remove("mdl-button--colored");
            animation_window_pause_button.classList.add("mdl-button--colored");

            // Bottom left window
            var bottom_left_view = document.getElementById("bottom_left_view");
            bottom_left_view.classList.remove("w3-white");
            bottom_left_view.classList.add("w3-metro-darken");

            // Chart window
            var left_bottom_panel_2 = document.getElementById("left_bottom_panel_2");
            left_bottom_panel_2.classList.remove("w3-white");
            left_bottom_panel_2.classList.add("w3-metro-darken");

            // PIP window
            var right_upper_panel = document.getElementById("right_upper_panel");
            right_upper_panel.classList.remove("w3-white");
            right_upper_panel.classList.add("w3-metro-darken");

            // Map PIP background
            if (map_pip.style.backgroundColor == "rgb(255, 255, 255)") {
                map_pip.style.backgroundColor = "rgb(29, 29, 29)";
            }
            else if (map_pip.style.backgroundColor == "rgb(29, 29, 29)") {
                map_pip.style.backgroundColor = "rgb(255, 255, 255)";
            }
            else {
                map_pip.style.backgroundColor = "rgb(29, 29, 29)";
            }

            // if (page_initialized)
            // {
                // Splashscreen content
                var splash = document.getElementById("splashscreen");
                var contactscreen_content = document.getElementById("contactscreen_content");
                var splash_content = document.getElementById("splashscreen_content");
                var splash_content_paragraph = document.getElementById("splashscreen_content_paragraph");
                var splash_button = document.getElementById("button-hide-splash");
                var contact_button = document.getElementById("button-contact-close");
                // setTimeout(function()
                // {
                    splash.style.backgroundColor = "rgba(0, 0, 0, 0.686)";
                    contactscreen_content.style.backgroundColor = "rgba(0, 0, 0, 0.686)";
                    splash_content_paragraph.style.backgroundColor = "rgb(20, 20, 20)";
                    splash_content.classList.add("w3-metro-darken");
                    splash_button.classList.add("w3-dark-gray");
                    splash_button.classList.remove("w3-light-gray");
                // }, 500);
                
                contactscreen_content.classList.add("w3-metro-darken");
                contact_button.classList.add("w3-dark-gray");
                contact_button.classList.remove("w3-light-gray");
            // }

            // Select inputs
            var sel1 = document.getElementById("sel1");
            var sel2 = document.getElementById("sel2");
            var sel3 = document.getElementById("quantity");
            var sel4 = document.getElementById("sel3");
            var sel5 = document.getElementById("sel4");
            sel1.classList.add("bg-dark");
            sel1.classList.add("text-white");
            sel2.classList.add("bg-dark");
            sel2.classList.add("text-white");
            sel3.classList.add("bg-dark");
            sel3.classList.add("text-white");
            sel4.classList.add("bg-dark");
            sel4.classList.add("text-white");
            sel5.classList.add("bg-dark");
            sel5.classList.add("text-white");

            localStorage.setItem("darkmode", "true");
        }
        else {

            // PIP
            var parent = iframe_pip.contentWindow.document.querySelector("g");
            var children = parent.children;
            for (let i = 0; i < 77; i++) {
                children[i].setAttribute("fill-opacity", 0.7);
            }

            // Switches
            var switches = document.getElementsByClassName("mdl-switch__track");

            for (var i = 0; i < switches.length; i++) {
                switches[i].style.backgroundColor = "#bdbdbd";
            }

            // Main slider
            var slider = document.getElementsByClassName("noUi-connects")[0];
            // slider.style.backgroundColor = "white";

            // Secondary slider
            // var slider = document.getElementsByClassName("mdl-slider__background-lower")[0];
            // slider.style.backgroundColor = "#607d8b";

            // var slider_high = document.getElementsByClassName("mdl-slider__background-upper")[0];
            // slider_high.style.backgroundColor = "#bbbbbb";

            // Map background
            var map = iframe.contentWindow.document.getElementById("map_a91c08a299bb6023baf393f504c6fb3e");
            var map_pip = iframe_pip.contentWindow.document.getElementById("map_a91c08a299bb6023baf393f504c6fb3ee");

            if (map.style.backgroundColor == "rgb(221, 221, 221)") {
                map.style.backgroundColor = "rgb(0, 0, 0)";
            }
            else if (map.style.backgroundColor == "rgb(0, 0, 0)") {
                map.style.backgroundColor = "rgb(221, 221, 221)";
            }
            else {
                map.style.backgroundColor = "rgb(0, 0, 0)";
            }

            // Top bar
            var topbar = document.getElementById("topbar");
            topbar.classList.add("w3-white");
            topbar.classList.remove("w3-metro-darken");

            // Top bar - first option
            var topbar_first = document.getElementById("nakazeni-analyze");
            topbar_first.style.backgroundColor = "white";
            topbar_first.onmouseout = function () { this.style.backgroundColor = 'white'; };
            topbar_first.onmouseover = function () { this.style.backgroundColor = '#efefef'; };

            // Top bar - second option
            var topbar_second = document.getElementById("umrti-analyze");
            topbar_second.style.backgroundColor = "white";
            topbar_second.onmouseout = function () { this.style.backgroundColor = 'white'; };
            topbar_second.onmouseover = function () { this.style.backgroundColor = '#efefef'; };

            // Top bar - third option
            var topbar_third = document.getElementById("ockovani-analyze");
            topbar_third.style.backgroundColor = "white";
            topbar_third.onmouseout = function () { this.style.backgroundColor = 'white'; };
            topbar_third.onmouseover = function () { this.style.backgroundColor = '#efefef'; };

            // Top bar - fourth option
            var topbar_fourth = document.getElementById("testovani-analyze");
            topbar_fourth.style.backgroundColor = "white";
            topbar_fourth.onmouseout = function () { this.style.backgroundColor = 'white'; };
            topbar_fourth.onmouseover = function () { this.style.backgroundColor = '#efefef'; };

            // Warning message
            var warning_message = document.getElementById("warning_message");
            warning_message.classList.add("w3-white");
            warning_message.classList.remove("w3-metro-darken");

            // Settings window
            var settings_window = document.getElementById("settings_window");
            settings_window.classList.add("w3-white");
            settings_window.classList.remove("w3-metro-darken");

            // Settings window - time window button
            var time_window_button = document.getElementById("time_window_button");
            time_window_button.classList.add("w3-white");
            time_window_button.classList.remove("w3-metro-darken");
            time_window_button.classList.remove("w3-hover-dark-grey");

            // Settings window - time window confirm button
            var time_window_confirm_button = document.getElementById("time_window_confirm_button");
            time_window_confirm_button.classList.remove("mdl-button--colored");
            // time_window_confirm_button.classList.add("mdl-button--colored");

            // Settings window - view window button
            var view_window_button = document.getElementById("view_window_button");
            view_window_button.classList.add("w3-white");
            view_window_button.classList.remove("w3-metro-darken");
            view_window_button.classList.remove("w3-hover-dark-grey");

            // Settings window - animation window button
            var animation_window_button = document.getElementById("animation_window_button");
            animation_window_button.classList.add("w3-white");
            animation_window_button.classList.remove("w3-metro-darken");
            animation_window_button.classList.remove("w3-hover-dark-grey");

            // Settings window - animation window start button
            var animation_window_start_button = document.getElementById("animation_window_start_button");
            animation_window_start_button.classList.remove("mdl-button--colored");
            // animation_window_start_button.classList.add("mdl-button--colored");

            // Settings window - animation window pause button
            var animation_window_pause_button = document.getElementById("animation_window_pause_button");
            animation_window_pause_button.classList.remove("mdl-button--colored");
            // animation_window_pause_button.classList.add("mdl-button--colored");

            // Bottom left window
            var bottom_left_view = document.getElementById("bottom_left_view");
            bottom_left_view.classList.add("w3-white");
            bottom_left_view.classList.remove("w3-metro-darken");

            // Chart window
            var left_bottom_panel_2 = document.getElementById("left_bottom_panel_2");
            left_bottom_panel_2.classList.add("w3-white");
            left_bottom_panel_2.classList.remove("w3-metro-darken");

            // PIP window
            var right_upper_panel = document.getElementById("right_upper_panel");
            right_upper_panel.classList.add("w3-white");
            right_upper_panel.classList.remove("w3-metro-darken");

            // Map PIP background
            if (map_pip.style.backgroundColor == "rgb(255, 255, 255)") {
                map_pip.style.backgroundColor = "rgb(29, 29, 29)";
            }
            else if (map_pip.style.backgroundColor == "rgb(29, 29, 29)") {
                map_pip.style.backgroundColor = "rgb(255, 255, 255)";
            }
            else {
                map_pip.style.backgroundColor = "rgb(29, 29, 29)";
            }

            // if (page_initialized)
            // {
                // Splashscreen content
                var splash = document.getElementById("splashscreen");
                var contactscreen = document.getElementById("contactscreen");
                var contactscreen_content = document.getElementById("contactscreen_content");
                var splash_content = document.getElementById("splashscreen_content");
                var splash_content_paragraph = document.getElementById("splashscreen_content_paragraph");
                var splash_button = document.getElementById("button-hide-splash");
                var contact_button = document.getElementById("button-contact-close");
                splash.style.backgroundColor = "rgba(0, 0, 0, 0.686)";
                contactscreen.style.backgroundColor = "rgba(0, 0, 0, 0.686)";
                contactscreen_content.style.backgroundColor = "rgba(255, 255, 255, 1)";
                splash_content_paragraph.style.backgroundColor = "rgb(245, 245, 245)";
                splash_content.classList.remove("w3-metro-darken");
                contactscreen_content.classList.remove("w3-metro-darken");
                splash_button.classList.remove("w3-dark-gray");
                splash_button.classList.add("w3-light-gray");
                contact_button.classList.remove("w3-dark-gray");
                contact_button.classList.add("w3-light-gray");
            // }

            // Select inputs
            var sel1 = document.getElementById("sel1");
            var sel2 = document.getElementById("sel2");
            var sel3 = document.getElementById("quantity");
            var sel4 = document.getElementById("sel3");
            var sel5 = document.getElementById("sel4");
            sel1.classList.remove("bg-dark");
            sel1.classList.remove("text-white");
            sel2.classList.remove("bg-dark");
            sel2.classList.remove("text-white");
            sel3.classList.remove("bg-dark");
            sel3.classList.remove("text-white");
            sel4.classList.remove("bg-dark");
            sel4.classList.remove("text-white");
            sel5.classList.remove("bg-dark");
            sel5.classList.remove("text-white");

            localStorage.setItem("darkmode", "false");
        }

        // Init chart
        initChart();
    }
    catch (err) {
        console.log(err);
        // try {
        //     newErrorToast(err.message);
        // }
        // catch (err) {
        //     console.log(err);
        // }
    }
}

// ???
function showEasterEgg() {

}

// Dropdown menu handler
function initDropdownMenu() {
    try {
        var menu = document.getElementsByClassName("mdl-menu__container")[0];
        var menu_content = document.getElementsByClassName("mdl-menu__outline")[0];
        menu.style.marginRight = "15px";
        menu.style.marginTop = "30px";
        menu.style.width = "300px";

        if (dark_mode) {
            menu_content.style.backgroundColor = "#1d1d1d";

            var items = document.getElementsByClassName("mdl-menu__item");

            for (var i = 0; i < items.length; i++) {
                items[i].classList.add("w3-metro-darken");
            }
        }
        else {
            menu_content.style.backgroundColor = "#ffffff";

            var items = document.getElementsByClassName("mdl-menu__item");

            for (var i = 0; i < items.length; i++) {
                items[i].classList.remove("w3-metro-darken");
            }
        }
    }

    catch (err) {
        try {
            newErrorToast(err.message);
        }
        catch (err) {
            alert(err.message);
        }
    }

}

function decreaseUIScale() {
    if (current_ui_scale <= 50) {
        return;
    }
    if (current_ui_scale == 100)
    {
        // iframe_pip.document.getElementById("map_a91c08a299bb6023baf393f504c6fb3ee")
        iframe_pip.contentWindow.map_a91c08a299bb6023baf393f504c6fb3ee.setZoom(5);
    }
    current_ui_scale -= 10;
    document.body.style.zoom = current_ui_scale + "%";
    var x = document.getElementById("scale_ui_text");
    var y = document.getElementById("right_bottom_container");
    x.innerHTML = current_ui_scale + "%";
    y.style.zoom = 100 / current_ui_scale;
    localStorage.setItem("uiscale", current_ui_scale);
}

function increaseUIScale() {
    if (current_ui_scale >= 150) {
        return;
    }
    if (current_ui_scale == 90)
    {
        iframe_pip.contentWindow.map_a91c08a299bb6023baf393f504c6fb3ee.setZoom(6);
    }
    current_ui_scale += 10;
    document.body.style.zoom = current_ui_scale + "%";
    var x = document.getElementById("scale_ui_text");
    var y = document.getElementById("right_bottom_container");
    x.innerHTML = current_ui_scale + "%";
    y.style.zoom = 100 / current_ui_scale;
    localStorage.setItem("uiscale", current_ui_scale);
}

function loadDarkModeFromLocalStorage()
{
    try
    {
        var storage_darkmode = localStorage.getItem("darkmode");
        if (storage_darkmode)
        {
            if (storage_darkmode == "true" && page_initialized == false)
            {
                document.getElementById("checkerDarkMode2").click();
            }
        }
        else
        {
            localStorage.setItem("darkmode", "false");
        }
    }
    catch (err)
    {
        console.log(err);
    }

}

function loadUIScaleFromLocalStorage()
{
    try
    {
        var storage_uiscale = localStorage.getItem("uiscale");
        if (storage_uiscale)
        {
            if (page_initialized == false)
            {
                current_ui_scale = parseInt(storage_uiscale);
                if (current_ui_scale > 100)
                {
                    iframe_pip.contentWindow.map_a91c08a299bb6023baf393f504c6fb3ee.setZoom(5);
                }
                document.body.style.zoom = current_ui_scale + "%";
                var x = document.getElementById("scale_ui_text");
                var y = document.getElementById("right_bottom_container");
                y.style.zoom = 100 / current_ui_scale;
                x.innerHTML = current_ui_scale + "%";
            }
        }
        else
        {
            localStorage.setItem("uiscale", 100);
        }
    }
    catch (err)
    {
        console.log(err);
    }
}