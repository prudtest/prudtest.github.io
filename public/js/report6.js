/* Report for inventory performance vs sales - REPORT 6
======================================================*/

/* Global variables Declaration:
================================*/

// Get the selection of the period either per month or per quarter
var freq;

// Get the desired month
var month;

// Assign a variable for the type of graph selected
var valgraph = document.getElementById("report6Selection");

// Variable for grouped graph selection
var group  = valgraph.grgraph.checked ? true : false;

// Variable for differenced graph selection
var diff   = valgraph.difgraph.checked ? true: false;

// Get the sale forecast inclusion option
var fore  = document.getElementById("include").checked ? true : false;

// Flag for Graph 1 Empty
var graph1empty = true;

// Flag for Graph 2 Empty
var graph2empty = true;

// Flag for report run
var run  = false;

// Initiation for the query parameters
var param = [];

// Sliding duration control
var dur = 1000;

/*----------------------------------------------------------*/

/* FUnction to hold the Forecast inclusion:
==========================================*/

function travel_stop() {
    
    // Position tracker
    var pos = $("#track6").scrollTop();
    
    // Limit to start fixing the selector
    var strt = 0.65 * window.innerHeight;
    
    // Limit to end the fixation of the selector
    var term =  (diff && group) ? (2.0 * window.innerHeight) : (1.8 * window,innerHeight);
    
    // Fixing the selector
    if ( pos > strt && pos < term && (diff || group)) {
        $('.forecastControl').addClass('stick');
        $('#selection-anchor').height($('.forecastControl').outerHeight());
        
    // Transforming back to scrollable div    
    } else {
        $('.forecastControl').removeClass('stick');
        $('#selection-anchor').height(0);
    }
}

/*----------------------------------------------------------*/ 

/* Main View Control:
=====================*/

$(function () {
    
    /* Main Run Button:
    -------------------*/
    $("#run6").click(function () {
       
        // Check if already initiated
        if (!run) {
            initiate6();
        }
        
        // Otherwise reset before initiation
        else {
            reportReset6();
        }
    });
    
    /* Graph Selection Control:
    --------------------------*/
    
    // Toggling Graph 1 (true values)
    $("#group").click( function () {
        
        // resetting the grpah 1 status
        group = valgraph.grgraph.checked ? true : false;
        
        // Sliding down
        if(group && !graph1empty) {
            $("#reportGraph61").slideDown(dur, "swing");
        }
        
        // Sliding up
        else if(!group && !graph1empty) {
            $("#reportGraph61").slideUp(dur, "swing");
        }
    });
    
    
    // Toggling Graph 2 (difference)
    $("#diff").click( function () {
        
        // resetting the grpah 1 status
        diff = valgraph.difgraph.checked ? true : false;
        
        //Sliding Down
        if(diff && !graph2empty) {
            $("#reportGraph62").slideDown(dur, "swing");
        }
        
        // Sliding Up
        else if (!diff && !graph2empty) {
            $("#reportGraph62").slideUp(dur, "swing");
        }
    });
    
    /* Limiting the scroll of the forecast selector:
    ----------------------------------------------*/
    
    // Stop scrolling for Forecast inclusion 
    $("#track6").scroll(travel_stop);
   
    travel_stop();
    
    
    /* Forecast Inclusion Animation:
    --------------------------------*/
    
    // Toggle the "With Forecast" button
    $("#include").click( function (){
       
        // Transition of graph if forecast is not included
        if (!fore) {
            fore  = true;
            animeInclude();
        }
        
    });
    
    // Toggle the "Without Forecast" button
    $("#exclude").click( function (){
        
        // Transition of graph if forecast was included
        if (fore) {
            fore  = false;
            animeExclude();
        }
    });
    
    
    /* Report Reset:
    ----------------*/
    
    $("#reset6").click( function (){
        
        run = false;
        
        // Initiate the reset function
        reportReset6();
    });
    
});

