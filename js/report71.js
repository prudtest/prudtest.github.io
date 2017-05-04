/* Report for sales comparison - REPORT 7
========================================*/


/* Main View Control:
--------------------*/

var param =[];

$(function() {
    
    $("#run7").click(function(){
        
        initiate();
        
    });
    
    
    $("#reset7").click(function(){
        
        
        clearContent();
        
    });

});


/* Functions for report Generation:
-----------------------------------*/

function initiate(){
    
    var selection = document.getElementById("report7Selection");

    var year = selection.year.value;

    var cat = selection.category.value;

    var q1 = (selection.q1.checked ? 1:0);
    
    var q2 = (selection.q2.checked ? 1:0);
    
    var q3 = (selection.q3.checked ? 1:0);
    
    var q4 = (selection.q4.checked ? 1:0);
    
    var q = [q1,q2,q3,q4];
    
    param = {
        
        year:year,
        category: cat,
        period:q
    };
    
    getData(param);
}

/*-----------------------------------------------------------------------------*/

function getData(parameters) {
    
    $.post("php/report7.php",parameters,"json")
    .done(function(data, textStatus, jqXHR) {
        
        makeTable(data);
        makeChart(data);
        changeDom();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
         
        console.log(errorThrown.toString());
    });
}

/*----------------------------------------------------------------------------*/

function makeTable(datatable) {
    
    $.fn.dataTable.ext.errMode = 'none';
            
    $('#result7').DataTable( {
        data: datatable,
        columns: [
            { title: "Customers" },
            { title: param["year"] + " Sales" },
            { title: "This Year Sales"}
        ]
    });
}

/*-----------------------------------------------------------------------------*/

function makeChart(dataChart){
    
    //Data to be graphed
    var data = dataChart;
    
    // Constructing a numerical 2D array
    var datablock =[];
    for (var i = 0, n = data.length; i < n; i++)
    {
        datablock.push([Number(data[i][1]) , Number(data[i][2])]);
    }
    
    // Scaling factor to harmonize the data
    var amp = 1000;
    
    // Selector for the y axis label
    var lab = "Sales in k$";
    
    // Selector for the Units for the tooltip
    var lab2 = "K";
    
    // Format for the tooltip value display
    var valFormat = d3.format(",.1f");
    
    // Format for the y axis labels
    var axFormat = d3.format(",.0f");
    
    // Dimensioning of the drawing canvas
    var margin = {top: 50, right: 0, bottom: 50, left: 0},
        width = 1100 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    
    // Initiation of the x-axis scale
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width - 30], .1)
        .domain(data.map(function(d) { return d[0]; }));
    
    // initiation of the y axis scale
    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(datablock, function (line) {return d3.max(line, function (d) {return d/amp})})]);
        
    // initiation of the x axis object
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    // initiation of the y axis object
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(axFormat);
        
    var color = ['#900' , '#06c'];
    
    // initiation of the tooltip
   var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
            return "<p>" + valFormat(d[2]/amp) + " " + lab2 + "</p>" + "<p>Category: " + param["category"] + " "  + d[0] + " </p>";
            });
    
    // Drawing canvas instantiation
    /*var svg7 = d3.select(".graph7")
       
       .append("div")
       .classed("svg-container", true) //container class to make it responsive
       .append("svg")
       
       //responsive SVG needs these 2 attributes and no width and height attr
       .attr("preserveAspectRatio", "xMinYMin meet")
       .attr("viewBox", "0 0 width height")
       
       //class to make it responsive
       .classed("svg-content-responsive", true)
       .attr("viewBox","-30 10 " + width + " " + eval(height + 10));*/
       
    var svg7 = d3.select(".graph7").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg7.call(tip);
    // x-axis creation
    svg7.append("g")
        .attr("class", "x axis")
        .attr("id" , "rep7x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // y-axis creation
    svg7.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .attr("dx","-2.1em")
        .style("text-anchor", "end")
        .text(lab);

    // Bars creation
    svg7.selectAll(".bar71")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar71")
        .attr("x", function(d) { return x(d[0]); })
        .attr("width", x.rangeBand()/2)
        .attr("y", function(d) { return y(parseFloat(d[2])/amp); })
        .attr("height", function(d) { return height - y(parseFloat(d[2])/amp); })
        .style("fill", function (d , i){return color[0]})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
        
        
    svg7.selectAll(".bar72")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar72")
        .attr("x", function(d) { return x(d[0]) + x.rangeBand()/2; })
        .attr("width", x.rangeBand()/2)
        .attr("y", function(d) { return y(parseFloat(d[1])/amp); })
        .attr("height", function(d) { return height - y(parseFloat(d[1])/amp); })
        .style("fill", function (d , i){return color[1]})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
        
    var legdata = ["Current year" , "Year " + param["year"]];
    
    
    var legend = svg7.selectAll(".legend")
        .data(legdata)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + eval(30 + i * 20) + ")"; });
        
    legend.append("rect")
        .attr("x", width - 100)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d , i) {return color[i];});
    
    legend.append("text")
        .attr("x", width - 120)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.75em")
        .text(function(d) { return d; });    
    
        
}

/*-----------------------------------------------------------------------------------------------------------------------*/

function changeDom(){
    
    var quarters = param["period"];
    
    var quarter1 = (quarters[0] === 0 ) ? 'q1 not included ' : 'q1 included';
    var quarter2 = (quarters[1] === 0 ) ? 'q2 not included ' : 'q2 included';
    var quarter3 = (quarters[2] === 0 ) ? 'q3 not included ' : 'q3 included';
    var quarter4 = (quarters[3] === 0 ) ? 'q4 not included ' : 'q4 included';
   
    $(".selectionSummary")
    .html('<h3>Selection Summary:</h3><p>Comparison Year: '
    + param["year"] + ' for category: ' + param["category"] + '</p>' + 
    '<p>' + quarter1 + '</p>' +
    '<p>' + quarter2 + '</p>' +
    '<p>' + quarter3 + '</p>' +
    '<p>' + quarter4 + '</p>');
    
    $(".reportOptions").slideToggle();
    $(".selectionSummary").slideToggle();
    $(".reset").slideToggle();
    $("#reportGraph").slideToggle();
    $(".resultTable").slideToggle();
    
}

/*-----------------------------------------------------------------------------------------------------------------------------*/

function clearContent() {
    
    $(".graph7").empty();
    $(".resultTable").empty();
    $(".selectionSummary").empty();
    document.getElementById("report7Selection").reset();
    resetDom();
}

/*-----------------------------------------------------------------------------------------------------------------------------*/

function resetDom() {
    
    $(".resultTable").html('<table id="result7" class="display" width="90%"></table>');
    
    $(".reportOptions").slideToggle();
    $(".selectionSummary").slideToggle();
    $(".reset").slideToggle();
    $("#reportGraph").slideToggle();
    $(".resultTable").slideToggle();
    
}