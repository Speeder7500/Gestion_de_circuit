


var map = L.map('map').setView([43.250953, 5.792333], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([43.250953, 5.792333]).addTo(map);
marker.bindPopup("Le circuit se trouve ici : <br> lat:43.250953 <br> long:5.792333").openPopup();





