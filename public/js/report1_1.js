
/* Initate Report:
=================*/
function initiate1() {
   
    // Capture selected frequency
    freq  = document.getElementById("mon1").checked ? "mon1" : "quar1";
    
    // Capture selected month
    month = $("#month1").val();
    
    // Capture selected quarter
    var quarter  = $("#quart1").val();
    
    //initiate parameters variables
    var mon11, mon21, mon31;
    
    // Include month selection if frequency is month
    if (freq === "mon1") {
        mon11 = month , mon21 = month , mon31 = month; 
    }
    
    // include the quarter months if frequency is month
    else {
        
        // First quarter
        if (quarter === "q1") {
            mon11 = "jan" , mon21 = "feb" , mon31 = "mar";
        }
        
        //Second quarter
        else if (quarter === "q2") {
            mon11 = "apr" , mon21 = "may" , mon31 = "jun";
        }
        
        //Third quarter
        else if (quarter === "q3") {
            mon11 = "jul" , mon21 = "aug" , mon31 = "sep";
        }
        
        // Fourth quarter
        else if (quarter === "q4") {
            mon11 = "oct" , mon21 = "nov" , mon31 = "dec";
        }
    }
    
    // Tooltip Text variable
    switch (flag1) {
        case 1:
            text1 = "Customer";
            break;
        case 2:
            text1 = "Product";
            break;
        case 3:
            text1 = "Location";
            break;
        case 4:
            text1 = "Sales Manager";
            break;
        case 5:
            text1 = "Total for Period";
    }
    
    // Construct parameters:
    param = {
        flag:flag1,
        month1:mon11,
        month2:mon21,
        month3:mon31
    };
    
    // Get the data from the server
    getData1(param);
}

/*----------------------------------------------------------------------*/

/* Get Data from server:
=======================*/

function getData1(parameters) {
    
     $.post("php/report1.php",parameters,"json")
    .done(function(data, textStatus, jqXHR) {
        
        makeTable1(data);
        makeChart11(data);
        makeChart12();
        if (flag1 > 2) {
            makeChart13(data);
        }
        else {
            graph13active = 0;
        }
        changeDom1();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
         
        console.log(errorThrown.toString());
    });
}

/*----------------------------------------------------------------------------*/

/* Construct the results table:
==============================*/

function makeTable1(datatable) {
    
    $.fn.dataTable.ext.errMode = 'none';
    
    // Table without Target
    if (flag1 <= 2) {
         $('#result1').DataTable( {
        data: datatable,
        columns: [
            { title: text1 },
            { title: "Sales Revenue" },
            { title: "Forecast Revenue"},
            { title: "Sales Cost"},
            { title: "Forecast Cost"},
            { title: "Sales Profit"},
            { title: "Profit with Forecast"}
        ]
    });
    }
    
    // Table with Target
    else {
         $('#result1').DataTable( {
        data: datatable,
        columns: [
            { title: text1 },
            { title: "Sales Revenue" },
            { title: "Forcast Revenue"},
            { title: "Sales Cost"},
            { title: "Forecast Cost"},
            { title: "Sales Profit"},
            { title: "Profit with Forecast"},
            { title: "Sales Target"},
            { title: "% Achieved"}
        ]
    });
    }
   
    
}

/*-----------------------------------------------------------------------------*/

/* Construct the First Chart:
============================*/

