(() => {
  // Initialize OpenLayers map
  var map = new ol.Map({
    target: "map",
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM(),
      }),
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([-0.09, 51.505]),
      zoom: 6,
    }),
  });

  // Fetch data from API endpoint
  fetch("http://www.ywonline.co.uk/web/newincid.nsf/incidentsjson")
    .then((response) => response.json())
    .then((data) => {
      // Extract latitude and longitude from the first 10 incidents
      var features = [];
      data.slice(0, 10).forEach((incident) => {
        var lat = incident.Latitude;
        var lon = incident.Longitude;

        // Create a feature with the marker's geometry and properties
        var feature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat])),
          name: incident.ServicesAffected,
          description: incident.Description,
        });
        features.push(feature); // Add feature to the features array
      });

      // Create a vector source and layer to hold the features
      var vectorSource = new ol.source.Vector({
        features: features,
      });
      var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
      });
      map.addLayer(vectorLayer);

      // Fit map view to include all markers
      var extent = vectorSource.getExtent();
      map.getView().fit(extent, { padding: [50, 50, 50, 50] });
    })
    .catch((error) => console.error("Error fetching data:", error));
})();
