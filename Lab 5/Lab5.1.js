document.addEventListener("DOMContentLoaded", function() {
    // Initial dataset used for bar chart visualization
    var dataset = [24,10,29,19,8,15,20,12,9,6,21,28];
    var numValues = dataset.length;

    // Chart dimensions and padding settings
    const margin = {top: 50, right: 20, bottom: 50, left: 50};
    var w = 500 - margin.left - margin.right;
    var h = 300 - margin.top - margin.bottom;

    // Create the SVG element and append it to the chart container
    var svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the scales for the x and y axes
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([0, w])
        .paddingInner(0.05);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([h, 0]);

    // Create initial bar elements based on the dataset
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale(i) + 5; // Add padding to align
        })
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return h - yScale(d);
        })
        .attr("fill", "blue");

    // Create text labels inside each bar to display the value
    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return xScale(i) + xScale.bandwidth() / 3 + 5; // Adjust for centering text
        })
        .attr("y", function(d) {
            return yScale(d) + 15; // Adjust position for better visibility
        })
        .attr("font-size", "12px")
        .attr("fill", "white")
        .text(function(d) {
            return d;
        });

    // Create and append the X axis at the bottom of the chart
    var xAxis = d3.axisBottom(xScale).ticks(dataset.length);
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    // Create and append the Y axis on the left of the chart
    var yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Event handler for the 'Update Data' button click
    d3.select("#update-data").on("click", function() {
        // Generate a new random dataset
        dataset = [];
        for (var i = 0; i < numValues; i++) {
            var newNumber = Math.floor(Math.random() * 25);
            dataset.push(newNumber);
        }

        // Update scales to reflect the new dataset
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0, d3.max(dataset)]);

        // Update bar heights and y positions to reflect new data
        svg.selectAll("rect")
            .data(dataset)
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("height", function(d) {
                return h - yScale(d);
            });

        // Update the text labels with new values
        svg.selectAll("text")
            .data(dataset)
            .text(function(d) {
                return d;
            })
            .attr("x", function(d, i) {
                return xScale(i) + xScale.bandwidth() / 3 + 5;
            })
            .attr("y", function(d) {
                return yScale(d) + 15;
            });

        console.log("Rect elements created:", svg.selectAll("rect").nodes());
        console.log("New dataset: ", dataset);
    });
});
