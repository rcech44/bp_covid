#import folium
import folium
import json
from branca.element import JavascriptLink, Div
from urllib.request import urlopen

#Creaate a map object for choropleth map
#Set location to your location of interest (latitude and longitude )
map0 = folium.Map(location=[50, 14], zoom_start=7)
with urlopen('https://gist.githubusercontent.com/carmoreira/deb0b3a5c101d1b2a47600ab225be262/raw/cb139cf24eb933b4694d07fd8bd0e979cca54d28/distictsCzechiaLow.json') as response:
    geo_taiwan = json.load(response)


#Create choropleth map object with key on TOWNNAME
folium.Choropleth(geo_data = geo_taiwan,#Assign geo_data to your geojson file
    name = "choropleth",
    # data = Dataset,#Assign dataset of interest
    columns = ["City/County","Population"],#Assign columns in the dataset for plotting
    key_on = 'feature.properties.name',#Assign the key that geojson uses to connect with dataset
    fill_color = 'YlOrRd',
    fill_opacity = 0.7,
    line_opacity = 0.5,
    legend_name = 'Taiwan').add_to(map0)

#Create style_function
style_function = lambda x: {'fillColor': '#000000', 
                            'color':'#000000', 
                            'fillOpacity': 0.5, 
                            'weight': 0.5}

# #Create highlight_function
# highlight_function = lambda x: {'fillColor': '#000000', 
#                                 'color':'#000000', 
#                                 'fillOpacity': 0.50, 
#                                 'weight': 0.1}

#Create popup tooltip object
NIL = folium.features.GeoJson(
    geo_taiwan,
    style_function=style_function, 
    control=False,
    tooltip=folium.features.GeoJsonTooltip(
        fields=['name'],
        aliases=['Okres'],
        style=("background-color: white; color: #333333; font-family: arial; font-size: 12px; padding: 10px;")),
    popup=folium.features.GeoJsonPopup(
        fields=['name'],
        aliases=['Okres'],
        style=("background-color: rgba(255, 255, 255, 0); color: #333333; font-family: arial; font-size: 12px; padding: 10px;"))
    )

# div = folium.features.DivIcon(
#     html="<div class=\"text-block\"><h4>Nature</h4><p>What a beautiful sunrise</p></div>"
# )

#Add tooltip object to the map
map0.add_child(NIL)
# map0.add_child(div)
# map0.keep_in_front(NIL)
folium.LayerControl().add_to(map0)
# map0.get_root().html.add_child(JavascriptLink('./on_load.js'))

map0.save('index_test.html')