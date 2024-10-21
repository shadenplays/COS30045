document.addEventListener("DOMContentLoaded", function() {
    // Set up SVG dimensions and radius for the pie chart
    var width = 600;  // Chart width
    var height = 300;  // Chart height
    var radius = Math.min(width, height) / 2;  // Radius is half the smaller of width/height

    // Set up the SVG container
    var svg = d3.select("#chart")  // Selects the div with id 'chart' where the chart will be drawn
        .append("svg")  // Appends an SVG element to the chart div
        .attr("width", width)  // Sets the width of the SVG
        .attr("height", height)  // Sets the height of the SVG
        .append("g")  // Adds a group element for the chart
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");  // Moves the chart to the center of the SVG

    // Set up the data for the pie chart
    var data = [45, 25, 20, 10, 6, 5];  // Example data values for the pie chart

    // Set up the pie and arc generators
    var pie = d3.pie();  // Creates a pie layout generator
    var outerRadius = radius;  // Outer radius of the pie chart
    var innerRadius = 0;  // Inner radius of the pie (set greater than 0 for a donut chart)
    var arc = d3.arc()  // Creates an arc generator
        .outerRadius(outerRadius)  // Sets the outer radius of the arc
        .innerRadius(innerRadius);  // Sets the inner radius of the arc

    // Set up the color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);  // Uses a color scale with 10 predefined colors

    // Create the arcs and append them to the SVG
    var arcs = svg.selectAll("g.arc")  // Selects all existing 'g.arc' elements (none exist initially)
        .data(pie(data))  // Binds the data to the pie layout
        .enter()  // Creates a new 'g' for each data point
        .append("g")  // Appends a new group element for each arc
        .attr("class", "arc");  // Assigns a class to the group elements

    arcs.append("path")  // Appends a path (the pie slice) to each arc group
        .attr("fill", function(d, i) { return color(i); })  // Sets the fill color for each slice
        .attr("d", arc);  // Draws the arc based on the arc generator

    // Add labels to the pie chart
    arcs.append("text")  // Appends a text element to each arc
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })  // Positions the label at the center of each slice
        .attr("text-anchor", "middle")  // Centers the text horizontally
        .text(function(d) { return d.data; });  // Displays the corresponding data value as text
});
