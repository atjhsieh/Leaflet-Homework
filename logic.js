// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5
  });
  
myMap.addLayer(streetmap);
// myMap.addLayer(darkmap);


d3.json(queryUrl, function(data) {
  geojson = L.geoJSON(data.features,
    {pointToLayer: function(feature, latlng) {
      var cirColor = "";
      if (feature.properties.mag > 5) {
        cirColor = "red";
      }
      else if (feature.properties.mag > 4) {
        cirColor = "darkorange";
      }
      else if (feature.properties.mag > 3) {
        cirColor = "orange";
      }
      else if (feature.properties.mag > 2) {
        cirColor = "gold";
      }
      else if (feature.properties.mag > 1) {
        cirColor = "yellow";
      }
      else {
        cirColor = "lightgreen";
      };
      var styleCircle = {
        radius: feature.properties.mag*5,
        fillColor: cirColor,
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
      return L.circleMarker(latlng,styleCircle);
    },
    onEachFeature: function onEachFeature(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
              "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
  
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend');
    var limits = [0,1,2,3,4,5];
      var colors = ["red","darkorange","orange","gold","yellow","lightgreen"];
      var lab = ["0-1","1-2","2-3","3-4","4-5","5+"];
      var labels = [];

    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>"
      + lab[index]
      );
    });
    div.innerHTML  += labels.join("");
    return div;
  };
  legend.addTo(myMap);
})
