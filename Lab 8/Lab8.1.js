function init() {
    // Set the width and height of the SVG container
    var w = 500;
    var h = 300;

    // Define the map projection (Mercator) with center and scale adjustments
    var projection = d3.geoMercator()
        .center([145, -36.5])  // Centered on Victoria, Australia
        .translate([w / 2, h / 2])  // Translate to the center of the SVG
        .scale(2450);  // Scale to control zoom level

    // Define the path generator using the projection
    var path = d3.geoPath()
        .projection(projection);

    // Append the SVG to the chart container
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "grey");

    // Load GeoJSON data and create paths for each feature
    d3.json("LGA_VIC.json").then(function (json) {
        // Bind the features from the GeoJSON to the path elements
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)  // Define the path based on the geo coordinates
            .attr("fill", "grey");  // Set default fill color
    });
}
window.onload = init;  // Call the init function when the page loads
