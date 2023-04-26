var topbar_ripple, element_scale_rectangle, element_scale_min, element_scale_max, element_map_opacity_text, element_district_opacity_text, element_district_stroke_text, element_slider, element_slider_text, summary_nakazeni, summary_vyleceni, summary_umrti, summary_obyvatel, okres_nazev, okres_kod, okres_nakazeni, okres_nakazeni_sto_tisic, okres_celkem_nakazeni, okres_celkem_vyleceni, okres_datum, nakazenych, element_map_info_1, element_map_info_2, element_map_info_3, map_date, element_map_title, slider_current_selected_date, element_time_window_slider_text, slider_values, days_since_covid, text_current_data_sto_tisic, text_current_data, element_iframe, element_iframe_pip, element_dataset_data_option, snackbar, analysis_name_value, analysis_name_min_value, analysis_name_max_value, current_analysis_color, element_css_orange, element_css_green, element_css_purple, element_css_gray, sheet_default, element_nouislider, current_time_window_low, current_time_window_high, element_window_warning;

// Constants
const okresy_names = JSON.parse(okresy_nazvy);
const okresy_pocet_obyvatel = JSON.parse(pocet_obyvatel);
const analyze_fields = ["nakazeni-analyze", "ockovani-analyze", "umrti-analyze", "testovani-analyze"];
const covid_start = new Date("03/01/2020");
const covid_start_string = "03/01/2020";
const vaccination_start = new Date("12/27/2020");
const vaccination_start_string = "12/27/2020";
const deaths_start = new Date("03/22/2020");
const deaths_start_string = "03/22/2020";
const testing_start = new Date("08/01/2020");
const testing_start_string = "08/01/2020";
const covid_start_week = new Date("03/02/2020");
const covid_start_week_string = "03/02/2020";
const covid_start_month = new Date("03/01/2020");
const covid_start_month_string = "03/01/2020";

// Other variables
var covid_data = {};
var analysis_selected = false;
var analysis_changed = true;
var analysis_first_picked = false;
var slider_current_values = [0, 0];
var ongoing_animation = true;
var map_enabled = false;
var covid_start_weeks = [];
var covid_start_months = [];
var page_initialized = false;
var showed_ui_resize_message = false;
var main_slider_range_max = (new Date().getTime() - covid_start.getTime()) / (1000 * 3600 * 24);
var page_initialized = false;

// Map settings
var current_district_clicked = "";
var current_district_clicked_name = "";
var current_district_clicked_object = -1;
var current_analysis = "nakazeni-analyze";
var current_pip_analysis = "nakazeni-analyze";
var current_dataset_data = "Nové případy";
var current_dataset_data_PIP = "Nové případy";
var current_map_opacity = 0.6;
var current_district_opacity = 0.7;
var current_district_stroke_opacity = 0.7;
var current_ui_scale = 100;
var current_animation_speed = 5;
var current_dark_mode = false;
var current_time_window_fragment = "Den";
var current_max_recalculation = false;
var current_100k_recalculation = true;

// Initialize and modify webpage on startup
function onIframeLoad() {
    loadUIScaleFromLocalStorage();
    loadPageComponents();
    loadTimeFrameSlider();
    initPage();
    initPIP();
}

// Initialize and modify PIP on startup
function onIframePIPLoad() {
    
}

// DOM elements setter
function loadPageComponents() {
    element_map_info_1 = document.getElementById("map_info_1");
    element_map_info_2 = document.getElementById("map_info_2");
    element_map_info_3 = document.getElementById("map_info_3");
    element_map_date_1 = document.getElementById("map_date_1");
    element_map_date_2 = document.getElementById("map_date_2");
    element_map_title = document.getElementById("map_title");
    element_slider = document.getElementById("slider");
    element_slider_text = document.getElementById("slider_text");
    element_time_window_slider_text = document.getElementById("slider-value");
    element_iframe = document.getElementById("iframe");
    element_iframe_pip = document.getElementById("iframe_pip");
    element_dataset_data_option = document.getElementById("sel2");
    element_window_warning = document.getElementById("div_middle_top_part");
    element_css_orange = document.getElementById("material_css_orange");
    element_css_green = document.getElementById("material_css_green");
    element_css_purple = document.getElementById("material_css_purple");
    element_css_gray = document.getElementById("material_css_gray");
    element_nouislider = document.getElementById('values-slider');
    topbar_ripple = document.getElementById('ripple_effect');
    element_map_opacity_text = document.getElementById('map_opacity_text');
    element_district_opacity_text = document.getElementById('district_opacity_text');
    element_district_stroke_text = document.getElementById('district_stroke_opacity_text');
    element_scale_rectangle = document.getElementById('scale_rectangle');
    element_scale_min = document.getElementById('scale_min');
    element_scale_max = document.getElementById('scale_max');

}

// Handle window resizing
function onResize() {
    if (window.innerWidth <= 1150) {
        element_map_title.style.display = "none";
        if (!showed_ui_resize_message && page_initialized)
        {
            showed_ui_resize_message = true;
            newToast("Na malých obrazovkách je doporučeno zmenšit škálování uživatelského prostředí", 4000);
        }
    }
    else {
        element_map_title.style.display = "";
    }
}

// Initialize webpage on startup
function initPage() {
    try {
        // Startup settings
        onResize();
        window.addEventListener('resize', onResize);
        generateWeeksMonths();
        element_slider.oninput = updatePage;

        // Hide layer selection
        var toggle = element_iframe.contentWindow.document.getElementsByClassName("leaflet-control-layers-toggle");
        while (toggle.length > 0) {
            toggle[0].parentNode.removeChild(toggle[0]);
        }

        // Remove additional layer
        var layer = element_iframe.contentWindow.document.querySelector("g");
        for (let i = 0; i < 77; i++) {
            var child = layer.firstElementChild;
            layer.removeChild(child);
        }

        // Customize districts on map
        var layer_district = layer.children;
        for (let i = 0; i < 77; i++) {
            layer_district[i].setAttribute("fill-opacity", 0.7);
            layer_district[i].setAttribute("fill", "#ffffff");
            layer_district[i].setAttribute("stroke-width", 0.7);
            layer_district[i].setAttribute("name", okresy_names[i][1]);
            layer_district[i].setAttribute("okres_lau", okresy_names[i][0]);
            layer_district[i].addEventListener('click', function () 
                {
                    onClickMap(this.getAttribute('name'), this.getAttribute('okres_lau'), this);
                    current_district_clicked_object = i;
                }
            );
        }

        // Other settings
        setInitialMapOpacity();
        document.getElementById("button-hide-splash").disabled = false;
        document.getElementById("button-hide-splash").innerHTML = "Přejít k aplikaci";
        element_iframe.contentWindow.document.getElementsByClassName("leaflet-popup-pane")[0].hidden = "true";
        setTimeout(
            function(){
                $('#splashscreen_before').fadeOut(500);
                loadDarkModeFromLocalStorage();
                page_initialized = true;
            }, 500
        );
    }
    catch (err_inner) {
        console.log(err_inner);
        try {
            newErrorToast(err_inner.message);
        }
        catch (err) {
            console.log(err_inner);
        }
    }
}

