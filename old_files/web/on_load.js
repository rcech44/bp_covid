var slider;
var output;
var summary_nakazeni;
var summary_vyleceni;
var summary_umrti;
var summary_obyvatel;
var okres_nazev;
var okres_kod;
var okres_nakazeni;
var okres_celkem_nakazeni;
var okres_celkem_vyleceni;
var okres_datum;
var nakazenych;
var okresy_names = JSON.parse(data);
var covid_data = {};
var covid_data_days_max = {};
var covid_data_days_min = {};
var covid_summary = {};
var okres_clicked = "";

// Initialize and modify webpage on startup
function onIframeLoad()
{
    loadCovidData();
}

function initPage()
{
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
            onClickMap(this.getAttribute('name'), this.getAttribute('okres_lau'));
        });
    }
    sliderTextUpdate();
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

    url2 = "https://onemocneni-aktualne.mzcr.cz/api/v3/zakladni-prehled?page=1&itemsPerPage=100&apiToken=c54d8c7d54a31d016d8f3c156b98682a";
    // console.log(url);
    $.ajax({
        url: url2,
        headers: { 'accept': 'application/json' },
        type: "GET",
        success: function(result)
        {
            processCovidDataSummary(result);
        },
        error: function(error)
        {
            console.log(error);
        }
    })
}

// click function - AJAX request
function onClickMap(name, okres_lau)
{
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
            processGetData(result, name);
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
    summary_nakazeni = document.getElementById("summary_nakazeni");
    summary_vyleceni = document.getElementById("summary_vyleceni");
    summary_umrti = document.getElementById("summary_umrti");
    summary_obyvatel = document.getElementById("summary_obyvatel");
    covid_summary = result[0];
    summary_nakazeni.innerHTML = covid_summary['aktivni_pripady'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
    summary_vyleceni.innerHTML = covid_summary['vyleceni'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
    summary_umrti.innerHTML = covid_summary['umrti'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
    summary_obyvatel.innerHTML = covid_summary['potvrzene_pripady_celkem'].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
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
function processGetData(result, name)
{
    okres_nazev = document.getElementById("text_okres_nazev");
    okres_kod = document.getElementById("text_okres_kod");
    okres_nakazeni = document.getElementById("text_okres_nakazeni");
    okres_celkem_nakazeni = document.getElementById("text_okres_celkem_nakazeni");
    okres_celkem_vyleceni = document.getElementById("text_okres_celkem_vyleceni");
    okres_datum = document.getElementById("text_okres_datum");
    // console.log(result);
    nakazenych = result[0]['kumulativni_pocet_nakazenych'] - result[0]['kumulativni_pocet_vylecenych'];

    okres_nazev.innerHTML = name;
    okres_kod.innerHTML = result[0]['okres_lau_kod'];
    okres_nakazeni.innerHTML = nakazenych;
    okres_celkem_nakazeni.innerHTML = result[0]['kumulativni_pocet_nakazenych'];
    okres_celkem_vyleceni.innerHTML = result[0]['kumulativni_pocet_vylecenych'];
    okres_datum.innerHTML = getFormattedDateLocal(new Date(result[0]['datum']));

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
        var okres_value = covid_data[today_text][okres_lau]['soucesny_pocet_nakazenych'];
        var maximum_day = covid_data_days_max[today_text];
        var minimum_day = covid_data_days_min[today_text];
        if (okres_clicked == okres_lau)
        {
            okres_nakazeni.innerHTML = parseInt(covid_data[today_text][okres_lau]['kumulativni_pocet_nakazenych']) - parseInt(covid_data[today_text][okres_lau]['kumulativni_pocet_vylecenych']);
            okres_celkem_nakazeni.innerHTML = covid_data[today_text][okres_lau]['kumulativni_pocet_nakazenych'];
            okres_celkem_vyleceni.innerHTML = covid_data[today_text][okres_lau]['kumulativni_pocet_vylecenych'];
            okres_datum.innerHTML = today_text;
        }
        var color1 =   [255, 0, 0];
        var color2 =   [0, 255, 0];
        if (okres_value > 0)
        {
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
        }
        else
        {
            children[i].setAttribute("fill", "#00FF00");
        }
    }
}