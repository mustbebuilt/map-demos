(() => {
  // Initialize MapLibre map
  var map = new maplibregl.Map({
    container: 'map', // container id
    style: 'https://demotiles.maplibre.org/style.json', // style URL
    center: [0, 0], // starting position [lng, lat]
    zoom: 1 // starting zoom
  });

  // Array to store marker coordinates
  var coordinates = [];

  // Fetch data from API endpoint
  fetch('http://www.ywonline.co.uk/web/newincid.nsf/incidentsjson')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Extract latitude and longitude from the API data
      data.forEach(incident => {
        var lat = incident.Latitude;
        var lon = incident.Longitude;

        if (lon !== undefined && lat !== undefined) {
          // Create a marker element
          var el = document.createElement('div');
          el.className = 'marker';

          // Add marker to map
          new maplibregl.Marker(el)
            .setLngLat([lon, lat])
            .addTo(map);

          // Store marker coordinates
          coordinates.push([lon, lat]);
        }
      });

      if (coordinates.length > 0) {
        // Calculate bounding box from marker coordinates
        var bounds = coordinates.reduce(function (bounds, coord) {
          return bounds.extend(coord);
        }, new maplibregl.LngLatBounds(coordinates[0], coordinates[0]));

        // Fit map to bounding box
        map.fitBounds(bounds, { padding: 50 });
      } else {
        console.warn('No valid coordinates found.');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
})();