/*-----------------------------------------------------------------*/

/* Initate Report:
=================*/

function initiate6() {
    

    // Capture selected frequency
    freq  = document.getElementById("mon").checked ? "mon" : "quar";
    
    // Capture selected month
    month = $("#month").val();
    
    // Capture selected quarter
    var quarter  = $("#quart").val();
    
    //initiate parameters variables
    var mon1, mon2, mon3;
    
    // Include month selection if frequency is month
    if (freq === "mon") {
        mon1 = month , mon2 = month , mon3 = month; 
    }
    
    // include the quarter months if frequency is month
    else {
        
        // First quarter
        if (quarter === "q1") {
            mon1 = "jan" , mon2 = "feb" , mon3 = "mar";
        }
        
        //Second quarter
        else if (quarter === "q2") {
            mon1 = "apr" , mon2 = "may" , mon3 = "jun";
        }
        
        //Third quarter
        else if (quarter === "q3") {
            mon1 = "jul" , mon2 = "aug" , mon3 = "sep";
        }
        
        // Fourth quarter
        else if (quarter === "q4") {
            mon1 = "oct" , mon2 = "nov" , mon3 = "dec";
        }
    }
    
    // Construct parameters:
    param = {
        moth1:mon1,
        moth2:mon2,
        moth3:mon3
    };
    
    // Get the data from the server
    getData6(param);
}

/*----------------------------------------------------------------------*/

/* Get Data from server:
=======================*/

function getData6(parameters) {
    
     $.post("php/report6.php",parameters,"json")
    .done(function(data, textStatus, jqXHR) {
        
        makeTable6(data);
        makeChart61(data);
        makeChart62();
        changeDom6();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
         
        console.log(errorThrown.toString());
    });
}

/*----------------------------------------------------------------------------*/

/* Construct the results table:
==============================*/

function makeTable6(datatable) {
    
    $.fn.dataTable.ext.errMode = 'none';
    
    $('#result6').DataTable( {
        data: datatable,
        columns: [
            { title: "Products" },
            { title: "Inventory" },
            { title: "Sales Backlog"},
            { title: "Forecast Qty"},
            { title: "Diff Without Forecast"},
            { title: "Diff With Forecast"}
        ]
    });
    
}

/*-----------------------------------------------------------------------------*/

/* Construct the First Chart:
============================*/