function makeChart11(dataraw) {
    
    // Start with clearing out the DOM
    if($(".graph11").html()) {
        $(".graph11").empty();
    }
    
    //Data to be graphed imported only once
    data = dataraw;
    
    // Constructing a numerical 2D array
    var datablock =[];
    for (var i = 0, n = data.length; i < n; i++)
    {
        datablock.push([Number(data[i][1]), Number(data[i][3])]);
    }
    
    // Selector for the y axis label
    lab1 = "Amount $";
    
    // Selector for the Units for the tooltip
    lab12 = "$";
    
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
    width1 = nomW ;
    height1 = nomH;
    
    // Initiation of the x-axis scale
    x11 = d3.scale.ordinal()
        .rangeRoundBands([0, width1 - 30], .1)
        .domain(data.map(function(d) { return d[0]; }));
    
    // Acquire the data absolute maximum    
    var upY11 =  d3.max(datablock, function (line) {return d3.max(line, function (d) {return d})});
    
    // initiation of the y axis scale
    y11 = d3.scale.linear()
        .range([height1, 0])
        .domain([0, upY11]);
        
    // initiation of the x axis object
    xAxis11 = d3.svg.axis()
        .scale(x11)
        .orient("bottom");
    
    // initiation of the y axis object
    yAxis11 = d3.svg.axis()
        .scale(y11)
        .orient("left")
        .tickFormat(axFormat);
    
    // Graph color matrix    
    color11 = ['#f90' , '#66f', '#99f', '#fc6'];
    
    
    // Initiation of the tooltip
    div11 = d3.select(".graph11").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
        
    // Construct the drawing canvas   
    svg11 = d3.select(".graph11").append("svg")
        .attr("width", width1 + margin.left + margin.right)
        .attr("height", height1 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
   
    // x-axis creation
    svg11.append("g")
        .attr("class", "x axis repx")
        .attr("id" , "rep7x")
        .attr("transform", "translate(" + nomW/30 + ", " + height1 + ")")
        .call(xAxis11);

    // y-axis creation
    svg11.append("g")
        .attr("class", "y axis")
        .call(yAxis11)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .attr("dx","-2.1em")
        .style("text-anchor", "end")
        .text(lab1);

    // First bars creation gros sales
    svg11.selectAll(".bar11")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar11")
        .attr("x", function(d) { return x11(d[0]); })
        .attr("width", x11.rangeBand()/2)
        .attr("y", function(d) { return y11(parseFloat(d[1])); })
        .attr("height", function(d) { return height1 - y11(parseFloat(d[1])); })
        .style("fill", function (d , i){return color11[1]})
        .on("mouseover", function(d) {div11.html("<p>" + valFormat(d[1]) + lab12 + "</p>" + "<p>" + text1 + ": " + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX - 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div11.style("opacity", 0);});
     
    // Second bars creation gross cost   
    svg11.selectAll(".bar12")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar12")
        .attr("x", function(d) { return x11(d[0]) + x11.rangeBand()/2; })
        .attr("width", x11.rangeBand()/2)
        .attr("y", function(d) { return y11(parseFloat(d[3])); })
        .attr("height", function(d) { return height1 - y11(parseFloat(d[3])); })
        .style("fill", function (d , i){return color11[0]})
        .on("mouseover", function(d) {div11.html("<p>" + valFormat(d[3]) + lab12 + "</p>" + "<p>" + text1 + ": " + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div11.style("opacity", 0);});
    
    // Third bars creation forecast cost   
    svg11.selectAll(".bar13")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar13")
        .attr("x", function(d) { return x11(d[0]) + x11.rangeBand()/2; })
        .attr("width", x11.rangeBand()/2)
        .attr("y", function(d) { return y11(parseFloat(d[3])); })
        .attr("height", 0)
        .style("fill", function (d , i){return color11[3]})
        .on("mouseover", function(d) {return div11.html("<p>" + valFormat(d[4]) +  lab12 + "</p>" +
                "<p>Total: " + valFormat(parseFloat(d[3]) + parseFloat(d[4])) + "</p>" + "<p>" + text1 + ": "  + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div11.style("opacity", 0);});
        
    // Fourth bars creation forecast sales  
    svg11.selectAll(".bar14")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar14")
        .attr("x", function(d) { return x11(d[0]); })
        .attr("width", x11.rangeBand()/2)
        .attr("y", function(d) { return y11(parseFloat(d[1])); })
        .attr("height", 0)
        .style("fill", function (d , i){return color11[2]})
        .on("mouseover", function(d) {div11.html("<p>" + valFormat(d[2]) +  lab12 + "</p>" + "<p>" + 
                "<p>Total: " + valFormat(parseFloat(d[1]) + parseFloat(d[2])) + "</p>" + "<p>" + text1 + ": "  + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX + 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div11.style("opacity", 0);});
    
    // Legend data    
    legdata11a = ["Cost" , "Sales Revenue"];
    
    legdata11b = ["Cost" , "Sales Revenue", "Forecast Revenue" , "Forecast Cost"];
    
    // Initiate Legend
    legend11 = svg11.selectAll(".legend")
        .data(legdata11a)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(40," + eval(i * 20) + ")"; });
    
    // Construct colored rectangles for legend    
    legend11.append("rect")
        .attr("x", width1 - 100)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d , i) {return color11[i];});
    
    // Add text to the legend
    legend11.append("text")
        .attr("x", width1 - 120)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.75em")
        .text(function(d) { return d; });
    
    // Change the status of the Empty Graph Flag
    graph11active = 1;
}

/*-----------------------------------------------------------------------------------------------------------------------*/

/* Construct the Second Chart:
============================*/

function makeChart12() {
    
    // Start with clearing out the DOM 
    if($(".graph12").html()) {
        $(".graph12").empty();
    }
    
    
    // Initiation of the x-axis scale
    x12 = d3.scale.ordinal()
        .rangeRoundBands([0, width1], .3)
        .domain(data.map(function(d) { return d[0]; }));
    
    // Take the data limits in case without forecast
    var upY12 =  d3.max(data, function(d) { return parseFloat(d[5]); });
    var dnY12 =  d3.min(data, function(d) { return parseFloat(d[5]); });
    
    // Set the y axis limits according to the data
    var domyLim1 = dnY12 < 0 ? dnY12 :  0;
    var domyLim2 = upY12;
    
    // initiation of the y axis scale
    y12 = d3.scale.linear()
        .range([height1, 0])
        .domain([domyLim1 , domyLim2]);
        
    // initiation of the x axis object
    xAxis12 = d3.svg.axis()
        .scale(x12)
        .orient("bottom");
    
    // initiation of the y axis object
    yAxis12 = d3.svg.axis()
        .scale(y12)
        .orient("left")
        .tickFormat(axFormat);
        
    color12 = ['#900' , '#06c'];
    
    
    // initiation of the tooltip
    div12 = d3.select(".graph12").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
        
    // Construct the drawing canvas    
    svg12 = d3.select(".graph12").append("svg")
        .attr("width", width1 + margin.left + margin.right)
        .attr("height", height1 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
   
    // x-axis creation
    svg12.append("g")
        .attr("class", "x axis")
        .attr("id" , "rep7x")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xAxis12);
        

    // y-axis creation
    svg12.append("g")
        .attr("class", "y axis")
        .call(yAxis12)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .attr("dx","-0.0em")
        .style("text-anchor", "end")
        .text(lab1);

    // Bars creation
    svg12.selectAll(".bar1b")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar1b")
        .attr("x", function(d) { return x12(d[0]); })
        .attr("width", x12.rangeBand())
        .attr("y", function(d , i) {return d[5] < 0 ? y12(0) : y12(d[5]); })
        .attr("height", function(d, i) { return Math.abs( y12(d[5]) - y12(0) ); })
        .style("fill", function (d , i){return d[5] < 0 ? color12[0] : color12[1]})
        .on("mouseover", function(d) {div12.html("<p>" + valFormat(d[5]) +  lab12 + "</p>" + "<p>" + text1 + ": " + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX - 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div12.style("opacity", 0);});
        
    
    // Legend Data    
    legdata12 = ["Net Sales Profit in USD (Loss in red)"];
    
    // Initiate the legend
    legend12 = svg12.selectAll(".legend")
        .data(legdata12)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + eval(i * 20) + ")"; });
    
    // Legend Text (Only text as no more than one bar type exists)
    legend12.append("text")
        .attr("x", width1 - nomW/3)
        .attr("y", - 5)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.75em")
        .text(function(d) { return d; });
    
    // Change the status of the Empty Graph Flag
    graph12active = 1;
    
    // Now indicate that the report had fully run
    run = (flag1 < 3)? true:false;
}

/*-----------------------------------------------------------------------------------------------------------------------*/

/* Construct the Third Chart:
============================*/

function makeChart13() {
 
    // Start with clearing out the DOM 
    if($(".graph13").html()) {
        $(".graph13").empty();
    }
    
    // Axis in percentage
    var axFormat13 = d3.format(".2%");
    
    // Initiation of the x-axis scale
    x13 = d3.scale.ordinal()
        .rangeRoundBands([0, nomW], .3)
        .domain(data.map(function(d) { return d[0]; }));
    
    // Take the data limits in case without forecast
    var upY13 =  d3.max(data, function(d) { return parseFloat(d[1]/parseFloat(d[7])); });
    
    
    // initiation of the y axis scale
    y13 = d3.scale.linear()
        .range([nomH, 0])
        .domain([0 , upY13]);
        
    // initiation of the x axis object
    xAxis13 = d3.svg.axis()
        .scale(x13)
        .orient("bottom");
    
    // initiation of the y axis object
    yAxis13 = d3.svg.axis()
        .scale(y13)
        .orient("left")
        .tickFormat(axFormat13);
        
    color13 = ['#900' , '#06c'];
    
    
    // initiation of the tooltip
    div13 = d3.select(".graph13").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
        
    // Construct the drawing canvas    
    svg13 = d3.select(".graph13").append("svg")
        .attr("width", nomW + margin.left + margin.right)
        .attr("height", nomH + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
   
    // x-axis creation
    svg13.append("g")
        .attr("class", "x axis")
        .attr("id" , "rep7x")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xAxis13);
        

    // y-axis creation
    svg13.append("g")
        .attr("class", "y axis")
        .call(yAxis13)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "1em")
        .attr("dx","-0.0em")
        .style("text-anchor", "end")
        .text(lab1);

    // Bars creation
    svg13.selectAll(".bar1c")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar1c")
        .attr("x", function(d) { return x13(d[0]); })
        .attr("width", x13.rangeBand())
        .attr("y", function(d , i) {return y13(parseFloat(d[1])/parseFloat(d[7])); })
        .attr("height", function(d) { return nomH - y13(parseFloat(d[1])/parseFloat(d[7])); })
        .style("fill", function (d , i){return parseFloat(d[1])/parseFloat(d[7]) < 0.7 ? color13[0] : color13[1]})
        .on("mouseover", function(d) {div13.html("<p>" + text1 + ": " + d[0] + "</p><p>" + "<P>Target: " + 
                                valFormat(parseFloat(d[7])) + lab12  + "</p><p>" + "<p>Achieved: " + valFormat(parseFloat(d[1])) + lab12 + "</p><p>" + 
                                valFormat(100 * parseFloat(d[1])/d[7]) + "%")
        .style("opacity",1)
        .style("left", (event.pageX - 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div13.style("opacity", 0);});
        
    
    // Legend Data    
    legdata13 = ["Target Achievement for " + text1 + " " + "(Below 70% in red)"];
    
    // Initiate the legend
    legend13 = svg13.selectAll(".legend")
        .data(legdata13)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + eval(i * 20) + ")"; });
    
    // Legend Text (Only text as no more than one bar type exists)
    legend13.append("text")
        .attr("x", width1 - nomW/3)
        .attr("y", - 5)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.75em")
        .text(function(d) { return d; });
    
    // Change the status of the Empty Graph Flag
    graph13active = 1;
    
    // Now indicate that the report had fully run
    run = true;
}

/*-----------------------------------------------------------------------------------------------------------------------*/
        
/* Animation to include Forecast:
================================*/

function animeInclude1() {
    
/* Animate Second Graph:
-----------------------*/
    
   // Update the data limits    
    var upY12 =  d3.max(data, function(d) { return parseFloat(d[6]); });
    var dnY12 =  d3.min(data, function(d) { return parseFloat(d[6]); });
    
    // Update the y axis limits
    var domyLim1 = dnY12 < 0 ? dnY12 :  0;
    var domyLim2 = upY12;
    
    // Update the y axis domain
    y12.domain([domyLim1 , domyLim2]);
    
    // update the y axis scale    
    yAxis12 .scale(y12);
    
    // transition of the bars
    svg12.selectAll(".bar1b").transition()
        .duration(1500)
        .delay(function(d,i){return i*200;})
        .ease("sin")
        .attr("y", function(d , i) {return d[6] < 0 ? y12(0) : y12(d[6]); })
        .attr("height", function(d, i) { return Math.abs( y12(d[6]) - y12(0) ); })
        .style("fill", function (d , i){return d[6] < 0 ? color12[0] : color12[1]});
        
    // Animate the y axis    
    svg12.select(".y.axis")
		.transition()
		.duration(2000)
		.ease("sin")
		.call(yAxis12);
		
	// Update the tooltip for the second graph    
    svg12.selectAll(".bar1b")
        .on("mouseover", function(d) {div12.html("<p>" + valFormat(d[6]) +  lab12 + "</p>" + "<p>" + text1 + ": "  + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX - 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div12.style("opacity", 0);});

        
/* Animate First Graph:
----------------------*/

    // Remove old legend component
    svg11.selectAll("g.legend")
        .remove();
        
    // New data limits
    var datablock =[];
    for (var i = 0, n = data.length; i < n; i++)
    {
        datablock.push([Number(data[i][1]) + Number(data[i][2]), Number(data[i][3]) + Number(data[i][4])]);
    }
    
    // Update the data limits    
    var upY11 =  d3.max(datablock, function (line) {return d3.max(line, function (d) {return d})});
    
    // Update the y axis domain
    y11.domain([0 , upY11]);
    
    // update the y axis scale    
    yAxis11 .scale(y11);
    
    legend11.selectAll("rect")
        .remove();
        
    legend11.selectAll("text")
        .remove();
        
    // construct new legend
    legend11 = svg11.selectAll(".legend")
        .data(legdata11b)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + nomW/30 + ", " + eval(i * 20) + ")"; });
    
    // Construct colored rectangles for legend    
    legend11.append("rect")
        .attr("x", nomW - 100)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d , i) {return color11[i];});
    
    // Add text to the legend
    legend11.append("text")
        .attr("x", nomW - 120)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.75em")
        .text(function(d) { return d; });
        
    // Animate the y axis    
    svg11.select(".y.axis")
		.transition()
		.duration(2000)
		.ease("sin")
		.call(yAxis11);
		
	// Animate the gros sales
    svg11.selectAll(".bar11").transition()
        .duration(1500)
        .delay(function(d,i){return i*200;}) 
        .ease("sin")
        .attr("y", function(d) { return y11(parseFloat(d[1])); })
        .attr("height", function(d) { return nomH - y11(parseFloat(d[1])); });
        
    // Animate the gross cost
     svg11.selectAll(".bar12").transition()
        .duration(1500)
        .delay(function(d,i){return i*200;}) 
        .ease("sin")
        .attr("y", function(d) { return y11(parseFloat(d[3])); })
        .attr("height", function(d) { return nomH - y11(parseFloat(d[3])); });

    // Animate the forecast cost bars to appear
    svg11.selectAll(".bar13").transition()
        .duration(1500)                                                  
        .delay(function(d,i){return i*200;})                            
        .ease("sin")                                                    
        .attr("y", function(d) { return y11(parseFloat(d[3]) + parseFloat(d[4])); } )               
        .attr("height", function(d) { return nomH - y11(parseFloat(d[4])); }); 
        
    // Animate the forecast sales bars to appear
    svg11.selectAll(".bar14").transition()
        .duration(1500)                                                  
        .delay(function(d,i){return i*200;})                            
        .ease("sin")                                                    
        .attr("y", function(d) { return y11(parseFloat(d[1]) + parseFloat(d[2])); } )               
        .attr("height", function(d) {return nomH - y11(parseFloat(d[2])); }); 
        

