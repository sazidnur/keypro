

var map = L.map('map').setView([62.6010, 29.7636], 15);
map.zoomControl.setPosition('topright')

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 4,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    minZoom: 4,
    maxZoom: 17,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Map Scale
L.control.scale().addTo(map)


// Map coordinates display
map.on('mousemove', function (coordinates) {
    $('.coordinates').html(`Lat: ${coordinates.latlng.lat} Lng: ${coordinates.latlng.lng}`)
})


var cluster = L.markerClusterGroup({disableClusteringAtZoom: 15})
cluster.addTo(map)

var baseMaps = {
    'Street View': osm,
    'Satelite View': satelite
}

var overLayMaps = {
    'Marker': cluster
}

L.control.layers(baseMaps, overLayMaps, { position: 'bottomright' }).addTo(map)
