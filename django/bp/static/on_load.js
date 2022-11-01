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

// Initialize and modify webpage on startup
function onIframeLoad()
{
    loadSlider();
    loadCovidData();
}

function initPage()
{
    // var sliders = document.querySelectorAll('.min-max-slider');
    // sliders.forEach( function(slider) {
    //     init(slider);
    // });
    slider = document.getElementById("slider");
    output = document.getElementById("slider_text");
    slider.oninput = sliderTextUpdate;
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
        children[i].setAttribute("fill-opacity", 0.5);
        children[i].setAttribute("fill", "#000000");
        children[i].setAttribute("stroke-width", 0.5);
        children[i].setAttribute("name", okresy_names[i][1]);
        children[i].setAttribute("okres_lau", okresy_names[i][0]);
        children[i].addEventListener('click', function(){
            onClickMap(this.getAttribute('name'), this.getAttribute('okres_lau'), this);
            okres_clicked_map_object = i;
        });
    }
    sliderTextUpdate();
    console.log(new_data);
}

function loadCovidData()
{
    var today = new Date();
    today.setDate(today.getDate() - 30);
    var today_text = today.getDate()  + "-" + (today.getMonth()+1) + "-" + today.getFullYear();

    url = "https://onemocneni-aktualne.mzcr.cz/api/v3/kraj-okres-nakazeni-vyleceni-umrti?itemsPerPage=100000&datum%5Bafter%5D=" + today_text + "&apiToken=c54d8c7d54a31d016d8f3c156b98682a";
    console.log(url);
    $.ajax({
        url: url,
        headers: { 'accept': 'application/json' },
        type: "GET",
        success: function(result)
        {
            processCovidData(result);
        },
        error: function(error)
        {
            console.log(error);
        }
    })

    // url2 = "https://onemocneni-aktualne.mzcr.cz/api/v3/zakladni-prehled?page=1&itemsPerPage=100&apiToken=c54d8c7d54a31d016d8f3c156b98682a";
    // // console.log(url);
    // $.ajax({
    //     url: url2,
    //     headers: { 'accept': 'application/json' },
    //     type: "GET",
    //     success: function(result)
    //     {
    //         processCovidDataSummary(result);
    //     },
    //     error: function(error)
    //     {
    //         console.log(error);
    //     }
    // })
}

// click function - AJAX request
function onClickMap(name, okres_lau, object)
{
    if (okres_clicked_map_object != -1)
    {
        iframe.contentWindow.document.querySelector("g").children[okres_clicked_map_object].setAttribute("stroke-width", 0.5);
    }
    object.setAttribute("stroke-width", 4.5);
    okres_clicked = okres_lau;
    var today = new Date();
    today.setDate(today.getDate() - 1);
    today = addDays(today, slider.value - 30);
    var today_text = getFormattedDate(today);

    url = "https://onemocneni-aktualne.mzcr.cz/api/v3/kraj-okres-nakazeni-vyleceni-umrti?page=1&itemsPerPage=100&datum%5Bafter%5D=" + today_text + "&okres_lau_kod=" + okres_lau + "&apiToken=c54d8c7d54a31d016d8f3c156b98682a";
    console.log(url);
    $.ajax({
        url: url,
        headers: { 'accept': 'application/json' },
        type: "GET",
        success: function(result)
        {
            processGetData(result, name, okres_lau, today_text);
        },
        error: function(error)
        {
            console.log(error);
        }
    })
}

// process data returned by AJAX by page load - summary
function processCovidDataSummary(result)
{
    // summary_nakazeni = document.getElementById("summary_nakazeni");
    // summary_vyleceni = document.getElementById("summary_vyleceni");
    // summary_umrti = document.getElementById("summary_umrti");
    // summary_obyvatel = document.getElementById("summary_obyvatel");
    // covid_summary = result[0];
    // summary_nakazeni.innerHTML = covid_summary['aktivni_pripady'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
    // summary_vyleceni.innerHTML = covid_summary['vyleceni'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
    // summary_umrti.innerHTML = covid_summary['umrti'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
    // summary_obyvatel.innerHTML = covid_summary['potvrzene_pripady_celkem'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
}

