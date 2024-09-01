function init(){
    //reading the data from csv file
    d3.csv("Task_2.4_data.csv").then(function(data){
        console.log(data);

        barChart(data);
    })
    
    function barChart(dataset){
        var w = 600;
        var h = 300;
    
        var svg = d3.select("#chart")
                    .append("svg")
                    .attr("width",w)
                    .attr("height",h);

        svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        //x coordinate and y coordinate
        .attr("x",function(d,i){
            return i * (w/dataset.length)+5;
        })
        .attr("y",function(d){
            return h - (d.wombats*12)
        })
        //width and height of the bar chart
        .attr("width",function(d){
            return (w/dataset.length-10);
        })
        .attr("height",function(d){
            return d.wombats*12;
        })

        .style("fill", function (d) {
            if (d.wombats <= 10) {
                return "yellow"
            } else if (d.wombats <= 20) {
                return "orange"
            } else {
                return "brown"
            }
        })

        svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d.wombats;
        })
        .attr("fill","black")
        .attr("x", function(d, i) {
            return i * (w / dataset.length) +16;
        })
        .attr("y",function(d){
            return h - (d.wombats *4)
        })
    }
}
window.onload = init;
