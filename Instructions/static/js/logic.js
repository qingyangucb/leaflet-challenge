var tectonicplates_layer = new L.LayerGroup();
var earthquakes_layer = new L.LayerGroup();

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	maxZoom: 18,
	id: "mapbox.satellite",
	accessToken: API_KEY
});

var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	maxZoom: 18,
	id: "mapbox.dark",
	accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
	maxZoom: 18,
	id: "mapbox.outdoors",
	accessToken: API_KEY
});

var baseMaps = {
	"Satellite Map": satellite,
	"Grayscale Map": grayscale,
	"Ourdoors Map": outdoors
};

var overlayMaps = {
	"Fault Lines": tectonicplates_layer,
	"Earthquakes": earthquakes_layer
};


var map = L.map("map", {
	center: [40.73, -74.0059],
	zoom: 3,
	layers: [satellite, earthquakes_layer]
});


L.control.layers(baseMaps, overlayMaps, {
	collapsed: true
}).addTo(map);





function makeEarthquake(url) {
	
	d3.json(url, function(data) {
		var features = data.features;
		
		for (var index = 0; index < features.length; index++) {
			var feature = features[index];

			var marker = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
				color: 'black',
				fillColor: getColor(feature.properties.mag),
				fillOpacity: 0.5,
				radius: feature.properties.mag * 10
			})
			.bindPopup("<h3>" + feature.title + "</h3>")
			.addTo(earthquakes_layer);			
		}
		
	});
	// console.log(earthquakeMarkers);
	
}



function makePlates(url) {
	
	d3.json(url, function(data) {
      L.geoJson(data, {
        color: "red",
        weight: 2
      })
      .addTo(tectonicplates_layer);
	})
	// console.log(tectonicMarkers);
	

}

function getColor(d) {
	return d > 5  ? '#fc4a03' :
	d > 4  ? '#fc6f03' :
	d > 3  ? '#fc8403' :
	d > 2  ? '#fca503' :
	d > 1  ? '#fceb03' :
	'#bafc03';
}

var link1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
var link2 = "./static/data/PB2002_plates.json"
makeEarthquake(link1);
makePlates(link2);
earthquakes_layer.addTo(map);
tectonicplates_layer.addTo(map);