// process data returned by AJAX by page load - data
function processCovidData(result)
{
    // format all data into one big dictionary
    result.forEach(element => {
        if (!covid_data[element['datum']])
        {
            covid_data[element['datum']] = {};
        };
        covid_data[element['datum']][element['okres_lau_kod']] = 
            {"kumulativni_pocet_nakazenych": element['kumulativni_pocet_nakazenych'],
             "kumulativni_pocet_vylecenych": element['kumulativni_pocet_vylecenych'],
             "kumulativni_pocet_umrti": element['kumulativni_pocet_umrti'],
             "soucesny_pocet_nakazenych": element['kumulativni_pocet_nakazenych'] - element['kumulativni_pocet_vylecenych']};
    }
    );

    // save all maximums for each day
    for (var key in covid_data){
        var max = 0;
        var min = Number.MAX_SAFE_INTEGER;
        for ([okres, values] of Object.entries(covid_data[key]))
        {
            // console.log(okres);
            pocet = covid_data[key][okres]['soucesny_pocet_nakazenych'];
            if (pocet > max)
            {
                max = pocet;
            }
            if (pocet < min && pocet >= 0)
            {
                min = pocet;
            }
        }
        covid_data_days_max[key] = max;
        covid_data_days_min[key] = min;
    }

    // console.log(covid_data);
    // console.log(covid_data_days_max);
    initPage();
}