/* Animate Third Graph:
----------------------*/

    if(flag1 > 2 ) {
        
        // Take the data limits in case with forecast
        var upY13 =  d3.max(data, function(d) { return (Number(d[1]) + Number(d[2]))/Number(d[7]) });
        
        // Update the y axis domain
        y13.domain([0 , upY13]);
        
        // update the y axis scale    
        yAxis13 .scale(y13);
        
        // Animate the y axis    
        svg13.select(".y.axis")
    		.transition()
    		.duration(2000)
    		.ease("sin")
    		.call(yAxis13);
    	
    	// Animate the gros sales
        svg13.selectAll(".bar1c")
            .transition()
            .duration(1500)
            .delay(function(d,i){return i*200;}) 
            .ease("sin")
            .attr("y", function(d) { return y13( (Number(d[1]) + Number(d[2]))  /  Number(d[7]) );})
            .attr("height", function(d) { return nomH - y13(   (Number(d[1]) + Number(d[2]))  /  Number(d[7]) ); })
            .style("fill", function (d , i){return ( Number(d[1]) + Number(d[2]))  /  Number(d[7] ) < 0.7 ? color13[0] : color13[1]});
        
        // Update the tooltip for the second graph      
        svg13.selectAll(".bar1c")
            .on("mouseover", function(d) {div13.html("<p>" + text1 + ": " + d[0] + "</p><p>" + "<P>Target: " + 
                                    valFormat(parseFloat(d[7])) + lab12  + "</p><p>" + "<p>Achieved: " + valFormat(parseFloat(d[1]) + parseFloat(d[2])) + lab12 + "</p><p>" + 
                                    valFormat(100  * ( (Number(d[1]) + Number(d[2]))  /  Number(d[7]) )) + "%")
            .style("opacity",1)
            .style("left", (event.pageX - 15) + "px")
            .style("top", (event.pageY - $(document).scrollTop) + "px");})
            .on("mouseout", function (d){ div13.style("opacity", 0);});
            
    }
        
}


