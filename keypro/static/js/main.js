

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


var cluster = L.markerClusterGroup({disableClusteringAtZoom: 16})
cluster.addTo(map)
// var markers = L.geoJSON(data, {

//     pointToLayer: function (feature, latlng) {

//         var marker = L.marker(latlng, {

//             title: "Resource Location",
//             alt: "Resource Location",
//             riseOnHover: true,
//             draggable: true,

//         }).bindPopup("<input type='button' value='Delete this marker' class='marker-delete-button'/>");
//         //$.get('https://nominatim.openstreetmap.org/search?format=json&q=' + latlng.lat + ',' + latlng.lng, function (gg) {
//           //  console.log(gg);
//        // });
//         marker.on("popupopen", onPopupOpen);

//         return marker;
//     }
// });
// console.log(markers)
//markers.addTo(cluster)
// cluster.addLayer(markers)
//cluster.addTo(map)
// layer control
var baseMaps = {
    'Street View': osm,
    'Satelite View': satelite
}

var overLayMaps = {
    'Marker': cluster
}

L.control.layers(baseMaps, overLayMaps, { position: 'bottomright' }).addTo(map)
// Add marker to map at click location
//var newMarker = new L.marker(e.latlng, {draggable: true}).addTo(map);
//newMarker.addTo(cluster).bindPopup("<input type='button' value='Delete this marker' class='marker-delete-button'/>")
// map.on('click', function addMarker(e) {
//     var geojsonFeature = {
//         "type": "Feature",
//         "properties": {},
//         "geometry": {
//             "type": "Point",
//             "coordinates": [e.latlng.lat, e.latlng.lng]
//         }
//     }

//     var marker = L.geoJson(geojsonFeature, {

//         pointToLayer: function (feature, latlng) {

//             var marker = L.marker(e.latlng, {

//                 title: "Resource Location",
//                 alt: "Resource Location",
//                 riseOnHover: true,
//                 draggable: true,

//             }).bindPopup("<input type='button' value='Delete this marker' class='marker-delete-button'/>");

//             marker.on("popupopen", onPopupOpen);

//             return marker;
//         }
//     }).addTo(map);
//      marker.addTo(cluster)
//      cluster.refreshClusters();
// });

 

// cluster.on("popupopen", onPopupOpen);
// function onPopupOpen() {

//     var tempMarker = this;
//     //console.log(this)
//     //var tempMarkerGeoJSON = this.toGeoJSON();

//     //var lID = tempMarker._leaflet_id; // Getting Leaflet ID of this marker

//     // To remove marker on click of delete
//     $(".marker-delete-button:visible").click(function () {
//         cluster.removeLayer(tempMarker[0]);
//     });
// }
// cluster.on('clusterclick', function (a) {
// 	// a.layer is actually a cluster
// 	console.log(a.layer.getAllChildMarkers()[0]);
// });