// Initialize PIP on startup
function initPIP() {
    try {
        // Remove layer selection
        var toggle = element_iframe_pip.contentWindow.document.getElementsByClassName("leaflet-control-layers-toggle");
        while (toggle.length > 0) {
            toggle[0].parentNode.removeChild(toggle[0]);
        }

        // Remove additional layer
        var layer = element_iframe_pip.contentWindow.document.querySelector("g");
        for (let i = 0; i < 77; i++) {
            var child = layer.firstElementChild;
            layer.removeChild(child);
        }

        // Customize districts
        var layer_district = layer.children;
        for (let i = 0; i < 77; i++) {
            layer_district[i].setAttribute("fill-opacity", 0.7);
            layer_district[i].setAttribute("fill", "#ffffff");
            layer_district[i].setAttribute("stroke-width", 0.7);
            layer_district[i].setAttribute("name", okresy_names[i][1]);
            layer_district[i].setAttribute("okres_lau", okresy_names[i][0]);
            layer_district[i].addEventListener('click', function () 
                {
                    onClickMap(this.getAttribute('name'), this.getAttribute('okres_lau'), this);
                    current_district_clicked_object = i;
                }
            );
        }
    }
    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
        }
    }
}

// Click function - create popup window
async function onClickMap(name, okres_lau, object) {
    try {

        // If no analysis hasnt been selected, dont do anything
        if (map_enabled == false) {
            return;
        }

        // Save district info
        current_district_clicked = okres_lau;
        current_district_clicked_name = name;

        // Graph
        initChart();

        // Remove additional stroke-width from previous district
        if (current_district_clicked_object != -1) {
            element_iframe.contentWindow.document.querySelector("g").children[current_district_clicked_object].setAttribute("stroke-width", current_district_stroke_opacity);
        }

        // Set selected district stroke-width
        object.setAttribute("stroke-width", 4.5);

        // Get needed variables
        selected_date_text = getFormattedDate(slider_current_selected_date);

        // Get popup
        var popups = [];
        while (popups.length == 0) {
            await sleep(10);
            popups = element_iframe.contentWindow.document.getElementsByClassName("leaflet-popup-content");
        }

        // Edit popup properties
        var popup_element_content = popups[0].children[0];
        var popup_wrapper = element_iframe.contentWindow.document.getElementsByClassName("leaflet-popup-content-wrapper")[0];
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
        if (current_dark_mode) {
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

        popup_row_2_cell_0.appendChild(icon_1);
        popup_row_2_cell_1.innerHTML = "<b>Počet</b>";
        popup_row_3_cell_0.appendChild(icon_2);
        popup_row_3_cell_1.innerHTML = "<b>Počet / 100 tisíc</b>";
        popup_row_4_cell_0.appendChild(icon_3);
        popup_row_4_cell_1.innerHTML = "<b>Počet obyvatel</b>";
        popup_row_1_cell_1.setAttribute("id", "text_okres_nazev");
        popup_row_1_cell_1.style.padding = "3px";
        popup_row_1_cell_1.style.fontSize = "17px";
        popup_row_1_cell_1.style.fontWeight = "bolder";
        popup_row_2_cell_2.setAttribute("id", "text_okres_nakazeni");
        popup_row_2_cell_1.style.padding = "3px";
        popup_row_2_cell_1.style.paddingLeft = "5px";
        popup_row_3_cell_1.setAttribute("id", "text_current_data");
        popup_row_3_cell_2.setAttribute("id", "text_okres_nakazeni_100");
        popup_row_3_cell_1.style.padding = "3px";
        popup_row_3_cell_1.style.paddingLeft = "5px";
        popup_row_3_cell_1.style.paddingRight = "5px";
        popup_row_4_cell_2.setAttribute("id", "text_okres_pocet_obyvatel");
        popup_row_4_cell_1.style.padding = "3px";
        popup_row_4_cell_1.style.paddingLeft = "5px";

        // Add district data into popup
        popup_row_1_cell_1.innerHTML = name;
        popup_row_2_cell_2.innerHTML = okres_lau;
        popup_row_3_cell_2.innerHTML = " ";
        popup_row_4_cell_2.innerHTML = numberWithCommas(okresy_pocet_obyvatel[okres_lau]);

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
        var close_buttons = element_iframe.contentWindow.document.getElementsByClassName("leaflet-popup-close-button");
        while (close_buttons.length > 0) {
            close_buttons[0].parentNode.removeChild(close_buttons[0]);
        }

        var popup_tip = element_iframe.contentWindow.document.getElementsByClassName("leaflet-popup-tip-container");
        while (popup_tip.length > 0) {
            popup_tip[0].parentNode.removeChild(popup_tip[0]);
        }

        // Update page
        updatePage();
    }
    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
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
        // Do not allow animation while time window settings have changed
        if (analysis_changed) {
            newToast("Prosím potvrďte nové změny");
            return;
        }

        // Perform animation
        ongoing_animation = true;
        var max_value = parseInt(element_slider.getAttribute('max'));
        var current_value = parseInt(element_slider.value);

        // Animation cycle
        for (var cur = current_value; cur < max_value; cur++) {
            if (ongoing_animation == false) break;
            element_slider.MaterialSlider.change(cur + 1);
            updatePage();
            await sleep(current_animation_speed * 30);
        }
    }
    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
        }
    }
}

// handle stop animation button
function stopAnimation() {
    ongoing_animation = false;
}

// handle change animation speed clicker
function changeAnimationSpeed(value) {
    current_animation_speed = 11 - parseInt(value);
}

