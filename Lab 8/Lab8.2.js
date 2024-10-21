function init() {
    // Set width and height of the SVG container
    var w = 500;
    var h = 300;

    // Define map projection (Mercator) with center and scale adjustments
    var projection = d3.geoMercator()
        .center([145, -36.5])  // Centered on Victoria, Australia
        .translate([w / 2, h / 2])  // Translate to the center of the SVG
        .scale(2750);  // Adjust scale for proper zoom level

    // Define path generator using the projection
    var path = d3.geoPath().projection(projection);

    // Define color scale with a quantized range
    var color = d3.scaleQuantize()
        .range(["#f2e6ff", "#e6ccff", "#d9b3ff", "#cc99ff", "#bf80ff", "#b266ff", "#a64dff", "#9933ff", "#8c1aff"]);

    // Append the SVG to the chart container
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Load unemployment data from CSV
    d3.csv("VIC_LGA_unemployment.csv").then(function(data) {
        // Convert 'unemployed' values to numbers and filter out invalid entries
        var unemploymentValues = data.map(function(d) {
            d.unemployed = +d.unemployed;  // Convert to number
            return d.unemployed;
        }).filter(isFinite);  // Remove any non-numeric values

        // Set the domain of the color scale based on min and max unemployment values
        color.domain([d3.min(unemploymentValues), d3.max(unemploymentValues)]);

        // Load GeoJSON data
        d3.json("LGA_VIC.json").then(function(json) {
            // Merge CSV data with GeoJSON features by matching LGA names
            data.forEach(function(dataItem) {
                var dataState = dataItem.LGA;  // LGA name from CSV
                var found = false;

                json.features.forEach(function(jsonFeature) {
                    var jsonState = jsonFeature.properties.name;  // LGA name from GeoJSON
                    if (dataState === jsonState) {
                        jsonFeature.properties.value = dataItem.unemployed;  // Set unemployment value in GeoJSON
                        found = true;
                    }
                });

                // Log a warning if no match is found
                if (!found) {
                    console.warn(`LGA not found in GeoJSON: ${dataState}`);
                }
            });

            // Draw the regions with colors based on unemployment value
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)  // Define path for each feature
                .attr("fill", function (d, i) {
                    return color(unemploymentValues[i]);  // Use color scale for filling
                });

            // Load and display cities as red circles on the map
            d3.csv("VIC_city.csv").then(function(cities) {
                svg.selectAll("circle")
                    .data(cities)
                    .enter()
                    .append("circle")
                    .attr("cx", function(d) {
                        return projection([d.lon, d.lat])[0];  // Calculate x coordinate using projection
                    })
                    .attr("cy", function(d) {
                        return projection([d.lon, d.lat])[1];  // Calculate y coordinate using projection
                    })
                    .attr("r", "2px")  // Set radius of circle
                    .attr("fill", "red");  // Fill circle with red color
            });
        }).catch(function(error) {
            console.error("Error loading GeoJSON:", error);
        });
    }).catch(function(error) {
        console.error("Error loading CSV data:", error);
    });
}

window.onload = init;  // Call init function when the page loads
