/* CS50 final project for Spring 2016
    Presented by Hany Bassily*/
    
    
/* Script for bar charts drawing using D3
=========================================
*/

// Scaling factor to harmonize the data
var amp = 1000;

// Selector for the category to be drawn
var cat = "firms";

// Selector for the y axis label
var lab = "Count x1000";

// Selector for the Units for the tooltip
var lab2 = "K";

// Format for the tooltip value display
var valFormat = d3.format(",.1f");

// Format for the y axis labels
var axFormat = d3.format(",.0f");

// Dimensioning of the drawing canvas
var margin = {top: 40, right: 20, bottom: 30, left: 150},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Initiation of the x-axis scale
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// initiation of the y axis scale
var y = d3.scale.linear()
    .range([height, 0]);

// initiation of the x axis object
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// initiation of the y axis object
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(axFormat);

// initiation of the tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<div class='tipbody'><p class='tiphead'>" + valFormat(d[cat]/amp) + " " + lab2 + "</p>" + "<p class='tiptext'>" + d.name + "</p></div>";
    });

var div = d3.select(".chart").append("div")	
    .attr("class", "tipbody")				
    .style("opacity", 0);


// Drawing canvas instantiation
var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Tool tip association
svg.call(tip);

// Data reading and association to the drawing object
d3.json("datamain.json", function(error, data) {
    
    // Complete axis scaling based on the data
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d[cat]/amp; })]);

    // x-axis creation
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // y-axis creation
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(lab);

    // Bars creation
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d[cat]/amp); })
        .attr("height", function(d) { return height - y(d[cat]/amp); })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
      

});

/* Script to update the barchart on using D3
============================================
*/

function updateData(clicSelect){
    
    
    // Changing parameters for different optional categories
    if(clicSelect == "first")
    {
        amp = 1000;
        cat = "estab";
        lab = "Count x1000";
        lab2 = "K";
    }
    else if(clicSelect == "second")
    {
        amp = 1000000;
        cat = "emp";
        lab = "Count x1M";
        lab2 = "M";
    }
    else if(clicSelect == "third")
     {
        amp = 1000000;
        cat = "payroll";
        lab = "Amount x1M$";
        lab2 = "M$";
    }
    else if(clicSelect == "fourth")
    {
        amp = 1000;
        cat = "income";
        lab = "Amount x1000$";
        lab2 = "K$";
    }
    else
    {
        amp = 1000;
        cat = "firms";
        lab = "Count x1000";
        lab2="K";
    }
    
    // Recreate the tooltips
    tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<div class='tipbody'><p class='tiphead'>" + valFormat(d[cat]/amp) + " " + lab2 + "</p>" + "<p class='tiptext'>" + d.name + "</p></div>";
    });
    
    // Clean the canvas from the old elements
    svg.selectAll("g.y.axis").remove();
    svg.selectAll("rect").remove();
    
    // Associate the new tips to the cleaned canvas
    svg.call(tip);
    
    // Reload the data (since all g's were removed) and modify the axis scaling
    d3.json("datamain.json", function(error, data) {
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d[cat]/amp; })]);

    //Repeat the association steps
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(lab);

    // Recreating the bars with zero values to prepare for the animation
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y",height)
        .attr("height",0)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    
    // Animation to the final new value
    svg.selectAll(".bar").transition()
        .duration(800)                                                  // Total duration for each bar
        .delay(function(d,i){return i*150;})                            // Delay for ordered appearance
        .ease("sin")                                                    // easing function (I am thinking about removing it in the final product)
        .attr("y", function(d) { return y(d[cat]/amp); })               //Final y position
        .attr("height", function(d) { return height - y(d[cat]/amp); }) // Final height.
        ;
    });
}