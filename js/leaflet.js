(()=>{

// Initialize Leaflet map
var map = L.map('map');

// Add OpenStreetMap tiles as the base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch data from API endpoint
fetch('http://www.ywonline.co.uk/web/newincid.nsf/incidentsjson')
  .then(response => response.json())
  .then(data => {
    // Extract latitude and longitude from the first 10 incidents
    var markers = [];
    data.slice(0, 10).forEach(incident => {
      var lat = incident.Latitude;
      var lon = incident.Longitude;
      
      // Create marker and add it to the map
      var marker = L.marker([lat, lon]).addTo(map)
        .bindPopup(`<b>${incident.ServicesAffected}</b><br>${incident.Description}`);
      
      markers.push(marker); // Add marker to the markers array
    });

    // Fit map bounds to include all markers
    var group = new L.featureGroup(markers);
    map.fitBounds(group.getBounds());
  })
  .catch(error => console.error('Error fetching data:', error));
})();