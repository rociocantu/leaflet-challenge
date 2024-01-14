// Get earthquake data from USGS GeoJSON feed
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define a function to set marker size based on magnitude
function getMarkerSize(magnitude) {
  return magnitude * 4;
}

// Define a function to set marker color based on depth
function getMarkerColor(depth) {
  if (depth < 10) {
    return "#00ff00"; // green
  } else if (depth < 30) {
    return "#ffff00"; // yellow
  } else if (depth < 50) {
    return "#ff9900"; // orange
  } else if (depth < 70) {
    return "#ff6600"; // dark orange
  } else if (depth < 90) {
    return "#ff3300"; // red
  } else {
    return "#990000"; // dark red
  }
}

// Create Leaflet map centered on the United States
const map = L.map("map").setView([37.09, -95.71], 4);

// Add tile layer to map
const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  maxZoom: 18
});
tiles.addTo(map);

// Fetch earthquake data and add markers to the map
d3.json(url).then(function(data) {
  data.features.forEach(function(feature) {
    const coords = feature.geometry.coordinates;
    const mag = feature.properties.mag;
    const depth = coords[2];
    const markerSize = getMarkerSize(mag);
    const markerColor = getMarkerColor(depth);
    const marker = L.circleMarker([coords[1], coords[0]], {
      radius: markerSize,
      color: "#000",
      weight: 0.5,
      fillColor: markerColor,
      fillOpacity: 0.8
    }).addTo(map);
    marker.bindPopup(`<h3>${feature.properties.place}</h3><p>Magnitude: ${mag}<br>Depth: ${depth}</p>`);
  });
});

// Create a legend
const legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  const div = L.DomUtil.create("div", "info legend");
  const depths = [0, 10, 30, 50, 70, 90];
  const colors = ["#00ff00", "#ffff00", "#ff9900", "#ff6600", "#ff3300", "#990000"];
  for (let i = 0; i < depths.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(map);
