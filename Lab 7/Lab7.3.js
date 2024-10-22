document.addEventListener("DOMContentLoaded", function() {
    // Step 1: Set up the dataset for the stacked bar chart
    var dataset = [
        { apples: 5, oranges: 10, grapes: 22 },
        { apples: 4, oranges: 12, grapes: 28 },
        { apples: 2, oranges: 19, grapes: 32 },
        { apples: 7, oranges: 23, grapes: 35 },
        { apples: 23, oranges: 17, grapes: 43 }
    ];

    var keys = ["apples", "oranges", "grapes"]; // Define keys for stacked data

    // Step 2: Set up chart dimensions
    var margin = { top: 20, right: 200, bottom: 30, left: 50 };
    var width = 600 - margin.left - margin.right;
    var height = 300 - margin.top - margin.bottom;

    // Create the SVG container for the chart
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Step 3: Stack the data for the chart
    var stack = d3.stack().keys(keys);
    var series = stack(dataset);

    // Step 4: Set up the scales for the axes
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length)) // x-axis based on the number of data entries
        .range([0, width]) // Width of the chart
        .padding(0.1); // Padding between bars

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, function(d) { // Maximum value for y-axis
            return d.apples + d.oranges + d.grapes; // Sum of all keys
        })])
        .nice() // Rounds the y-axis scale
        .range([height, 0]); // Height of the chart

    var color = d3.scaleOrdinal(d3.schemeCategory10); // Color scheme for stacked bars

    // Step 5: Draw the bars for the chart
    svg.selectAll("g")
        .data(series)
        .enter()
        .append("g")
        .attr("fill", function(d, i) { // Assign color to each bar
            return color(i);
        })
        .selectAll("rect")
        .data(function(d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(i); // Set x position for each bar
        })
        .attr("y", function(d) {
            return yScale(d[1]); // Set y position for the top of each stacked bar
        })
        .attr("height", function(d) {
            return yScale(d[0]) - yScale(d[1]); // Set height of each stacked bar
        })
        .attr("width", xScale.bandwidth()); // Set width of the bars

    // Step 6: Add x-axis to the chart
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat(function(d) { return d + 1; })) // Label each bar
        .selectAll("text")
        .style("fill", "white"); // Set x-axis text color to white

    // Step 7: Add y-axis to the chart
    svg.append("g")
        .call(d3.axisLeft(yScale)) // Create y-axis
        .selectAll("text")
        .style("fill", "white"); // Set y-axis text color to white

    // Set axis lines and tick marks to white for better visibility on dark background
    svg.selectAll(".domain")
        .attr("stroke", "white");
    svg.selectAll(".tick line")
        .attr("stroke", "white");

// Filter the dataset and adjust the legendKeys to include only the desired variables
    var legendKeys = ["Apple", "Orange", "Grape"];
    var legendColor = d3.scaleOrdinal().domain(legendKeys).range(d3.schemeSet2.slice(0,3)); // Limiting the color range to the first three

    // Add dots
    svg.selectAll("mydots")
        .data(legendKeys)
        .enter()
        .append("circle")
        .attr("cx", 370)
        .attr("cy", function(d,i){ return i * 20}) // Positioning each dot
        .attr("r", 7)
        .style("fill", function(d,i){ return color(i)});

    // Add labels
    svg.selectAll("mylabels")
        .data(legendKeys)
        .enter()
        .append("text")
        .attr("x",400)
        .attr("y", function(d,i){ return i*20}) // Align text with dots
        .style("fill", function(d,i){ return color(i)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
});
