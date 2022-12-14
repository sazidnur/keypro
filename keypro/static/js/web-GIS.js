//Full screen view
var mapId = document.getElementById('map');

// Measure the distance
L.control.measure()

//search bar
L.Control.geocoder().addTo(map);

// Print Map
L.control.browserPrint({position: 'topright'}).addTo(map);

// go to my location
$('.go-my-location').click(function(){
    map.setView([62.6010, 29.7636], 16);
})

// my location
L.control.locate({
    drawCircle: false,
    position: 'topright',
  }).addTo(map);


// Full screen view
map.addControl(new L.Control.Fullscreen({position: 'topright'}));