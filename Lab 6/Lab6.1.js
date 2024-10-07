// Ensure the JavaScript code runs after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initial dataset for the chart
    var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];

    // Transition effect for animations
    var transition = d3.easeCubicInOut;

    // Chart dimensions and padding for axes
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
    var w = 500 - margin.left - margin.right;
    var h = 300 - margin.top - margin.bottom;

    // Create an SVG container in the chart container div
    var svg = d3.select("#chart-container")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define the x and y scales for the chart
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))
        .range([0, w])
        .paddingInner(0.05);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([h, 0]);

    // Function to add mouse events to bars
    function addMouseEvents(selection) {
        selection
            .on("mouseover", function(event, d) {
                // Display tooltip on mouseover
                var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
                var yPosition = parseFloat(d3.select(this).attr("y")) + 12;

                svg.append("text")
                    .attr("id", "tooltip")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .attr("text-anchor", "middle")
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "black")
                    .text(d);

                // Change bar color on mouseover
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "orange");
            })
            .on("mouseout", function() {
                // Remove tooltip on mouseout
                d3.select("#tooltip").remove();

                // Revert bar color on mouseout
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("fill", "blue");
            });
    }

    // Create the initial bars
    var bars = svg.selectAll("rect")
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

    // Apply mouse events to bars
    addMouseEvents(bars);

    // Create and append the x-axis to the SVG
    var xAxis = d3.axisBottom(xScale).tickFormat((d, i) => i + 1);
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

    // Create and append the y-axis to the SVG
    var yAxis = d3.axisLeft(yScale);
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Add value button to add a new bar to the chart
    d3.select("#add-value").on("click", function() {
        var newValue = Math.floor(Math.random() * 25);
        dataset.push(newValue);

        // Update scales and bind data
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0, d3.max(dataset)]);

        // Update bars and enter new ones
        var bars = svg.selectAll("rect")
            .data(dataset);

        bars.enter()
            .append("rect")
            .attr("x", w)
            .attr("y", yScale(newValue))
            .attr("width", xScale.bandwidth())
            .attr("height", h - yScale(newValue))
            .attr("fill", "blue")
            .call(addMouseEvents)
            .merge(bars)
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

        // Update x and y axes
        svg.select(".x-axis")
            .transition()
            .duration(1000)
            .call(xAxis);

        svg.select(".y-axis")
            .transition()
            .duration(1000)
            .call(yAxis);
    });

    // Remove value button to remove a bar from the chart
    d3.select("#remove-value").on("click", function() {
        if (dataset.length === 0) return;

        dataset.pop();

        // Update scales and bind data
        xScale.domain(d3.range(dataset.length));
        yScale.domain([0, d3.max(dataset)]);

        var bars = svg.selectAll("rect")
            .data(dataset);

        // Remove bars using exit selection
        bars.exit()
            .transition()
            .duration(1000)
            .attr("height", 0)
            .attr("y", h)
            .remove();

        // Update remaining bars
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

        // Update x and y axes
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