function makeChart61(dataraw) {
    
    // Start with clearing out the DOM
    if($(".graph61").html()) {
        $(".graph61").empty();
    }
    
    //Data to be graphed imported only once
    data = dataraw;
    
    // Constructing a numerical 2D array
    var datablock =[];
    for (var i = 0, n = data.length; i < n; i++)
    {
        datablock.push([Number(data[i][1]) , Number(data[i][2]), Number(data[i][2]) + Number(data[i][3]) ]);
    }
    
    // Selector for the y axis label
    lab = "Qty lbs";
    
    // Selector for the Units for the tooltip
    lab2 = "lbs";
    
    // Format for the tooltip value display
    valFormat = d3.format(",.1f");
    
    // Format for the y axis labels
    axFormat = d3.format(",.0f");
    
    // Apply a nominal Width related to screen width
    nomW = 0.6 * window.innerWidth;
    
    // Apply a nominal height with aspect ratio with width
    nomH = nomW / 1.62 ; 
    
    // Specify margins (both graphs)
    margin = {top: nomW/20, right: nomW/10, bottom: nomW/10, left: nomW/5};
    
    // Set width and height
    width61 = nomW ;
    height61 = nomH;
    
    // Initiation of the x-axis scale
    x61 = d3.scale.ordinal()
        .rangeRoundBands([0, width61 - 30], .1)
        .domain(data.map(function(d) { return d[0]; }));
    
    // Acquire the data absolute maximum    
    var upY61 =  d3.max(datablock, function (line) {return d3.max(line, function (d) {return d})});
    
    // initiation of the y axis scale
    y61 = d3.scale.linear()
        .range([height61, 0])
        .domain([0, upY61]);
        
    // initiation of the x axis object
    xAxis61 = d3.svg.axis()
        .scale(x61)
        .orient("bottom");
    
    // initiation of the y axis object
    yAxis61 = d3.svg.axis()
        .scale(y61)
        .orient("left")
        .tickFormat(axFormat);
    
    // Graph color matrix    
    color61 = ['#900' , '#06c', '#399'];
    
    
    // Initiation of the tooltip
    div61 = d3.select(".graph61").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
        
    // Construct the drawing canvas   
    svg61 = d3.select(".graph61").append("svg")
        .attr("width", width61 + margin.left + margin.right)
        .attr("height", height61 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
   
    // x-axis creation
    svg61.append("g")
        .attr("class", "x axis repx")
        .attr("id" , "rep7x")
        .attr("transform", "translate(0," + height61 + ")")
        .call(xAxis61);

    // y-axis creation
    svg61.append("g")
        .attr("class", "y axis")
        .call(yAxis61)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .attr("dx","-2.1em")
        .style("text-anchor", "end")
        .text(lab);

    // First bars creation
    svg61.selectAll(".bar61")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar61")
        .attr("x", function(d) { return x61(d[0]); })
        .attr("width", x61.rangeBand()/2)
        .attr("y", function(d) { return y61(parseFloat(d[1])); })
        .attr("height", function(d) { return height61 - y61(parseFloat(d[1])); })
        .style("fill", function (d , i){return color61[0]})
        .on("mouseover", function(d) {div61.html("<p>" + valFormat(d[1]) + " " + lab2 + "</p>" + "<p>Product: " + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX - 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div61.style("opacity", 0);});
     
    // Second bars creation    
    svg61.selectAll(".bar62")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar62")
        .attr("x", function(d) { return x61(d[0]) + x61.rangeBand()/2; })
        .attr("width", x61.rangeBand()/2)
        .attr("y", function(d) { return y61(parseFloat(d[2])); })
        .attr("height", function(d) { return height61 - y61(parseFloat(d[2])); })
        .style("fill", function (d , i){return color61[1]})
        .on("mouseover", function(d) {div61.html("<p>" + valFormat(d[2]) + " " + lab2 + "</p>" + "<p>Product: " + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div61.style("opacity", 0);});
    
    // Third bars creation    
    svg61.selectAll(".bar63")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar63")
        .attr("x", function(d) { return x61(d[0]) + x61.rangeBand()/2; })
        .attr("width", x61.rangeBand()/2)
        .attr("y", function(d) { return y61(parseFloat(d[2])); })
        .attr("height", 0)
        .style("fill", function (d , i){return color61[2]})
        .on("mouseover", function(d) {div61.html("<p>" + valFormat(d[3]) +  " " + lab2 + "</p>" + "<p>Product: " + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div61.style("opacity", 0);});
    
    // Legend data    
    legdata61a = ["Inventory" , "Sales Backlog"];
    
    legdata61b = ["Inventory" , "Sales Backlog", "Sales Forecast"];
    
    // Initiate Legend
    legend61 = svg61.selectAll(".legend")
        .data(legdata61a)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + eval(30 + i * 20) + ")"; });
    
    // Construct colored rectangles for legend    
    legend61.append("rect")
        .attr("x", width61 - 100)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d , i) {return color61[i];});
    
    // Add text to the legend
    legend61.append("text")
        .attr("x", width61 - 120)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.75em")
        .text(function(d) { return d; });
    
    // Change the status of the Empty Graph Flag
    graph1empty = false;
}

/*-----------------------------------------------------------------------------------------------------------------------*/

/* Construct the Second Chart:
============================*/