/*-----------------------------------------------------------------------------------------------------------------------*/
    
/* Animation to exclude Forecast:
================================*/

function animeExclude1() {
    
    
/* Animate Second Graph:
-----------------------*/
    
   // Update the data limits    
    var upY12 =  d3.max(data, function(d) { return parseFloat(d[5]); });
    var dnY12 =  d3.min(data, function(d) { return parseFloat(d[5]); });
    
    // Update the y axis limits
    var domyLim1 = dnY12 < 0 ? dnY12 :  0;
    var domyLim2 = upY12;
    
    // Update the y axis domain
    y12.domain([domyLim1 , domyLim2]);
    
    // update the y axis scale    
    yAxis12 .scale(y12);
    
    // transition of the bars
    svg12.selectAll(".bar1b").transition()
        .duration(1500)
        .delay(function(d,i){return i*200;})
        .ease("sin")
        .attr("y", function(d , i) {return d[5] < 0 ? y12(0) : y12(d[5]); })
        .attr("height", function(d, i) { return Math.abs( y12(d[5]) - y12(0) ); })
        .style("fill", function (d , i){return d[5] < 0 ? color12[0] : color12[1]});
        
    // Animate the y axis    
    svg12.select(".y.axis")
		.transition()
		.duration(2000)
		.ease("sin")
		.call(yAxis12);
		
	// Update the tooltip for the second graph    
    svg12.selectAll(".bar1b")
        .on("mouseover", function(d) {div12.html("<p>" + valFormat(d[5]) +  lab12 + "</p>" + "<p>" + text1 + ": " + d[0] + " </p>")
        .style("opacity",1)
        .style("left", (event.pageX - 15) + "px")
        .style("top", (event.pageY - $(document).scrollTop) + "px");})
        .on("mouseout", function (d){ div12.style("opacity", 0);});
        

/* Animate First Graph:
----------------------*/

    // Remove old legend component
    svg11.selectAll("g.legend")
        .remove();
        
    // New data limits
    var datablock =[];
    for (var i = 0, n = data.length; i < n; i++)
    {
        datablock.push([Number(data[i][1]), Number(data[i][3])]);
    }
    
    // Update the data limits    
    var upY11 =  d3.max(datablock, function (line) {return d3.max(line, function (d) {return d})});
    
    // Update the y axis domain
    y11.domain([0 , upY11]);
    
    // update the y axis scale    
    yAxis11 .scale(y11);
    
    legend11.selectAll("rect")
        .remove();
        
    legend11.selectAll("text")
        .remove();
        
    // construct new legend
    legend11 = svg11.selectAll(".legend")
        .data(legdata11a)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + nomW/30 + ", " + eval(i * 20) + ")"; });
    
    // Construct colored rectangles for legend    
    legend11.append("rect")
        .attr("x", nomW - 100)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d , i) {return color11[i];});
    
    // Add text to the legend
    legend11.append("text")
        .attr("x", nomW - 120)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.75em")
        .text(function(d) { return d; });
        
    // Animate the y axis    
    svg11.select(".y.axis")
		.transition()
		.duration(2000)
		.ease("sin")
		.call(yAxis11);
		
	// Animate the gros sales
    svg11.selectAll(".bar11").transition()
        .duration(1500)
        .delay(function(d,i){return i*200;}) 
        .ease("sin")
        .attr("y", function(d) { return y11(parseFloat(d[1])); })
        .attr("height", function(d) { return nomH - y11(parseFloat(d[1])); });
        
    // Animate the gross cost
     svg11.selectAll(".bar12").transition()
        .duration(1500)
        .delay(function(d,i){return i*200;}) 
        .ease("sin")
        .attr("y", function(d) { return y11(parseFloat(d[3])); })
        .attr("height", function(d) { return nomH - y11(parseFloat(d[3])); });

    // Animate the forecast cost bars to dissapear
    svg11.selectAll(".bar13").transition()
        .duration(1500)                                                  
        .delay(function(d,i){return i*200;})                            
        .ease("sin")                                                    
        .attr("y", function(d) { return y11(parseFloat(d[3])); })
        .attr("height", 0);
        
    // Animate the forecast sales bars to appear
    svg11.selectAll(".bar14").transition()
        .duration(1500)                                                  
        .delay(function(d,i){return i*200;})                            
        .ease("sin")                                                    
        .attr("y", function(d) { return y11(parseFloat(d[1])); })
        .attr("height", 0);
        
        
