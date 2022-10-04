var slider;
var output;
var mydata = JSON.parse(data);
console.log(mydata);

// Initialize and modify webpage on startup
function onIframeLoad()
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
        children[i].setAttribute("fill-opacity", 0.7);
        children[i].setAttribute("fill", "#000000");
        children[i].setAttribute("stroke-width", 0.5);
        children[i].setAttribute("name", mydata[i][1]);
        children[i].setAttribute("okres_lau", mydata[i][0]);
        children[i].addEventListener('click', function(){
            onClickMap(this.getAttribute('name'), this.getAttribute('okres_lau'));
        });
    }
    sliderTextUpdate();
}

// click function - AJAX request
function onClickMap(name, okres_lau)
{
    var today = new Date();
    today.setDate(today.getDate() - 1);
    var today_text = today.getDate()  + "-" + (today.getMonth()+1) + "-" + today.getFullYear();

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

// process data returned by AJAX
function processGetData(result, name)
{
    text = document.getElementById("okres_info");
    // console.log(result);
    nakazenych = result[0]['kumulativni_pocet_nakazenych'] - result[0]['kumulativni_pocet_vylecenych']
    text.innerHTML = "Název okresu: " + name + "<br>" + "LAU kód okresu: " + result[0]['okres_lau_kod'] + "<br>" + "Současný počet nakažených: " + nakazenych
    + "<br>" + "Kumulativní počet nakažených: " + result[0]['kumulativni_pocet_nakazenych']
    + "<br>" + "Kumulativní počet vyléčených: " + result[0]['kumulativni_pocet_vylecenych'];
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

// function that updates slider text
function sliderTextUpdate()
{
    var today = new Date();
    today = addDays(today, slider.value - 7);
    output.innerHTML = today.toLocaleDateString("cs-CZ");
    var parent = iframe.contentWindow.document.querySelector("g");
    var children = parent.children;
    for (let i = 0; i < 77; i++)
    {
        var color1 = [0, 209, 35];
        var color2 = [209, 52, 0];
        var w1 = Math.random();
        var w2 = 1 - w1;
        var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
                   Math.round(color1[1] * w1 + color2[1] * w2),
                   Math.round(color1[2] * w1 + color2[2] * w2)];
        // console.log(rgb[0])
        var string = "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[1]);
        // console.log(string);
        children[i].setAttribute("fill", string);
    }
}