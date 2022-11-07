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
var analyze_fields = ["nakazeni-analyze", "vyleceni-analyze", "umrti-analyze", "ovlivneno-analyze"];
var current_analysis;
var slider_values;
var days_since_covid;
var slider_current_type = "Den";
var slider_current_values = [0,0];
var mapa_celkem_nove_pripady;
var mapa_celkem_aktivni_pripady;
var mapa_datum;
var slider_current_selected_date;
var ongoing_animation = true;
var animation_speed = 5;
var map_show_data = "Současně nakažení";
var text_current_data_sto_tisic;
var text_current_data;

// Initialize and modify webpage on startup
function onIframeLoad()
{
    loadTimeFrameSlider();
    loadPageComponents();
    initPage();
}

// DOM elements setter
function loadPageComponents()
{
    okres_nazev = document.getElementById("text_okres_nazev");
    okres_kod = document.getElementById("text_okres_kod");
    okres_nakazeni = document.getElementById("text_okres_nakazeni");
    okres_nakazeni_sto_tisic = document.getElementById("text_okres_nakazeni_sto_tisic");
    okres_celkem_nakazeni = document.getElementById("text_okres_celkem_nakazeni");
    okres_celkem_vyleceni = document.getElementById("text_okres_celkem_vyleceni");
    okres_datum = document.getElementById("text_okres_datum");
    okres_pocet_obyvatel = document.getElementById("text_okres_pocet_obyvatel");
    okres_pocet_obyvatel_procento = document.getElementById("text_okres_pocet_obyvatel_procento");
    mapa_celkem_nove_pripady = document.getElementById("text_celkem_nove_pripady");
    mapa_celkem_aktivni_pripady = document.getElementById("text_celkem_aktivni_pripady");
    text_current_data_sto_tisic = document.getElementById("text_current_data_sto_tisic");
    text_current_data = document.getElementById("text_current_data");
    mapa_datum = document.getElementById("text_datum_mapa");
    text_current_data_sto_tisic = document.getElementById("text_current_data_sto_tisic");
    text_current_data = document.getElementById("text_current_data");
    mapa_celkem_nove_pripady = document.getElementById("text_celkem_nove_pripady");
    mapa_celkem_aktivni_pripady = document.getElementById("text_celkem_aktivni_pripady");
    mapa_celkem_pripady = document.getElementById("text_celkem_pripady");
    mapa_datum = document.getElementById("text_datum_mapa");
    slider = document.getElementById("slider");
    output = document.getElementById("slider_text");
}

function initPage()
{
    slider.oninput = updatePage;
    var iframe = document.getElementById("iframe");
    const elements = iframe.contentWindow.document.getElementsByClassName("leaflet-control-layers-toggle");
    while(elements.length > 0)
    {
        elements[0].parentNode.removeChild(elements[0]);
    }
    var parent = iframe.contentWindow.document.querySelector("g");
    for (let i = 0; i < 77; i++)
    {
        var child = parent.firstElementChild;
        parent.removeChild(child);
    }
    var children = parent.children;
    for (let i = 0; i < 77; i++)
    {
        children[i].setAttribute("fill-opacity", 0.7);
        children[i].setAttribute("fill", "#000000");
        children[i].setAttribute("stroke-width", 0.7);
        children[i].setAttribute("name", okresy_names[i][1]);
        children[i].setAttribute("okres_lau", okresy_names[i][0]);
        children[i].addEventListener('click', function(){
            onClickMap(this.getAttribute('name'), this.getAttribute('okres_lau'), this);
            okres_clicked_map_object = i;
        });
    }
    // updatePage();
}

