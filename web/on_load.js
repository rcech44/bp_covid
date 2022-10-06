var slider;
var output;
var okresy_names = JSON.parse(data);
var covid_data = {};
var covid_data_days_max = {};
var covid_data_days_min = {};
// console.log(okresy_names);

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
}

// click function - AJAX request
function onClickMap(name, okres_lau)
{
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

// process data returned by AJAX by page load
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
    text = document.getElementById("okres_info");
    // console.log(result);
    nakazenych = result[0]['kumulativni_pocet_nakazenych'] - result[0]['kumulativni_pocet_vylecenych']
    text.innerHTML = "<b>Název okresu:</b> " + name + "<br>" + "<b>LAU kód okresu:</b> " + result[0]['okres_lau_kod'] + "<br>" + "<b>Současný počet nakažených:</b> " + nakazenych
    + "<br>" + "<b>Kumulativní počet nakažených:</b> " + result[0]['kumulativni_pocet_nakazenych']
    + "<br>" + "<b>Kumulativní počet vyléčených:</b> " + result[0]['kumulativni_pocet_vylecenych']
    + "<br>" + "<b>Datum: </b> " + result[0]['datum'];
}

// Sleep function
// https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

// handle animation button
function handleAnimation()
{
    var max_value = parseInt(slider.getAttribute('max'));
    var current_value = parseInt(slider.value);
    // console.log("Current: " + current_value);
    // console.log("Max: " + max_value);
    console.log("current_value: " + slider.value + " | max_value: " + slider.getAttribute('max'));
    console.log(current_value < max_value);
    for (var cur = current_value; cur < max_value; cur++)
    {
        slider.value = cur + 1;
        console.log("Changed from " + cur + " to " + slider.value);
        sliderTextUpdate();
        // await sleep(250);
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
        // if (okres_lau == "CZ0100")
        // {
        //     console.log("Maximum per day: " + maximum_day);
        //     console.log("Minimum per day: " + minimum_day);
        //     console.log("Okres: " + okres_value);
        // }
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