function makeChart62() {
    
    // Start with clearing out the DOM 
    if($(".graph62").html()) {
        $(".graph62").empty();
    }
    
    // Dimensioning of the drawing canvas
    width62 = nomW;
    height62 = nomH;
    
    // Initiation of the x-axis scale
    x62 = d3.scale.ordinal()
        .rangeRoundBands([0, width62], .3)
        .domain(data.map(function(d) { return d[0]; }));
    
    // Take the data limits in case without forecast
    var upY62 =  d3.max(data, function(d) { return parseFloat(d[4]); });
    var dnY62 =  d3.min(data, function(d) { return parseFloat(d[4]); });
    
    // Set the y axis limits according to the data
    var domyLim1 = dnY62 < 0 ? dnY62 :  0;
    var domyLim2 = upY62;
    
    // initiation of the y axis scale
    y62 = d3.scale.linear()
        .range([height62, 0])
        .domain([domyLim1 , domyLim2]);
        
    // initiation of the x axis object
    xAxis62 = d3.svg.axis()
        .scale(x62)
        .orient("bottom");
    
    // initiation of the y axis object
    yAxis62 = d3.svg.axis()
        .scale(y62)
        .orient("left")
        .tickFormat(axFormat);
        
    color62 = ['#900' , '#06c'];
    
    
    // initiation of the tooltip
    div62 = d3.select(".graph62").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
        
    // Construct the drawing canvas    
    svg62 = d3.select(".graph62").append("svg")
        .attr("width", width62 + margin.left + margin.right)
        .attr("height", height62 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
   
    // x-axis creation
    svg62.append("g")
        .attr("class", "x axis")
        .attr("id" , "rep7x")
        .attr("transform", "translate(0," + height62 + ")")
        .call(xAxis62);
        

    // y-axis creation
    svg62.append("g")
        .attr("class", "y axis")
        .call(yAxis62)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .attr("dx","-0.0em")
        .style("text-anchor", "end")
        .text(lab);

    // Bars creation
    svg62.selectAll(".bar6b")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar6b")
        .attr("x", function(d) { return x62(d[0]); })
        .attr("width", x62.rangeBand())
        .attr("y", function(d , i) {return d[4] < 0 ? y62(0) : y62(d[4]); })
        .attr("height", function(d, i) { return Math.abs( y62(d[4]) - y62(0) ); })
        .style("fill", function (d , i){return d[4] < 0 ? color62[0] : color62[1]})
        .on("mouseover", function(d) {div62.html("<p>" + valFormat(d[4]) + " " + lab2 + "</p>" + "<p>Product: " + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX - 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div62.style("opacity", 0);});
        
    
    // Legend Data    
    legdata62 = ["Difference between inventory and Sales (deficit in red)"];
    
    // Initiate the legend
    legend62 = svg62.selectAll(".legend")
        .data(legdata62)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + eval(30 + i * 20) + ")"; });
    
    // Legend Text (Only text as no more than one bar type exists)
    legend62.append("text")
        .attr("x", width62 - nomW/3)
        .attr("y", - 5)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.75em")
        .text(function(d) { return d; });
    
    // Change the status of the Empty Graph Flag
    graph2empty = false;
    
    // Now indicate that the report had fully run
    run = true;
}

/*-----------------------------------------------------------------------------------------------------------------------*/
    
/* Animation to include Forecast:
================================*/

function animeInclude() {
        
/* Animate First Graph:
----------------------*/

    // Remove old legend component
    svg61.selectAll("g.legend")
        .remove();
        
    legend61.selectAll("rect")
        .remove();
        
    legend61.selectAll("text")
        .remove();
        
    // construct new legend
    legend61 = svg61.selectAll(".legend")
        .data(legdata61b)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + eval(30 + i * 20) + ")"; });
    
    // Construct colored rectangles for legend    
    legend61.append("rect")
        .attr("x", width61 - 100)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d , i) {return color61[i];});
    
    // Add text to the legend
    legend61.append("text")
        .attr("x", width61 - 120)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.75em")
        .text(function(d) { return d; });

    // Animate the forecast bar to appear
    svg61.selectAll(".bar63").transition()
        .duration(1500)                                                  
        .delay(function(d,i){return i*200;})                            
        .ease("sin")                                                    
        .attr("y", function(d) { return y61(parseFloat(d[2]) + parseFloat(d[3])); } )               
        .attr("height", function(d) { return height61 - y61(parseFloat(d[3])); });
        