// Add comma separator into number
function numberWithCommas(x) {
    var num = parseFloat(x);
    var roundedNum = Math.round(num);
    return roundedNum.toLocaleString("en-US");
}

// Function to add days to given date
function addDays(date, days) {
    var ms = new Date(date).getTime() + (86400000 * days);
    return new Date(ms);
}

// Helper function to calculate color into hex value
function colorToHexValue(c) {
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

    return text;
}

// Function that updates slider text
function updatePage() {
    try {

        // Show message to pick dataset
        if (!analysis_first_picked) {
            newToast("Prosím potvrďte volbu datasetu v okně \"Časové okno\"");
            return;
        }

        // Show message to confirm new settings
        if (analysis_changed) {
            newToast("Prosím potvrďte nové změny");
            return;
        }

        // Init needed variables
        var okres_value, okres_value_PIP, maximum_day, maximum_day_PIP, value_name, value_name_second, max_value_name, min_value_name, value_name_PIP, max_value_name_PIP, skip_normal_map, skip_pip_map;
        var selected_100 = false;
        var selected_date = new Date();

        // Get main slider starting date
        switch (current_time_window_fragment) {
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

        // Configure date to current date in secondary slider
        selected_date = addDays(selected_date, element_slider.value);
        slider_current_selected_date = selected_date;
        var selected_date_text = getFormattedDate(selected_date);
        var selected_date_text_local = getFormattedDateLocal(selected_date);

        // Update some values and texts on page
        element_slider_text.innerHTML = selected_date.toLocaleDateString("cs-CZ");
        element_map_date_1.innerHTML = selected_date_text_local;
        element_map_date_2.innerHTML = selected_date_text_local;

        // Update informational texts
        element_map_info_1.style.display = "block";
        element_map_info_2.style.display = "block";
        element_window_warning.style.display = "none";
        switch (current_analysis) {
            case "nakazeni-analyze":
                element_map_info_1.innerHTML = "<b>Nové případy za tento den:</b> " + numberWithCommas(covid_data[selected_date_text]['infections_new_count']);
                element_map_info_2.innerHTML = "<b>Celkový počet zaznamenaných případů v tento den:</b> " + numberWithCommas(covid_data[selected_date_text]['infections_count']);
                element_map_info_3.innerHTML = "";
                element_map_info_3.style.display = "none";
                break;
            case "ockovani-analyze":
                element_map_info_1.innerHTML = "<b>Nová očkování za tento den:</b> " + numberWithCommas(covid_data[selected_date_text]['vaccination_doses_day']);
                element_map_info_3.innerHTML = "<b>Celkový počet obyvatel naočkovaných alespoň první a druhou dávkou:</b> " + numberWithCommas(covid_data[selected_date_text]['vaccination_2_dose_alltime']);
                element_map_info_2.innerHTML = "<b>Celkový počet zaznamenaných očkování doposud:</b> " + numberWithCommas(covid_data[selected_date_text]['vaccination_doses_alltime']);
                element_map_info_3.style.display = "block";
                if (selected_date < vaccination_start) element_window_warning.style.display = "block";
                break;
            case "umrti-analyze":
                element_map_info_1.innerHTML = "<b>Počet zemřelých tento den:</b> " + numberWithCommas(covid_data[selected_date_text]['deaths_day_count']);
                element_map_info_2.innerHTML = "<b>Celkový počet zemřelých k tomuto dni:</b> " + numberWithCommas(covid_data[selected_date_text]['deaths_alltime_count']);
                element_map_info_3.innerHTML = "";
                element_map_info_3.style.display = "none";
                if (selected_date < deaths_start) element_window_warning.style.display = "block";
                break;
            case "testovani-analyze":
                element_map_info_1.innerHTML = "<b>Počet otestovaných tento den:</b> " + numberWithCommas(covid_data[selected_date_text]['pcr_tests_new_day_count']);
                element_map_info_2.innerHTML = "<b>Celkový počet otestovaných k tomuto dni:</b> " + numberWithCommas(covid_data[selected_date_text]['pcr_tests_alltime_count']);
                element_map_info_3.innerHTML = "";
                element_map_info_3.style.display = "none";
                if (selected_date < testing_start) element_window_warning.style.display = "block";
                break;
        }

        // Map district updating - go through all districts
        var layer = element_iframe.contentWindow.document.querySelector("g");
        var districts = layer.children;
        var layer_pip = element_iframe_pip.contentWindow.document.querySelector("g");
        var districts_pip = layer_pip.children;

        // Get needed keys according to current settings - from data_analysis_types.js
        if (current_100k_recalculation) {
            selected_100 = true;
            value_name = data_analysis_types[current_dataset_data]['value_100'];
            value_name_second = data_analysis_types[current_dataset_data]['value'];
            value_name_PIP = data_analysis_types[current_dataset_data_PIP]['value_100'];
            max_value_name = data_analysis_types[current_dataset_data]['max_value_100'];
            max_value_name_PIP = data_analysis_types[current_dataset_data_PIP]['max_value_100'];
            text = data_analysis_types[current_dataset_data]['text_100'];
            if (current_max_recalculation) {
                max_value_name = data_analysis_types[current_dataset_data]['max_range_100'];
                max_value_name_PIP = data_analysis_types[current_dataset_data_PIP]['max_range_100'];
            }
        }
        else {
            value_name = data_analysis_types[current_dataset_data]['value'];
            value_name_second = data_analysis_types[current_dataset_data]['value_100'];
            value_name_PIP = data_analysis_types[current_dataset_data_PIP]['value'];
            max_value_name = data_analysis_types[current_dataset_data]['max_value'];
            max_value_name_PIP = data_analysis_types[current_dataset_data_PIP]['max_value'];
            text = data_analysis_types[current_dataset_data]['text'];
            if (current_max_recalculation) {
                max_value_name = data_analysis_types[current_dataset_data]['max_range'];
                max_value_name_PIP = data_analysis_types[current_dataset_data_PIP]['max_range'];
            }
        }

        // Go through all districts and update them
        for (let i = 0; i < 77; i++) {
            skip_normal_map = false;
            skip_pip_map = false;

            // Get district LAU code
            var okres_lau = districts[i].getAttribute('okres_lau');

            // Get needed values that are required for later computations and set some texts on page according to selected data
            if (current_max_recalculation) {
                maximum_day = covid_data[max_value_name].toFixed(2);
                maximum_day_PIP = covid_data[max_value_name_PIP].toFixed(2);
            }
            else {
                maximum_day = covid_data[selected_date_text][max_value_name].toFixed(2);
                maximum_day_PIP = covid_data[selected_date_text][max_value_name_PIP].toFixed(2);
            }
            okres_value = covid_data[selected_date_text][okres_lau][value_name].toFixed(2);
            okres_value_second = covid_data[selected_date_text][okres_lau][value_name_second].toFixed(2);
            okres_value_PIP = covid_data[selected_date_text][okres_lau][value_name_PIP].toFixed(2);
            analysis_name_value = value_name;
            analysis_name_max_value = max_value_name;

            // Update text if current district is selected
            if (current_district_clicked == okres_lau) {
                if (element_iframe.contentWindow.document.getElementById("text_okres_nakazeni") != null) {
                    if (selected_100) {
                        element_iframe.contentWindow.document.getElementById("text_okres_nakazeni_100").innerHTML = okres_value;
                        element_iframe.contentWindow.document.getElementById("text_okres_nakazeni").innerHTML = Math.round(okres_value_second);
                    }
                    else {
                        element_iframe.contentWindow.document.getElementById("text_okres_nakazeni_100").innerHTML = okres_value_second;
                        element_iframe.contentWindow.document.getElementById("text_okres_nakazeni").innerHTML = Math.round(okres_value_second);
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
            }

            // Draw scale rectangle
            element_scale_rectangle.style.background = "linear-gradient(90deg, rgba(" + color2[0] + "," + color2[1] + "," + color2[2] + ",1) 0%, rgba(" + color1[0] + "," + color1[1] + "," + color1[2] + ",1) 100%)";
            element_scale_min.innerHTML = "0";
            element_scale_max.innerHTML = numberWithCommas(maximum_day);

            // Set white color if value is zero
            if (maximum_day == 0) {
                districts[i].setAttribute("fill", "#FFFFFF");
                skip_normal_map = true;
            }
            if (maximum_day_PIP == 0) {
                districts_pip[i].setAttribute("fill", "#FFFFFF");
                skip_pip_map = true;
            }

            // Calculate and set color to PiP districts
            if (!skip_pip_map) {
                var percentage_pip = (okres_value_PIP) / maximum_day_PIP;
                var inverted_percentage_pip = 1 - percentage_pip;
                var rgb_PIP = [
                    Math.round(color1_PIP[0] * percentage_pip + color2_PIP[0] * inverted_percentage_pip),
                    Math.round(color1_PIP[1] * percentage_pip + color2_PIP[1] * inverted_percentage_pip),
                    Math.round(color1_PIP[2] * percentage_pip + color2_PIP[2] * inverted_percentage_pip)
                ];
                var color_string_PIP = "#" + colorToHexValue(rgb_PIP[0]) + colorToHexValue(rgb_PIP[1]) + colorToHexValue(rgb_PIP[2]);
                districts_pip[i].setAttribute("fill", color_string_PIP);
            }

            // Calculate and set color to districts
            if (!skip_normal_map) {
                var percentage = (okres_value) / maximum_day;
                var inverted_percentage = 1 - percentage;
                var rgb = [
                    Math.round(color1[0] * percentage + color2[0] * inverted_percentage),
                    Math.round(color1[1] * percentage + color2[1] * inverted_percentage),
                    Math.round(color1[2] * percentage + color2[2] * inverted_percentage)
                ];
                var color_string = "#" + colorToHexValue(rgb[0]) + colorToHexValue(rgb[1]) + colorToHexValue(rgb[2]);
                districts[i].setAttribute("fill", color_string);
            }
        }

    }
    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
        }
    }
}

// Select type of analysis (infected, recovered...)
function selectAnalysis(type) {

    // Define default values
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

    // Override selected analysis values
    try {
        current_analysis = type;
        analysis_selected = true;
        analyze_fields.forEach(async (element) => {

            // Set colors and other elements according to selected type of analysis
            if (element == type) {
                element_dataset_data_option.innerHTML = "";

                switch (element) {
                    case 'nakazeni-analyze':
                        element_css_orange.disabled = false;
                        await sleep(50);
                        element_css_green.disabled = true;
                        element_css_purple.disabled = true;
                        element_css_gray.disabled = true;
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
                        element_css_green.disabled = false;
                        await sleep(50);
                        element_css_orange.disabled = true;
                        element_css_purple.disabled = true;
                        element_css_gray.disabled = true;
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
                        selectAnalysis_datasetdate = "27.12.2020";
                        break;
                    case 'umrti-analyze':
                        element_css_gray.disabled = false;
                        await sleep(50);
                        element_css_orange.disabled = true;
                        element_css_green.disabled = true;
                        element_css_purple.disabled = true;
                        deaths_opacity = 1;
                        deaths_borderBottom = "8px gray solid";
                        deaths_fontWeight = "bolder";
                        selectAnalysis_sliderColor = "#9e9e9e";
                        element_map_title.innerHTML = "Počty úmrtí";
                        var options = [
                            "Počet nově zemřelých daný den",
                            "Aktuální celkový počet zemřelých doposud"
                        ];
                        current_analysis_color = "#9e9e9e";
                        selectAnalysis_datasetdate = "22.3.2020";
                        break;
                    case 'testovani-analyze':
                        element_css_purple.disabled = false;
                        await sleep(50);
                        element_css_orange.disabled = true;
                        element_css_green.disabled = true;
                        element_css_gray.disabled = true;
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

                // Update style
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
                element_map_title.innerHTML = selectAnalysis_maptitle;

                // Insert dataset data types
                options.forEach((element) => {
                    var opt = document.createElement('option');
                    opt.value = opt.innerHTML = element;
                    element_dataset_data_option.appendChild(opt);
                }
                );

                if (analysis_selected) selectDataFromDataset(element_dataset_data_option.value);
            }
        })
    }
    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
        }
    }

}