// click function - AJAX request
function onClickMap(name, okres_lau, object)
{
    // Remove additional stroke-width from previous district
    if (okres_clicked_map_object != -1)
    {
        iframe.contentWindow.document.querySelector("g").children[okres_clicked_map_object].setAttribute("stroke-width", 0.5);
    }

    // Set selected district stroke-width
    object.setAttribute("stroke-width", 4.5);

    // Get needed variables
    okres_clicked = okres_lau;
    selected_date_text = getFormattedDate(slider_current_selected_date);

    // Update text with selected district data
    okres_nazev.innerHTML = name;
    okres_kod.innerHTML = okres_lau;
    okres_pocet_obyvatel.innerHTML = okresy_pocet_obyvatel[okres_lau].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    switch(map_show_data)
    {
        case "Současně nakažení":
            var okres_value = new_data[selected_date_text][okres_lau]['aktivni_pripady_sto_tisic'].toFixed(2);
            okres_nakazeni.innerHTML = parseInt(new_data[selected_date_text][okres_lau]['aktivni_pripady']);
            okres_nakazeni_sto_tisic.innerHTML = okres_value;
            text_current_data_sto_tisic.innerHTML = "Současný počet nakažených na 100 tisíc obyvatel";
            text_current_data.innerHTML = "Současný počet nakažených";
            break;
        case "Nové případy":
            var okres_value = new_data[selected_date_text][okres_lau]['nove_pripady_sto_tisic'].toFixed(2);
            okres_nakazeni.innerHTML = parseInt(new_data[selected_date_text][okres_lau]['nove_pripady']);
            okres_nakazeni_sto_tisic.innerHTML = okres_value;
            text_current_data_sto_tisic.innerHTML = "Nový počet nakažených na 100 tisíc obyvatel";
            text_current_data.innerHTML = "Počet nově nakažených";
            break;
    }
}

// sleep function
function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

// handle animation button
async function handleAnimation()
{
    ongoing_animation = true;
    var max_value = parseInt(slider.getAttribute('max'));
    var current_value = parseInt(slider.value);
    for (var cur = current_value; cur < max_value; cur++)
    {
        if (ongoing_animation == false) break;
        slider.value = cur + 1;
        updatePage();
        await sleep(animation_speed * 30);
    }
}

// handle stop animation button
function stopAnimation()
{
    ongoing_animation = false;
}