/* Animate Second Graph:
-----------------------*/
    
    // Update the data limits    
    var upY62 =  d3.max(data, function(d) { return parseFloat(d[5]); });
    var dnY62 =  d3.min(data, function(d) { return parseFloat(d[5]); });
    
    // Update the y axis limits
    var domyLim1 = dnY62 < 0 ? dnY62 :  0;
    var domyLim2 = upY62;
    
    // Update the y axis domain
    y62.domain([domyLim1 , domyLim2]);
    
    // update the y axis scale    
    yAxis62 .scale(y62);
    
    // transition of the bars
    svg62.selectAll(".bar6b").transition()
        .duration(1500)
        .delay(function(d,i){return i*200;})
        .ease("sin")
        .attr("y", function(d , i) {return d[5] < 0 ? y62(0) : y62(d[5]); })
        .attr("height", function(d, i) { return Math.abs( y62(d[5]) - y62(0) ); })
        .style("fill", function (d , i){return d[5] < 0 ? color62[0] : color62[1]});
        
    // Animate the y axis    
    svg62.select(".y.axis")
		.transition()
		.duration(2000)
		.ease("sin")
		.call(yAxis62);
		
	// Update the tooltip for the second graph    
    svg62.selectAll(".bar6b")
        .on("mouseover", function(d) {div62.html("<p>" + valFormat(d[5]) + " " + lab2 + "</p>" + "<p>Product: " + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX - 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div62.style("opacity", 0);});
    
    
}

/*-----------------------------------------------------------------------------------------------------------------------*/
    
/* Animation to exclude Forecast:
================================*/

function animeExclude() {

/* Animate First Graph:
----------------------*/

    // Remove old legend component
    svg61.selectAll("g.legend")
        .remove();
        
    legend61.selectAll("rect")
        .remove();
        
    legend61.selectAll("text")
        .remove();
        
    // construct new legend
    legend61 = svg61.selectAll(".legend")
        .data(legdata61a)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + eval(30 + i * 20) + ")"; });
    
    // Construct colored rectangles for legend    
    legend61.append("rect")
        .attr("x", width61 - 100)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d , i) {return color61[i];});
    
    // Add text to the legend
    legend61.append("text")
        .attr("x", width61 - 120)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.75em")
        .text(function(d) { return d; });
    
    // Animate the forecast bar to dissappear
    svg61.selectAll(".bar63").transition()
        .duration(1500)                                                  
        .delay(function(d,i){return i*200;})                            
        .ease("sin")                                                    
        .attr("y", function(d) { return y61(parseFloat(d[2])); } )               
        .attr("height", 0);
        
/* Animate the Second Graph:
---------------------------*/
        
    // Update the data limits  
    var upY62 =  d3.max(data, function(d) { return parseFloat(d[4]); });
    var dnY62 =  d3.min(data, function(d) { return parseFloat(d[4]); });
    
    // Update the y axis limits
    var domyLim1 = dnY62 < 0 ? dnY62 :  0;
    var domyLim2 = upY62;
    
    // Update the y axis domain
    y62.domain([domyLim1 , domyLim2]);
    
    // update the y axis scale     
    yAxis62 .scale(y62);
    
    // transition of the bars
    svg62.selectAll(".bar6b").transition()
        .duration(1500)
        .delay(function(d,i){return i*200;})
        .ease("sin")
        .attr("y", function(d , i) {return d[4] < 0 ? y62(0) : y62(d[4]); })
        .attr("height", function(d, i) { return Math.abs( y62(d[4]) - y62(0) ); })
        .style("fill", function (d , i){return d[4] < 0 ? color62[0] : color62[1]});
    
    // Animate the y axis     
    svg62.select(".y.axis")
		.transition()
		.duration(2000)
		.ease("sin")
		.call(yAxis62);
		
	// Update the tooltip for the second graph       
    svg62.selectAll(".bar6b")
        .on("mouseover", function(d) {div62.html("<p>" + valFormat(d[4]) + " " + lab2 + "</p>" + "<p>Product: " + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX - 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div62.style("opacity", 0);});
    
}

