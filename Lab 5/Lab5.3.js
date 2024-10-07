// Ensure the JavaScript code runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initial dataset used for bar chart visualization
    var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];

    // Declare the transition type variable (used for bar animations)
    var transition = d3.easeCubicInOut;

    // Chart dimensions and padding settings
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
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
            return xScale(i);
        })
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
            return h - yScale(d);
        })
        .attr("fill", "blue");

    // Create and append the X axis at the bottom of the chart
    var xAxis = d3.axisBottom(xScale).tickFormat((d, i) => i + 1);
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    // Create and append the Y axis on the left of the chart
    var yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Event handler for the 'Add' button click
    d3.select("#add-value").on("click", function() {
        // Generate a new random value and add it to the dataset
        var newValue = Math.floor(Math.random() * 25);
        dataset.push(newValue);

        // Update scales to reflect the new dataset
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0, d3.max(dataset)]);

        // Bind the updated dataset to the bar elements
        var bars = svg.selectAll("rect").data(dataset);

        // Create new bars for the new value
        bars.enter()
            .append("rect")
            .attr("x", w) // Start from the right edge
            .attr("y", yScale(newValue))
            .attr("width", xScale.bandwidth())
            .attr("height", h - yScale(newValue))
            .attr("fill", "blue")
            .merge(bars) // Merge new bars with existing ones
            .transition()
            .duration(1000)
            .ease(transition)
            .attr("x", function(d, i) {
                return xScale(i);
            })
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
                return h - yScale(d);
            });

        // Update the axes to reflect new data
        svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);

        svg.select(".y-axis")
            .transition()
            .duration(1000)
            .call(yAxis);
    });

    // Event handler for the 'Remove' button click
    d3.select("#remove-value").on("click", function() {
        if (dataset.length === 0) return; // Prevent removing from an empty dataset

        // Remove the last value from the dataset
        dataset.pop();

        // Update scales to reflect the new dataset
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0, d3.max(dataset)]);

        // Bind the updated dataset to the bar elements
        var bars = svg.selectAll("rect").data(dataset);

        // Remove the last bar using exit
        bars.exit()
            .transition()
            .duration(1000)
            .attr("x", w) // Move out to the right
            .remove(); // Remove from the DOM

        // Update the remaining bars
        bars.transition()
            .duration(1000)
            .ease(transition)
            .attr("x", function(d, i) {
                return xScale(i);
            })
            .attr("y", function(d) {
                return yScale(d);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
                return h - yScale(d);
            });

        // Update the axes to reflect new data
        svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);

        svg.select(".y-axis")
            .transition()
            .duration(1000)
            .call(yAxis);
    });
});