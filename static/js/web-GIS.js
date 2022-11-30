//Full screen view
var mapId = document.getElementById('map');

// Measure the distance
L.control.measure()

//search bar
L.Control.geocoder().addTo(map);

// Print Map
L.control.browserPrint({position: 'topright'}).addTo(map);

// my location
L.control.locate({
    drawCircle: false,
    position: 'topright',
  }).addTo(map);


// Full screen view
map.addControl(new L.Control.Fullscreen({position: 'topright'}));