// Initializer for time frame slider
function loadTimeFrameSlider() {
    try {

        // Calculate how many days since covid - number of values in slider
        var today = new Date();
        var week_ago = new Date();
        week_ago.setDate(week_ago.getDate() - 7);
        var difference = week_ago.getTime() - covid_start.getTime();
        days_since_covid = difference / (1000 * 3600 * 24);

        // Load all values
        slider_values = [];
        for (var i = 0; i < days_since_covid; i++) {
            slider_values[i] = i + 1;
        }

        // Initialize some slider values
        var snapValues = [
            document.getElementById('slider-min'),
            document.getElementById('slider-max')
        ];
        var format = {
            to: function (value) {
                return slider_values[Math.round(value)];
            },
            from: function (value) {
                return slider_values.indexOf(Number(value));
            }
        };

        // Disallow user to get yesterday values if they have not been yet released
        var slider_maximum_day;
        if (today.getHours() >= 10) {
            slider_maximum_day = slider_values.length - 8;
        }
        else {
            slider_maximum_day = slider_values.length - 9;
        }

        // Create slider with format
        noUiSlider.create(element_nouislider, {
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

        element_nouislider.noUiSlider.set(['1', '100']);
        element_nouislider.noUiSlider.on('update', function (values, handle) {
            analysis_changed = true;

            var selected_date = new Date();
            switch (current_time_window_fragment) {
                case "Den":
                    selected_date.setDate(selected_date.getDate() - (slider_values.length - values[handle]));
                    element_time_window_slider_text.innerHTML = "<i>" + (values[1] - values[0]) + " dní</i>";
                    document.getElementById("mb_usage").innerHTML = "Při potvrzení dojde ke stažení cca " + Math.round(0.1067 * (values[1] - values[0])) + " MB dat";
                    break;
                case "Týden":
                    selected_date = new Date(covid_start_weeks[values[handle] - 1]);
                    element_time_window_slider_text.innerHTML = "<i>" + (values[1] - values[0]) + " týdnů</i>";
                    document.getElementById("mb_usage").innerHTML = "Při potvrzení dojde ke stažení cca " + Math.round(0.747 * (values[1] - values[0])) + " MB dat";
                    break;
                case "Měsíc":
                    selected_date = new Date(covid_start_months[values[handle] - 1]);
                    element_time_window_slider_text.innerHTML = "<i>" + (values[1] - values[0]) + " měsíců</i>";
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
    }
    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
        }
    }

}

// Handle selection of PiP display type
function selectDatasetPIP(value) {
    var options;
    try {
        document.getElementById("pip_type").innerHTML = value;

        var select_4 = document.getElementById("sel4");
        select_4.innerHTML = "";

        switch (value) {
            case 'Infekce':
                current_pip_analysis = 'nakazeni-analyze';
                current_dataset_data_PIP = 'Nové případy';
                options = [
                    "Nové případy",
                    "Nové případy za poslední týden",
                    "Nové případy za poslední dva týdny",
                    "Nové případy lidí starších 65 let"
                ];
                break;
            case 'Očkování':
                current_pip_analysis = 'ockovani-analyze';
                current_dataset_data_PIP = 'Všechny dávky tento den';
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
                break;
            case 'Úmrtí':
                current_pip_analysis = 'umrti-analyze';
                current_dataset_data_PIP = 'Aktuální celkový počet zemřelých doposud';
                options = [
                    "Aktuální celkový počet zemřelých doposud",
                    "Počet nově zemřelých daný den"
                ];
                break;
            case 'PCR testování':
                current_pip_analysis = 'testovani-analyze';
                current_dataset_data_PIP = 'Aktuální celkový počet otestovaných doposud';
                options = [
                    "Aktuální celkový počet otestovaných doposud",
                    "Počet nově otestovaných daný den"
                ];
                break;
        }

        options.forEach((element) => {
            var opt = document.createElement('option');
            opt.value = opt.innerHTML = element;
            select_4.appendChild(opt);
        }
        );

        document.getElementById("pip_data").innerHTML = document.getElementById("sel4").value;
        updatePage();
    }
    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
        }
    }

}

// Handle time component selection in time window settings
function selectTimeComponent(value) {
    try {
        analysis_selected = true;
        current_time_window_fragment = value;

        // Calculate day difference between covid start and now
        var today = new Date();
        var diff = today.getTime() - covid_start.getTime();
        var days_since = diff / (1000 * 3600 * 24);

        // Disallow user to get values if they have not been yet released
        var slider_maximum;
        if (today.getHours() >= 10) {
            slider_maximum = 8;
        }
        else {
            slider_maximum = 9;
        }

        // Update slider values based on time component
        switch (value) {
            case "Den":
                element_nouislider.noUiSlider.updateOptions({
                    range:
                    {
                        min: days_since_covid - days_since,
                        max: days_since_covid - slider_maximum
                    }
                });
                main_slider_range_max = days_since_covid - slider_maximum;
                break;
            case "Týden":
                element_nouislider.noUiSlider.updateOptions({
                    range:
                    {
                        min: 0,
                        max: covid_start_weeks.length - 1
                    }
                });
                main_slider_range_max = covid_start_weeks.length - 1;
                break;
            case "Měsíc":
                element_nouislider.noUiSlider.updateOptions({
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
    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
        }
    }
}

// Handle selection of PiP display data
function selectDataFromDatasetPIP(value) {
    document.getElementById("pip_data").innerHTML = value;
    current_dataset_data_PIP = value;
    updatePage();
}

// Handle selection of displayed data
function selectDataFromDataset(value) {
    current_dataset_data = value;

    // Update title text based on current analysis
    switch (value) {
        case "Současně nakažení":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Současný počet případů";
            break;
        case "Nové případy":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově zjištěných případů";
            break;
        case "Nové případy za poslední týden":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově zjištěných případů za posledních 7 dní";
            break;
        case "Nové případy za poslední dva týdny":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově zjištěných případů za posledních 14 dní";
            break;
        case "Nové případy lidí starších 65 let":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově zjištěných případů lidí starších 65 let";
            break;

        case "Všechny dávky tento den":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných dávek očkování daný den";
            break;
        case "Všechny dávky doposud":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných dávek očkování doposud";
            break;

        case "První dávka tento den":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet vydaných prvních dávek očkování daný den";
            break;
        case "První dávka doposud":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných prvních dávek očkování doposud";
            break;

        case "Druhá dávka tento den":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet vydaných druhých dávek očkování daný den";
            break;
        case "Druhá dávka doposud":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných druhých dávek očkování doposud";
            break;

        case "Třetí dávka tento den":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet vydaných třetích dávek očkování daný den";
            break;
        case "Třetí dávka doposud":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných třetích dávek očkování doposud";
            break;

        case "Čtvrtá dávka tento den":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet vydaných čtvrtých dávek očkování daný den";
            break;
        case "Čtvrtá dávka doposud":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet vydaných čtvrtých dávek očkování doposud";
            break;

        case "Aktuální celkový počet zemřelých doposud":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet zemřelých doposud";
            break;
        case "Počet nově zemřelých daný den":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově zemřelých k danému dni";
            break;

        case "Aktuální celkový počet otestovaných doposud":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Celkový počet otestovaných doposud";
            break;
        case "Počet nově otestovaných daný den":
            element_map_title.innerHTML = "<b>Vizualizace COVID-19</b> | Počet nově otestovaných k danému dni";
            break;
    }
    updatePage();
    initChart();
}

// Handle confirmation of time window settings - downloading data
function confirmAnalysis() {
    try {

        // Disallow download if no dataset has been selected
        if (!analysis_selected) {
            newToast("Vyberte prosím data k vizualizaci");
            return;
        }

        // Warn user if a lot of data is about to be downloaded
        var slider_values_difference = slider_current_values[1] - slider_current_values[0];
        if ((slider_values_difference / main_slider_range_max) > 0.7) {
            if (!confirm('Zvolili jste rozsáhlé časové okno, načtení může trvat delší dobu (závisí na vašem internetovém připojení). Chcete pokračovat?')) {
                return;
            }
        }

        // Everything is okay, now we download
        analysis_changed = false;
        if (map_enabled == false) {
            element_iframe.style.pointerEvents = "auto";
            element_iframe.contentWindow.document.getElementsByClassName("leaflet-popup-pane")[0].innerHTML = "";
            map_enabled = true;
        }
        var value_min = new Date(), value_max = new Date(), date1 = new Date(), date2 = new Date();

        switch (current_time_window_fragment) {
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
                break;
        }

        current_time_window_low = value_min;
        current_time_window_high = value_max;

        // GCP -        var url = "https://bp-covid-htvvjjewbq-lz.a.run.app/covid/api/from=" + getFormattedDate(value_min) + "&to=" + getFormattedDate(value_max);
        // Northflank - var url = "https://p02--thesis-covid--k4spvy25x5nv.code.run/covid/api/from=" + getFormattedDate(value_min) + "&to=" + getFormattedDate(value_max);
        var url = "http://127.0.0.1:8000/covid/api/from=" + getFormattedDate(value_min) + "&to=" + getFormattedDate(value_max);

        // To calculate the time difference of two dates
        var difference_in_time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates
        var difference_in_days = difference_in_time / (1000 * 3600 * 24);

        newToast("Stahování nových dat, prosím vyčkejte...");
        $.ajax({
            url: url,
            headers: { 'accept': 'application/json' },
            type: "GET",
            success: function (result) {

                // Reset slider to zero
                element_slider.setAttribute("min", 0);
                element_slider.value = "0";

                // Set slider max to correct value
                switch (current_time_window_fragment) {
                    case "Den":
                        element_slider.setAttribute("max", slider_current_values[1] - slider_current_values[0]);
                        break;
                    case "Týden":
                        element_slider.setAttribute("max", difference_in_days);
                        break;
                    case "Měsíc":
                        element_slider.setAttribute("max", difference_in_days);
                        break;
                }


                covid_data = result;
                updatePage();
                element_iframe.contentWindow.document.getElementsByClassName("leaflet-popup-pane")[0].hidden = false;
                newToast("Data byla aktualizována");
                initChart();

                // Open animation tab
                element_slider.MaterialSlider.change(0);
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
                newToast('Došlo k neznámé chybě, její podrobnosti jsou v konzoli')
            }
        })

        analysis_first_picked = true;
    }
    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
        }
    }
}

// Handle secondary slider movement
function changeDayInDataset(value) {
    if (analysis_changed) {
        newToast("Prosím potvrďte nové změny");
        // document.getElementById("unsaved_changes").style.display = "";
        return;
    }
    var curr = parseInt(element_slider.value);
    element_slider.MaterialSlider.change(curr + value);
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
    this.current_100k_recalculation = !this.current_100k_recalculation;
    updatePage();
    initChart();
}

// Button handler for switching recalculation (max for window)
function changeRecalculationMaxValue() {
    this.current_max_recalculation = !this.current_max_recalculation;
    updatePage();
    initChart();
}

// Handler for showing and hiding PiP window
function showHideRightUpperPanel() {
    var panel = document.getElementById("right_upper_panel");
    var pip_settings = document.getElementById("pip_settings");
    var panel_div = document.getElementById("div_right_upper_part");
    if (panel.style.display === "none") {
        panel.style.display = "block";
        pip_settings.style.display = "block";
        panel_div.style.width = "400px";
    } else {
        panel.style.display = "none";
        pip_settings.style.display = "none";
        panel_div.style.width = "200px";
    }
}

// Handler for showing and hiding graph window
function showHideLeftBottomPanel2() {
    var panel = document.getElementById("left_bottom_panel_2");
    var panel_district_text = document.getElementById("left_bottom_panel_district_text");
    var panel_time_text = document.getElementById("left_bottom_panel_time_window_text");
    if (panel.style.display === "none") {
        panel.style.display = "block";
        panel_district_text.style.display = "block";
        panel_time_text.style.display = "block";
    } else {
        panel.style.display = "none";
        panel_district_text.style.display = "none";
        panel_time_text.style.display = "none";
    }
    initChart();
}

// Handler for showing and hiding time window
function showHideTimeWindow() {
    var time_window = document.getElementById("time_window");
    document.getElementById("view_window").style.display = "none";
    document.getElementById("animation_window").style.display = "none";
    document.getElementById("time_window_button").style.fontWeight = "bold";
    document.getElementById("time_window_cell").style.borderBottom = "4px #6d6d6d solid";
    document.getElementById("view_window_button").style.fontWeight = "normal";
    document.getElementById("view_window_cell").style.borderBottom = "0px #6d6d6d solid";
    document.getElementById("animation_window_button").style.fontWeight = "normal";
    document.getElementById("animation_window_cell").style.borderBottom = "0px #6d6d6d solid";
    if (time_window.style.display === "none") {
        time_window.style.display = "block";
    }
}

// Handler for showing and hiding view personalization window
function showHideViewWindow() {
    var view_window = document.getElementById("view_window");
    var animation_window = document.getElementById("animation_window");

    if (animation_window.style.display == "none") {
        view_window.classList.remove("w3-animate-right");
        view_window.classList.remove("w3-animate-left");
        view_window.classList.add("w3-animate-right");
    }
    else {
        view_window.classList.remove("w3-animate-right");
        view_window.classList.remove("w3-animate-left");
        view_window.classList.add("w3-animate-left");
    }

    document.getElementById("time_window").style.display = "none";
    document.getElementById("animation_window").style.display = "none";
    document.getElementById("time_window_button").style.fontWeight = "normal";
    document.getElementById("time_window_cell").style.borderBottom = "0px #6d6d6d solid";
    document.getElementById("view_window_button").style.fontWeight = "bold";
    document.getElementById("view_window_cell").style.borderBottom = "4px #6d6d6d solid";
    document.getElementById("animation_window_button").style.fontWeight = "normal";
    document.getElementById("animation_window_cell").style.borderBottom = "0px #6d6d6d solid";
    if (view_window.style.display === "none") {
        view_window.style.display = "block";
    }
}

// Handler for showing and hiding animation window
function showHideAnimationWindow() {
    var animation_window = document.getElementById("animation_window");
    document.getElementById("time_window").style.display = "none";
    document.getElementById("view_window").style.display = "none";
    document.getElementById("time_window_button").style.fontWeight = "normal";
    document.getElementById("time_window_cell").style.borderBottom = "0px #6d6d6d solid";
    document.getElementById("view_window_button").style.fontWeight = "normal";
    document.getElementById("view_window_cell").style.borderBottom = "0px #6d6d6d solid";
    document.getElementById("animation_window_button").style.fontWeight = "bold";
    document.getElementById("animation_window_cell").style.borderBottom = "4px #6d6d6d solid";
    if (animation_window.style.display === "none") {
        animation_window.style.display = "block";
    }
}

// Handler for showing and hiding PiP window
function showHideBottomLeft() {
    var table = document.getElementById("info_table");
    var table_separator = document.getElementById("info_table_separator");
    var expand_button = document.getElementById("expand_button_1");
    if (table.style.display === "none") {
        table.style.display = "block";
        table_separator.style.display = "block";
        expand_button.innerHTML = "expand_more";
        element_map_date_2.style.display = "none";
    } else {
        table.style.display = "none";
        table_separator.style.display = "none";
        expand_button.innerHTML = "expand_less";
        element_map_date_2.style.display = "";
    }
}

// Graph initializer and updater
function initChart() {

    try {
        // If no district is selected, dont show graph
        if (current_district_clicked == "") {
            return;
        }

        // Display district name
        var district_name_box = document.getElementById("left_bottom_panel_district_text");
        var time_box = document.getElementById("left_bottom_panel_time_window_text");
        district_name_box.innerHTML = "Zvolený okres: " + current_district_clicked_name;
        time_box.innerHTML = "Časové okno: " + getFormattedDateLocal(current_time_window_low) + " - " + getFormattedDateLocal(current_time_window_high);

        // Initialize x values - get all dates from data
        var xArray = [], yArray = [];
        var data_keys = Object.keys(covid_data);
        var data_keys_dates = [];
        data_keys.forEach(element => {
            if (typeof covid_data[element] === 'object' && covid_data[element] !== null) {
                xArray.push(getFormattedDateLocal(new Date(element)));
                data_keys_dates.push(element);
            }
        });

        // Initialize y values - get all values for each date
        data_keys_dates.forEach(element => {
            var d = element;
            var o = current_district_clicked;
            var v = analysis_name_value;
            yArray.push(covid_data[d][o][v]);
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
                text: current_dataset_data,
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

        // Define Layout - dark
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
                text: current_dataset_data,
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
        if (current_dark_mode)
            Plotly.newPlot("district_chart", data, layout_dark, { displayModeBar: true });
        else
            Plotly.newPlot("district_chart", data, layout_light, { displayModeBar: true });
    }
    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
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

    // Generate weeks
    var current = covid_start_week, today = new Date();
    today.setHours(0, 0, 0, 0);
    while (true) {
        if ((today.getTime() - current.getTime()) <= 604800000)
            break;
        var text = getFormattedDate(current);
        covid_start_weeks.push(text);
        current.setDate(current.getDate() + 7);
    }

    // Generate months
    current = covid_start_month;
    while (true) {
        if ((today.getTime() - current.getTime()) <= 604800000)
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
        newErrorToast(err);
    }
}

// Show new error toast
function newErrorToast(text) {
    var element_toast = document.querySelector('#error_toast');
    element_toast.MaterialSnackbar.queuedNotifications_ = [];
    var data = { message: "Internal error: " + text, timeout: 5000 };
    element_toast.MaterialSnackbar.showSnackbar(data);
}

// Show new toast
function newToast(text) {
    var element_toast = document.querySelector('#toast');
    element_toast.MaterialSnackbar.queuedNotifications_ = [];
    var data = { message: text, timeout: 2500 };
    element_toast.MaterialSnackbar.showSnackbar(data);
}

// Show new toast
function newToast(text, length) {
    var element_toast = document.querySelector('#toast');
    element_toast.MaterialSnackbar.queuedNotifications_ = [];
    var data = { message: text, timeout: length };
    element_toast.MaterialSnackbar.showSnackbar(data);
}

// Set map opacity
function setInitialMapOpacity() {
    var layer = element_iframe.contentWindow.document.getElementsByClassName("leaflet-tile-pane");
    layer[0].style.opacity = 0.6;
}

// Change map opacity by value
function changeMapOpacity(value) {

    // Check if value is too small or big
    if ((current_map_opacity + value) < 0 || (current_map_opacity + value) > 1) return;
    current_map_opacity += value;

    // Apply and refresh
    element_map_opacity_text.innerHTML = (current_map_opacity * 100).toFixed(0) + "%";
    var tiles_layer = element_iframe.contentWindow.document.getElementsByClassName("leaflet-tile-pane")[0];
    tiles_layer.style.opacity = current_map_opacity;

    // Save value into local storage
    localStorage.setItem("maptransparency", current_map_opacity);
}

// Change district opacity by value
function changeDistrictOpacity(value) {

    // Check if value is too small or big
    if ((current_district_opacity + value) < 0 || (current_district_opacity + value) > 1) return;
    current_district_opacity += value;

    // Apply and refresh
    element_district_opacity_text.innerHTML = (current_district_opacity * 100).toFixed(0) + "%";
    refreshMap();
}

// Change district stroke by value
function changeDistrictStrokeOpacity(value) {

    // Check if value is too small or big
    if ((current_district_stroke_opacity + value) < 0 || (current_district_stroke_opacity + value) > 1) return;
    current_district_stroke_opacity += value;

    // Apply and refresh
    element_district_stroke_text.innerHTML = (current_district_stroke_opacity * 100).toFixed(0) + "%";
    refreshMap();
}

// Create ripple effect on element
function createRipple(ripple_type, element_id) {

    // Get element and dimensions
    var element = document.getElementById(element_id);
    var element_dimensions = element.getBoundingClientRect();

    // Create circle
    var ripple_circle = document.createElement("span");
    var radius = topbar_ripple.clientWidth / 2;
    ripple_circle.style.width = ripple_circle.style.height = topbar_ripple.clientWidth + "px";
    ripple_circle.style.left = element_dimensions.x + 40 - topbar_ripple.offsetLeft - radius + "px";
    ripple_circle.style.top = element_dimensions.y + 23 - topbar_ripple.offsetTop - radius + "px";

    // Add given color
    ripple_circle.classList.add("ripple_base");
    ripple_circle.classList.add(ripple_type);

    // Remove old ripple
    var ripple = topbar_ripple.getElementsByClassName("ripple_base")[0];
    if (ripple) {
        ripple.remove();
    }

    // Add new ripple
    topbar_ripple.appendChild(ripple_circle);
}

// Helper function that refreshes map after theme switch
function refreshMap() {
    var layer = element_iframe.contentWindow.document.querySelector("g");
    var districts = layer.children;
    for (let i = 0; i < 77; i++) {
        districts[i].setAttribute("fill-opacity", current_district_opacity);
        districts[i].setAttribute("stroke-width", current_district_stroke_opacity);
    }
}

// Dark/light mode handler
function toggleDarkMap() {
    try {
        current_dark_mode = !current_dark_mode;

        if (current_dark_mode) {

            // PIP
            var layer = element_iframe_pip.contentWindow.document.querySelector("g");
            var districts = layer.children;
            for (let i = 0; i < 77; i++) {
                districts[i].setAttribute("fill-opacity", 1);
            }

            // Switches
            var switches = document.getElementsByClassName("mdl-switch__track");

            for (var i = 0; i < switches.length; i++) {
                switches[i].style.backgroundColor = "#444444";
            }

            // Map background
            var map = element_iframe.contentWindow.document.getElementById("map_a91c08a299bb6023baf393f504c6fb3e");
            var map_pip = element_iframe_pip.contentWindow.document.getElementById("map_a91c08a299bb6023baf393f504c6fb3ee");

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

            var splash = document.getElementById("splashscreen");
            var contactscreen_content = document.getElementById("contactscreen_content");
            var splash_content = document.getElementById("splashscreen_content");
            var splash_content_paragraph = document.getElementById("splashscreen_content_paragraph");
            var splash_button = document.getElementById("button-hide-splash");
            var contact_button = document.getElementById("button-contact-close");
            splash.style.backgroundColor = "rgba(0, 0, 0, 0.686)";
            contactscreen_content.style.backgroundColor = "rgba(0, 0, 0, 0.686)";
            splash_content_paragraph.style.backgroundColor = "rgb(20, 20, 20)";
            splash_content.classList.add("w3-metro-darken");
            splash_button.classList.add("w3-dark-gray");
            splash_button.classList.remove("w3-light-gray");
            contactscreen_content.classList.add("w3-metro-darken");
            contact_button.classList.add("w3-dark-gray");
            contact_button.classList.remove("w3-light-gray");

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
            var layer = element_iframe_pip.contentWindow.document.querySelector("g");
            var districts = layer.children;
            for (let i = 0; i < 77; i++) {
                districts[i].setAttribute("fill-opacity", 0.7);
            }

            // Switches
            var switches = document.getElementsByClassName("mdl-switch__track");

            for (var i = 0; i < switches.length; i++) {
                switches[i].style.backgroundColor = "#bdbdbd";
            }

            // Map background
            var map = element_iframe.contentWindow.document.getElementById("map_a91c08a299bb6023baf393f504c6fb3e");
            var map_pip = element_iframe_pip.contentWindow.document.getElementById("map_a91c08a299bb6023baf393f504c6fb3ee");

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
    catch (err_inner) {
        console.log(err_inner);
        try {
            newErrorToast(err_inner.message);
        }
        catch (err) {
            console.log(err_inner);
        }
    }
}

// Dropdown menu handler
function initDropdownMenu() {
    try {
        var menu = document.getElementsByClassName("mdl-menu__container")[0];
        var menu_content = document.getElementsByClassName("mdl-menu__outline")[0];
        menu.style.marginRight = "15px";
        menu.style.marginTop = "30px";
        menu.style.width = "300px";

        if (current_dark_mode) {
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

    catch (err_inner) {
        try {
            newErrorToast(err_inner);
        }
        catch (err) {
            alert(err_inner);
        }
    }

}

// Decrease UI scale, also unzoom pip map if needed
function decreaseUIScale() {
    if (current_ui_scale <= 50) {
        return;
    }
    if (current_ui_scale == 100)
    {
        element_iframe_pip.contentWindow.map_a91c08a299bb6023baf393f504c6fb3ee.setZoom(5);
    }
    current_ui_scale -= 10;
    document.body.style.zoom = current_ui_scale + "%";
    var text = document.getElementById("scale_ui_text");
    var graph = document.getElementById("right_bottom_container");
    text.innerHTML = current_ui_scale + "%";
    graph.style.zoom = 100 / current_ui_scale;
    localStorage.setItem("uiscale", current_ui_scale);
}

// Increase UI scale, also zoom pip map if needed
function increaseUIScale() {
    if (current_ui_scale >= 150) {
        return;
    }
    if (current_ui_scale == 90)
    {
        element_iframe_pip.contentWindow.map_a91c08a299bb6023baf393f504c6fb3ee.setZoom(6);
    }
    current_ui_scale += 10;
    document.body.style.zoom = current_ui_scale + "%";
    var text = document.getElementById("scale_ui_text");
    var graph = document.getElementById("right_bottom_container");
    text.innerHTML = current_ui_scale + "%";
    graph.style.zoom = 100 / current_ui_scale;
    localStorage.setItem("uiscale", current_ui_scale);
}

// Load dark mode from Local storage
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

// Load UI scale from Local storage
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
                    element_iframe_pip.contentWindow.map_a91c08a299bb6023baf393f504c6fb3ee.setZoom(5);
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