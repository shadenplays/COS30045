document.addEventListener("DOMContentLoaded", function() {
    // Define SVG dimensions and padding
    var w = 600;  // Width of SVG container
    var h = 300;  // Height of SVG container
    var padding = 50;  // Padding around the chart to avoid overlap with axes

    // Select the chart div and append an SVG element inside it
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)  // Set width of the SVG element
        .attr("height", h);  // Set height of the SVG element

    // Load the CSV data
    d3.csv("Unemployment_78-95.csv", function(d) {
        return {
            date: new Date(+d.year, +d.month - 1),  // Parse date from CSV
            number: +d.number  // Convert number to a numeric value
        };
    }).then(function(dataset) {
        console.log("Parsed Data:", dataset);  // Debugging: log the parsed data

        // Define xScale (time-based) and yScale (linear for unemployment numbers)
        var xScale = d3.scaleTime()
            .domain([
                d3.min(dataset, d => d.date),  // Set the minimum value for x-axis
                d3.max(dataset, d => d.date)  // Set the maximum value for x-axis
            ])
            .range([padding, w - padding]);  // Define the range for x-axis

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.number)])  // Max value for y-axis is the highest number
            .range([h - padding, padding]);  // Define the range for y-axis

        // Draw the area chart below the line chart
        var area = d3.area()
            .x(d => xScale(d.date))  // Set x-coordinate based on the date
            .y0(yScale.range()[0])  // Set the bottom of the area to the x-axis
            .y1(d => yScale(d.number));  // Set the top of the area based on the number of unemployed

        svg.append("path")
            .datum(dataset)  // Bind data to the path element
            .attr("class", "area")  // Apply the 'area' class for styling
            .attr("d", area);  // Generate the area path based on the data

        // Draw the line chart on top of the area chart
        var line = d3.line()
            .x(d => xScale(d.date))  // Set x-coordinate based on the date
            .y(d => yScale(d.number));  // Set y-coordinate based on the number of unemployed

        svg.append("path")
            .datum(dataset)  // Bind data to the path element
            .attr("class", "line")  // Apply the 'line' class for styling
            .attr("d", line);  // Generate the line path based on the data

        // Draw a horizontal line annotation for 500,000 unemployed
        svg.append("line")
            .attr("class", "halfMilMark")  // Apply the 'halfMilMark' class for styling
            .attr("x1", padding)  // Start of the line (x-coordinate)
            .attr("y1", yScale(500000))  // Y-position for 500,000 unemployed
            .attr("x2", w - padding)  // End of the line (x-coordinate)
            .attr("y2", yScale(500000));  // Y-position remains the same

        svg.append("text")
            .attr("class", "halfMilLabel")  // Apply the 'halfMilLabel' class for styling
            .attr("x", padding + 10)  // Position the text slightly offset from the line
            .attr("y", yScale(500000) - 7)  // Position text slightly above the line
            .text("Half a million unemployed");  // Text to display

        // Draw the x-axis at the bottom of the chart
        svg.append("g")
            .attr("transform", `translate(0, ${h - padding})`)  // Move the x-axis down to the bottom
            .call(d3.axisBottom(xScale));  // Generate and add the bottom x-axis using xScale

        // Draw the y-axis on the left side of the chart
        svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)  // Move the y-axis to the left
            .call(d3.axisLeft(yScale));  // Generate and add the left y-axis using yScale
    })
        .catch(function(error) {
        console.error("Error loading the CSV file:", error);  // Debugging
    });
});


