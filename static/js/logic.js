// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
//  Perform a GET request to the query URL/
d3.json(queryUrl).then(function(data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});


  
function createFeatures(earthquakeData) {

  function onEachFeature(features, layer){
    layer.bindPopup(`<h3>${features.properties.place}</h3><hr><p>${new Date(features.properties.time)}</p><h3>Mag: ${features.properties.mag}</h3>`);};

    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function(features, latlng) {
        var depth = features.geometry.coordinates[2];
        var circleMarkerOptions = {
            radius: features.properties.mag*5,
            weight: 1,
            fillColor: markerColor(depth),
            opacity: 0.2,
          	fillOpacity: 0.7
        };
        return L.circleMarker(latlng, circleMarkerOptions);
    }
    });
  createMap(earthquakes);
};
  
// A function to determine the marker color based on Earthquake's depth
// There's probably a smarter / harder way to do this 
function markerColor(depth) {
    let color = ""
    if (depth <= 10) {
        return color = "#593976"
    }
    else if (depth <= 20) {
        return color = "#7F329A"
    }
    else if (depth <= 30) {
        return color = "#A92BB3"
    }
    else if (depth <= 40) {
        return color = "#D01BB7"
    }
    else {
        return color = "#DF1B88"
    }
}; 


function createMap(earthquakes) {
// Create the base layers.
    let world = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
  
    // Create a baseMaps object.
    let baseMaps = {
        "World Map": world,
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };
  
    // Create our map, giving it the world map and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 4,
        layers: [world, earthquakes]
    });
  
    // control layer
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    
// Thank you Google, random European coder, JSFiddle and Stack Overflow
var legend = L.control({ position: "bottomright" });

legend.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Legend</h4>";
  div.innerHTML += '<i style="background: #593976"></i><span>Depth <= 10</span><br>';
  div.innerHTML += '<i style="background: #7F329A"></i><span>Depth <= 20</span><br>';
  div.innerHTML += '<i style="background: #A92BB3"></i><span>Depth <= 30</span><br>';
  div.innerHTML += '<i style="background: #D01BB7"></i><span>Depth <= 40</span><br>';
  div.innerHTML += '<i style="background: #DF1B88"></i><span>Depth > 40</span><br>';
  return div;
};

legend.addTo(myMap);
    
};