/*Animate Third Graph:
---------------------*/

    if (flag1 > 2) {
        
         // Take the data limits in case with forecast
        var upY13 =  d3.max(data, function(d) { return Number(d[1])/Number(d[7]) });
        
        // Update the y axis domain
        y13.domain([0 , upY13]);
        
        // update the y axis scale    
        yAxis13 .scale(y13);
        
        // Animate the y axis    
        svg13.select(".y.axis")
    		.transition()
    		.duration(2000)
    		.ease("sin")
    		.call(yAxis13);
    	
    	// Animate the gros sales
        svg13.selectAll(".bar1c")
            .transition()
            .duration(1500)
            .delay(function(d,i){return i*200;}) 
            .ease("sin")
            .attr("y", function(d) { return y13( Number(d[1])/Number(d[7]) );})
            .attr("height", function(d) { return nomH - y13(   Number(d[1])/Number(d[7]) ); })
            .style("fill", function (d , i){return (Number(d[1])/Number(d[7])) < 0.7 ? color13[0] : color13[1]});
        
        // Update the tooltip for the third graph      
        svg13.selectAll(".bar1c")
            .on("mouseover", function(d) {div13.html("<p>" + text1 + ": " + d[0] + "</p><p>" + "<P>Target: " + 
                                    valFormat(parseFloat(d[7])) + lab12  + "</p><p>" + "<p>Achieved: " + valFormat(parseFloat(d[1])) + lab12 + "</p><p>" + 
                                    valFormat(100  * (Number(d[1])/Number(d[7]))) + "%")
            .style("opacity",1)
            .style("left", (event.pageX - 15) + "px")
            .style("top", (event.pageY - $(document).scrollTop) + "px");})
            .on("mouseout", function (d){ div13.style("opacity", 0);});
    }
}

/*-----------------------------------------------------------------------------------------------------------------------*/
    
/* Animation to change the DOM:
===============================*/

function changeDom1() {
    
    // Change the content of the selection control:
    $(".selectionControl h3").html("Display Options for Category:<p>" + text1 + "</p>");
    
    // Hide or show the third graph control button
    if (flag1 < 3) {
        $("#targ13").hide();
    }
    else {
        $("#targ13").show();
    }
    
    // Show the report display options
    $(".selectionControl").slideDown(dur, "swing");
    
    // Show the first graph
    $("#reportGraph12").slideDown(dur);
    
    // Show the second graph if selected
    $("#reportGraph11").slideDown(dur);
    
    // Show the graph graph if it exists
    if(flag1 > 2) {
        $("#reportGraph13").slideDown(dur);
    }
    
    // Show the results table
    $(".resultTable1").slideDown(dur);
    
    // Show the rest button
    $(".reset").slideDown(dur);
    
}

/*-----------------------------------------------------------------------------------------------------------------------*/