// process data returned by AJAX by click
function processGetData(result, name, okres_lau, today_text)
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
    // console.log(result);
    nakazenych = result[0]['kumulativni_pocet_nakazenych'] - result[0]['kumulativni_pocet_vylecenych'];

    okres_nazev.innerHTML = name;
    okres_kod.innerHTML = okres_lau;
    okres_nakazeni.innerHTML = new_data[today_text][okres_lau]['nove_pripady'];
    okres_nakazeni_sto_tisic.innerHTML = new_data[today_text][okres_lau]['nove_pripady_sto_tisic'].toFixed(2);
    okres_celkem_nakazeni.innerHTML = result[0]['kumulativni_pocet_nakazenych'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    okres_celkem_vyleceni.innerHTML = result[0]['kumulativni_pocet_vylecenych'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    okres_datum.innerHTML = getFormattedDateLocal(new Date(result[0]['datum']));
    okres_pocet_obyvatel.innerHTML = okresy_pocet_obyvatel[result[0]['okres_lau_kod']].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    okres_pocet_obyvatel_procento.innerHTML = ((parseFloat(result[0]['kumulativni_pocet_nakazenych']) / parseFloat(okresy_pocet_obyvatel[result[0]['okres_lau_kod']])) * 100).toFixed(2) + "%";

    // old
    // text.innerHTML = "<b>Název okresu:</b> " + name + "<br>" + "<b>LAU kód okresu:</b> " + result[0]['okres_lau_kod'] + "<br>" + "<b>Současný počet nakažených:</b> " + nakazenych
    // + "<br>" + "<b>Kumulativní počet nakažených:</b> " + result[0]['kumulativni_pocet_nakazenych']
    // + "<br>" + "<b>Kumulativní počet vyléčených:</b> " + result[0]['kumulativni_pocet_vylecenych']
    // + "<br>" + "<b>Datum: </b> " + getFormattedDateLocal(new Date(result[0]['datum']));
}

// Sleep function
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

// handle animation button
async function handleAnimation()
{
    var max_value = parseInt(slider.getAttribute('max'));
    var current_value = parseInt(slider.value);
    for (var cur = current_value; cur < max_value; cur++)
    {
        slider.value = cur + 1;
        sliderTextUpdate();
        await sleep(250);
    }
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

function getFormattedDateLocal(date)
{
    return date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(); 
}

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
function sliderTextUpdate()
{
    var totalValue = 0;
    var today = new Date();
    today.setDate(today.getDate() - 1);
    today = addDays(today, slider.value - 30);
    var today_text = getFormattedDate(today);
    output.innerHTML = today.toLocaleDateString("cs-CZ");
    var parent = iframe.contentWindow.document.querySelector("g");
    var children = parent.children;
    for (let i = 0; i < 77; i++)
    {
        var okres_lau = children[i].getAttribute('okres_lau');
        var okres_value = new_data[today_text][okres_lau]['nove_pripady_sto_tisic'].toFixed(2);
        totalValue += okres_value;
        var maximum_day = new_data[today_text]['max_nove_sto_tisic'].toFixed(2);
        var minimum_day = new_data[today_text]['min_nove_sto_tisic'];
        if (okres_clicked == okres_lau)
        {
            okres_nakazeni_sto_tisic.innerHTML = okres_value;
            okres_nakazeni.innerHTML = parseInt(new_data[today_text][okres_lau]['nove_pripady']);
            // okres_celkem_nakazeni.innerHTML = covid_data[today_text][okres_lau]['kumulativni_pocet_nakazenych'];
            // okres_celkem_vyleceni.innerHTML = covid_data[today_text][okres_lau]['kumulativni_pocet_vylecenych'];
            okres_datum.innerHTML = getFormattedDateLocal(new Date(today_text));
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
    sliderTextUpdate();
    analyze_fields.forEach((element) => 
    {
        if (element != id)
        {
            var field = document.getElementById(element);
            field.className = field.className.replace(" w3-show", "");
        }
        else
        {
            var field = document.getElementById(element);
            if (field.className.indexOf("w3-show") == -1)
            {
                field.className += " w3-show";
            }
            var color = field.getAttribute('color');
            var background_color = field.getAttribute('background-color');
            var page_background = document.getElementById("page-background");
            var outer_page_background = document.getElementById("outer-page-background");
            page_background.style.backgroundColor = background_color;
            outer_page_background.style.backgroundColor = background_color;
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
                    document.getElementById("quarter-1").style.opacity = 1;
                    document.getElementById("quarter-2").style.opacity = 0.6;
                    document.getElementById("quarter-3").style.opacity = 0.6;
                    document.getElementById("quarter-4").style.opacity = 0.6;
                    break;
                case 'vyleceni-analyze':
                    document.getElementById("quarter-1").style.opacity = 0.6;
                    document.getElementById("quarter-2").style.opacity = 1;
                    document.getElementById("quarter-3").style.opacity = 0.6;
                    document.getElementById("quarter-4").style.opacity = 0.6;
                    break;
                case 'umrti-analyze':
                    document.getElementById("quarter-1").style.opacity = 0.6;
                    document.getElementById("quarter-2").style.opacity = 0.6;
                    document.getElementById("quarter-3").style.opacity = 1;
                    document.getElementById("quarter-4").style.opacity = 0.6;
                    break;
                case 'ovlivneno-analyze':
                    document.getElementById("quarter-1").style.opacity = 0.6;
                    document.getElementById("quarter-2").style.opacity = 0.6;
                    document.getElementById("quarter-3").style.opacity = 0.6;
                    document.getElementById("quarter-4").style.opacity = 1;
                    break;
            }
        }
    })
  }

function loadSlider()
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
        range: { min: 0, max: valuesForSlider.length - 1 },
        connect: [false, true, false],
        // steps of 1
        step: 1,
        format: format
    });
    valuesSlider.noUiSlider.set(['7', '28']);
    // valuesSlider.noUiSlider.updateOptions({
    //     range:
    //     {
    //         min: 5,
    //         max: 10
    //     }
    // });
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