// handle change animation speed clicker
function changeAnimationSpeed(value)
{
    animation_speed = 11 - parseInt(value);
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) 
{
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// function to add days to given date
function addDays(date, days)
{
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
function getFormattedDateLocal(date)
{
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(); 
}

// return date formatted as string
function getFormattedDate(date)
{
    var text = "";

    // format year
    text += date.getFullYear() + "-";

    // format month (possibly add 0)
    if ((date.getMonth() + 1) < 10)
    {
        text += "0" + (date.getMonth() + 1) + "-";
    }
    else
    {
        text += (date.getMonth() + 1) + "-";
    }

    // format day (possibly add 0)
    if ((date.getDate()) < 10)
    {
        text += "0" + date.getDate();
    }
    else
    {
        text += date.getDate();
    }

    // console.log(text);  
    return text;
}

// function that updates slider text
function updatePage()
{
    var totalValue = 0;
    var okres_value;
    var maximum_day;
    var minimum_day;
    var today = new Date();
    today.setDate(today.getDate() - Math.floor(days_since_covid - slider_current_values[0]) - 1);
    today = addDays(today, slider.value);
    slider_current_selected_date = today;
    var today_text = getFormattedDate(today);
    var today_text_local = getFormattedDateLocal(today);
    output.innerHTML = today.toLocaleDateString("cs-CZ");
    var parent = iframe.contentWindow.document.querySelector("g");
    var children = parent.children;
    mapa_celkem_nove_pripady.innerHTML = "<b>Nové případy za tento den:</b> " + numberWithCommas(new_data[today_text]['nove_celkovy_pocet']);
    mapa_celkem_aktivni_pripady.innerHTML = "<b>Současný počet případů za tento den:</b> " + numberWithCommas(new_data[today_text]['aktivni_celkovy_pocet']);
    mapa_celkem_pripady.innerHTML = "<b>Celkový počet zaznamenaných případů v tento den:</b> " + numberWithCommas(new_data[today_text]['celkem_pripady']);
    mapa_datum.innerHTML = today_text_local;
    for (let i = 0; i < 77; i++)
    {
        var okres_lau = children[i].getAttribute('okres_lau');
        switch(map_show_data)
        {
            case "Současně nakažení":
                okres_value = new_data[today_text][okres_lau]['aktivni_pripady_sto_tisic'].toFixed(2);
                totalValue += okres_value;
                maximum_day = new_data[today_text]['max_aktivni_sto_tisic'].toFixed(2);
                minimum_day = 0
                text_current_data_sto_tisic.innerHTML = "Současný počet nakažených na 100 tisíc obyvatel";
                text_current_data.innerHTML = "Současný počet nakažených";
                break;
            case "Nové případy":
                okres_value = new_data[today_text][okres_lau]['nove_pripady_sto_tisic'].toFixed(2);
                totalValue += okres_value;
                maximum_day = new_data[today_text]['max_nove_sto_tisic'].toFixed(2);
                minimum_day = 0
                text_current_data_sto_tisic.innerHTML = "Nový počet nakažených na 100 tisíc obyvatel";
                text_current_data.innerHTML = "Počet nově nakažených";
                break;
        }
        if (okres_clicked == okres_lau)
        {
            switch(map_show_data)
            {
                case "Současně nakažení":
                    okres_nakazeni.innerHTML = parseInt(new_data[today_text][okres_lau]['aktivni_pripady']);
                    break;
                case "Nové případy":
                    okres_nakazeni.innerHTML = parseInt(new_data[today_text][okres_lau]['nove_pripady']);
                    break;
            }
            okres_nakazeni_sto_tisic.innerHTML = okres_value;
            // okres_celkem_nakazeni.innerHTML = covid_data[today_text][okres_lau]['kumulativni_pocet_nakazenych'];
            // okres_celkem_vyleceni.innerHTML = covid_data[today_text][okres_lau]['kumulativni_pocet_vylecenych'];
            // okres_datum.innerHTML = getFormattedDateLocal(new Date(today_text));
        }
        var color1 = [255, 0, 0];
        var color2 = [0, 255, 0];
        switch(current_analysis)
        {
            case "nakazeni-analyze":
                color1 =   [255, 174, 0];
                color2 =   [255, 255, 255];
                break;
            case "vyleceni-analyze":
                color1 =   [0, 150, 0];
                color2 =   [255, 255, 255];
                break;
            case "umrti-analyze":
                color1 =   [30, 30, 30];
                color2 =   [255, 255, 255];
                break;
            case "ovlivneno-analyze":
                color1 =   [0, 0, 200];
                color2 =   [255, 255, 255];
                break;
        }
        // if (okres_value <= maximum_day)
        // {
            var min_max_difference = maximum_day - minimum_day;
            var w1 = (okres_value - minimum_day) / min_max_difference;
            // var w1 = okres_value / maximum_day;
            var w2 = 1 - w1;
            var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
                    Math.round(color1[1] * w1 + color2[1] * w2),
                    Math.round(color1[2] * w1 + color2[2] * w2)];
            // // console.log(rgb[0])
            var string = "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
            // // console.log(string);
            children[i].setAttribute("fill", string);
            // console.log(maximum_day);
        // }
        // else
        // {
        //     console.log("Okres value: " + okres_value);
        //     console.log("Maximum value: " + maximum_day);
        //     children[i].setAttribute("fill", "#FF0000");
        // }
    }
    // console.log(totalValue);
}

function selectAnalysis(id) 
{
    current_analysis = id;
    updatePage();
    analyze_fields.forEach((element) => 
    {
        if (element != id)
        {
            // var field = document.getElementById(element);
            // field.className = field.className.replace(" w3-show", "");
        }
        else
        {
            var field = document.getElementById(element);
            // if (field.className.indexOf("w3-show") == -1)
            // {
            //     field.className += " w3-show";
            // }
            var color = field.getAttribute('color');
            var background_color = field.getAttribute('background-color');
            // var page_background = document.getElementById("page-background");
            // var outer_page_background = document.getElementById("outer-page-background");
            // page_background.style.backgroundColor = background_color;
            // outer_page_background.style.backgroundColor = background_color;
            var outer_iframe = document.getElementById("outer-iframe");
            var inner_iframe = document.getElementById("inner-iframe");
            var outer_iframe_current_color = outer_iframe.getAttribute('color');
            var inner_iframe_current_color = inner_iframe.getAttribute('color');
            outer_iframe.className = outer_iframe.className.replace(outer_iframe_current_color, color);
            inner_iframe.className = inner_iframe.className.replace(inner_iframe_current_color, color);
            outer_iframe.setAttribute("color", color);
            inner_iframe.setAttribute("color", color);
            switch(element)
            {
                case 'nakazeni-analyze':
                    document.getElementById("nakazeni-analyze").style.opacity = 1;
                    document.getElementById("vyleceni-analyze").style.opacity = 0.6;
                    document.getElementById("umrti-analyze").style.opacity = 0.6;
                    document.getElementById("ovlivneno-analyze").style.opacity = 0.6;
                    document.getElementsByClassName("noUi-connect")[0].style.background = "#ff9800";
                    // document.getElementById("slider").style.accentColor = "#ff9800";
                    // document.getElementById("slider").style.backgroundColor = "#ffffff";
                    break;
                case 'vyleceni-analyze':
                    document.getElementById("nakazeni-analyze").style.opacity = 0.6;
                    document.getElementById("vyleceni-analyze").style.opacity = 1;
                    document.getElementById("umrti-analyze").style.opacity = 0.6;
                    document.getElementById("ovlivneno-analyze").style.opacity = 0.6;
                    document.getElementsByClassName("noUi-connect")[0].style.background = "#4caf50";
                    // document.getElementById("slider").style.accentColor = "#4caf50";
                    // document.getElementById("slider").style.background = "#ffffff";
                    break;
                case 'umrti-analyze':
                    document.getElementById("nakazeni-analyze").style.opacity = 0.6;
                    document.getElementById("vyleceni-analyze").style.opacity = 0.6;
                    document.getElementById("umrti-analyze").style.opacity = 1;
                    document.getElementById("ovlivneno-analyze").style.opacity = 0.6;
                    document.getElementsByClassName("noUi-connect")[0].style.background = "#616161";
                    // document.getElementById("slider").style.accentColor = "#616161";
                    // document.getElementById("slider").style.background = "#ffffff";
                    break;
                case 'ovlivneno-analyze':
                    document.getElementById("nakazeni-analyze").style.opacity = 0.6;
                    document.getElementById("vyleceni-analyze").style.opacity = 0.6;
                    document.getElementById("umrti-analyze").style.opacity = 0.6;
                    document.getElementById("ovlivneno-analyze").style.opacity = 1;
                    document.getElementsByClassName("noUi-connect")[0].style.background = "#00bcd4";
                    // document.getElementById("slider").style.accentColor = "#00bcd4";
                    // document.getElementById("slider").style.background = "#ffffff";
                    break;
            }
        }
    })
  }

function loadTimeFrameSlider()
{
    var today = new Date();
    var covid_start = new Date("03/01/2020"); 
    var difference = today.getTime() - covid_start.getTime();
    days_since_covid = difference / (1000 * 3600 * 24);
    slider_values = [];
    for (var i = 0; i < days_since_covid; i++)
    {
        slider_values[i] = i+1;
    }
    var valuesSlider = document.getElementById('values-slider');
    var snapValues = [
        document.getElementById('slider-min'),
        document.getElementById('slider-max')
    ];
    var valuesForSlider = slider_values;
    var format = {
        to: function(value) {
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
        var today = new Date();
        switch (slider_current_type)
        {
            case "Den":
                today.setDate(today.getDate() - (slider_values.length - values[handle]));
                break;
            case "Týden":
                today.setDate(today.getDate() - (slider_values.length - (values[handle] * 7)));
                break;
            case "Měsíc":
                today.setDate(today.getDate() - (slider_values.length - (values[handle] * 30)));
                break;
            case "Rok":
                break;
        }
        var today_text = getFormattedDateLocal(today);
        snapValues[handle].innerHTML = today_text;
        slider_current_values[handle] = values[handle];
    });
}

function loadSlider2()
{
    var today = new Date();
    var covid_start = new Date("03/01/2020"); 
    var difference = today.getTime() - covid_start.getTime();
    days_since_covid = difference / (1000 * 3600 * 24);
    slider_values = [];
    for (var i = 0; i < days_since_covid; i++)
    {
        slider_values[i] = i+1;
    }
    var valuesSlider = document.getElementById('values-slider-2');
    var snapValues = [
        document.getElementById('slider-min'),
        document.getElementById('slider-max')
    ];
    var valuesForSlider = slider_values;
    var format = {
        to: function(value) {
            return valuesForSlider[Math.round(value)];
        },
        from: function (value) {
            return valuesForSlider.indexOf(Number(value));
        }
    };
    noUiSlider.create(valuesSlider, {
        start: [8],
        // A linear range from 0 to 15 (16 values)
        range: { min: 0, max: valuesForSlider.length - 2 },
        connect: [false, true, false],
        // steps of 1
        step: 1,
        format: format
    });
    valuesSlider.noUiSlider.set(['7', '28']);
    valuesSlider.noUiSlider.on('update', function (values, handle) {
        var today = new Date();
        switch (slider_current_type)
        {
            case "Den":
                today.setDate(today.getDate() - (slider_values.length - values[handle]));
                break;
            case "Týden":
                today.setDate(today.getDate() - (slider_values.length - (values[handle] * 7)));
                break;
            case "Měsíc":
                today.setDate(today.getDate() - (slider_values.length - (values[handle] * 30)));
                break;
            case "Rok":
                break;
        }
        var today_text = getFormattedDateLocal(today);
        snapValues[handle].innerHTML = today_text;
        slider_current_values[handle] = values[handle];
    });
}

function selectSliderType(value)
{
    var valuesSlider = document.getElementById('values-slider');
    slider_current_type = value;

    switch (value)
    {
        case "Den":
            valuesSlider.noUiSlider.updateOptions({
                range:
                {
                    min: 0,
                    max: days_since_covid
                }
            });
            break;
        case "Týden":
            valuesSlider.noUiSlider.updateOptions({
                range:
                {
                    min: 0,
                    max: days_since_covid / 7
                }
            });
            break;
        case "Měsíc":
            valuesSlider.noUiSlider.updateOptions({
                range:
                {
                    min: 0,
                    max: days_since_covid / 30
                }
            });
            break;
        case "Rok":
            break;
    }
}

function selectSliderData(value)
{
    map_show_data = value;
    updatePage();
    switch (value)
    {
        case "Den":
            break;
        case "Týden":
            break;
    }
}

function confirmRangeAnalysis()
{
    var value_min = new Date();
    var value_max = new Date();
    switch (slider_current_type)
    {
        case "Den":
            value_min.setDate(value_min.getDate() - (slider_values.length - slider_current_values[0]));
            value_max.setDate(value_max.getDate() - (slider_values.length - slider_current_values[1]));
            break;
        case "Týden":
            value_min.setDate(value_min.getDate() - (slider_values.length - (slider_current_values[0] * 7)));
            value_max.setDate(value_max.getDate() - (slider_values.length - (slider_current_values[1] * 7)));
            break;
        case "Měsíc":
            value_min.setDate(value_min.getDate() - (slider_values.length - (slider_current_values[0] * 30)));
            value_max.setDate(value_max.getDate() - (slider_values.length - (slider_current_values[1] * 30)));
            break;
        case "Rok":
            break;
    }
    slider.setAttribute("min", 0);
    slider.setAttribute("max", slider_current_values[1] - slider_current_values[0]);
    slider.value = "0";
    var url = "http://127.0.0.1:8000/api/range/days/from=" + getFormattedDate(value_min) + "&to=" + getFormattedDate(value_max);
    toast("Stahuji nová data...");
    $.ajax({
        url: url,
        headers: { 'accept': 'application/json' },
        type: "GET",
        success: function(result)
        {
            processGetDataFromSlider(result);
        },
        error: function(error)
        {
            console.log(error);
        }
    })
}

function processGetDataFromSlider(result)
{
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
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
  }

function sliderDateChange(value)
{
    var curr = parseInt(slider.value);
    slider.value = curr + value;
    updatePage();
}