/*-----------------------------------------------------------------------------------------------------------------------*/
    
/* Animation to change the DOM:
===============================*/

function changeDom6() {
    
    // Show the options to include sales forecast
    $(".forecastControl").slideDown(dur, "swing");
    
    // Show the results table
    $(".resultTable6").slideDown(dur, "swing");
    
    // Show the first graph if selected
    if (group) {
        $("#reportGraph61").slideDown(dur, "swing");
    }
    
    // Show the second graph if selected
    if (diff) {
        $("#reportGraph62").slideDown(dur, "swing");
    }
    
    // Show the rest button
    $(".reset").slideDown(dur, "swing");
    
}

/*-----------------------------------------------------------------------------------------------------------------------*/
    
/* Reset the report:
================= */

function reportReset6() {
    
/* Changes to the DOM:
---------------------*/

    // Hide the reset button
    $(".reset").slideUp(dur, "swing");
    
    // Hide the result table 
    $(".resultTable6").slideUp(dur, "swing"); 
    
    // Hide the group graph if displayed
    if (group) {
        $("#reportGraph61").slideUp(dur, "swing");
    }
    
    // Hide the difference graph if displayed
    if (diff) {
        $("#reportGraph62").slideUp(dur, "swing");
    }
    
    // Hide the forecast inclusion selection
    $(".forecastControl").slideUp(dur, "swing");
    
/* Empty HTML elemnts:
---------------------*/
    
    // Empty first graph
    $(".graph61").empty();
    
    // Empty second graph
    $(".graph62").empty();
    
    // Empty result table
    $(".resultTable6").empty();
    
/* Reset HTML and flags:
-----------------------*/

    // Reconstruct the table inner HTML
    $(".resultTable6").html('<table id="result6" class="display" width="90%"></table>');
    
    // Reset the graph 1 empty flag
    graph1empty = true;
    
    // Reset the graph 2 empty flag  
    graph2empty = true;
    
    // Reset the Forecast exclusion selection
    document.getElementById("exclude").checked = true;
    
    // Reset the forecasrt inclusion flag
    fore = false;
    

/* Re-run or reset if no run is clicked:
-----------------------------------------*/

    /* Run if the run button is clicked - parameters could be changed
    ----------------------------------------------------------------*/
    
    if (run) {
        
         // Variable for grouped graph selection
        group  = valgraph.grgraph.checked ? true : false;
    
        // Variable for differenced graph selection
        diff   = valgraph.difgraph.checked ? true: false;
        
        // restart the report initiation
        initiate6();
    }
    
    /* Reset if the reset button is clicked - restore default parameters
    -------------------------------------------------------------------*/
    
    else {
        
        // Reset selected month to default value
        $("#month option").prop("selected" , function (){
            return this.defaultSelected;
        });
        
        // reset selected quarter to default value
        $("#quart option").prop("selected" , function (){
            return this.defaultSelected;
        });
    
        // Reset Selection of month frequency
        document.getElementById("mon").checked = true;
        
        // Rset Selection of grouped graph
        document.getElementById("group").checked = true;
        
        // Reset Selection of difference graph
        document.getElementById("diff").checked = true;
        
        // Reset default value of the group graph flag
        group  = valgraph.grgraph.checked ? true : false;
        
        // reset default value of the difference graph flag
        diff   = valgraph.difgraph.checked ? true: false;
    }
}