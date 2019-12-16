function makeMap(earthquake, tectonicplates) {
	console.log(earthquake);
	console.log(tectonicplates);

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
		"Fault Lines": tectonicplates,
		"Earthquakes": earthquake
	};


	var map = L.map("map", {
		center: [40.73, -74.0059],
		zoom: 3,
		layers: [satellite, earthquake]
	});


	L.control.layers(baseMaps, overlayMaps, {
		collapsed: true
	}).addTo(map);

}

function makeEarthquake(url) {
	var earthquakeMarkers = [];
	d3.json(url, function(data) {
		var features = data.features;
		
		for (var index = 0; index < features.length; index++) {
			var feature = features[index];

			var marker = L.circle([feature.geometry.coordinates[0], feature.geometry.coordinates[1]], {
				color: 'black',
				fillColor: getColor(feature.properties.mag),
				fillOpacity: 0.5,
				radius: feature.properties.mag * 10
			})
			.bindPopup("<h3>" + feature.title + "</h3>");

			earthquakeMarkers.push(marker);
		}

		
	});
	// console.log(earthquakeMarkers);
	return earthquakeMarkers;
}



function makePlates(url) {
	var tectonicMarkers = [];
	d3.json(url, function(data) {
		var features = data.features;
		
		for (var index = 0; index < features.length; index++) {
			var latlngs = features[index].geometry.coordinates;
			var polyline = L.polyline(latlngs, {color: 'red'});
			tectonicMarkers.push(polyline);
			
		}
	})
	// console.log(tectonicMarkers);
	return tectonicMarkers;

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
var earthquakes2 = makeEarthquake(link1);
console.log(earthquakes2);
var tectonicplates2 = makePlates(link2);
console.log(tectonicplates2);
var earthquakes = L.layerGroup([makeEarthquake(link1)]);
console.log(earthquakes);
var tectonicplates = L.layerGroup([makePlates(link2)]);
console.log(tectonicplates);
makeMap(earthquakes, tectonicplates); 

