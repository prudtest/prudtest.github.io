/* Report for inventory performance vs sales - REPORT 6
======================================================*/

/* Global variables Declaration:
================================*/

// Get the selection of the period either per month or per quarter
var freq;

// Get the desired month
var month;

// Get the sale forecast inclusion option
var fore  = false;

// Flag for Analysis type
var flag1 = 0;

// Flag for Graph 1 Empty
var graph11active = 0;

// Flag for Graph 2 Empty
var graph12active = 0;

// Flag for Graph 3 Empty
var graph13active = 0;

// Flag for report run
var run  = false;

// Initiation for the query parameters
var param = [];

// Sliding duration control
var dur = 5000;

/*----------------------------------------------------------*/

/* Function to hold the Selection Menu:
======================================*/

function travel_stop1() {
    
    // Position tracker
    var pos = $("#track1").scrollTop();
    
    // Limit to start fixing the selector
    var strt = 0.65 * window.innerHeight;
    
    // Limit to end the fixation of the selector
    var term;
    
    // indicator variable for active graphs
    var gr = graph11active + graph12active + graph13active;
    
    // Limit if three graphs exist
    term = strt + gr * 0.4 * window.innerWidth;
    
    // Fixing the selector
    if ( pos > strt && pos < term && (diff || group) && gr > 0) {
        $('.selectionControl').addClass('stick');
        $('#selection-anchor1').height($('.selectionControl').outerHeight());
        $('#graphbuttons1').removeClass('btn-group-justified');
        
    // Transforming back to scrollable div    
    } else {
        $('.selectionControl').removeClass('stick');
        $('#graphbuttons1').addClass('btn-group-justified');
        $('#selection-anchor1').height(0);
    }
}

/*----------------------------------------------------------*/ 

/* Main View Control:
=====================*/

$(function () {
    
    /* Main Run Button (First Option):
    --------------------------------*/
    $("#run11").click(function () {
        
        // Set the flag
        flag1 = 1;
        
        // Check if already initiated
        if (!run) {
            initiate1();
        }
        
        // Otherwise reset before initiation
        else {
            reportReset1();
        }
    });
    
    /* Main Run Button (Second Option):
    ----------------------------------*/
    $("#run12").click(function () {
        
        // Set the flag
        flag1 = 2;
        
        // Check if already initiated
        if (!run) {
            initiate1();
        }
        
        // Otherwise reset before initiation
        else {
            reportReset1();
        }
    });
    
    /* Main Run Button (Third Option):
    ---------------------------------*/
    $("#run13").click(function () {
        
         // Set the flag
        flag1 = 3;
        
        // Check if already initiated
        if (!run) {
            initiate1();
        }
        
        // Otherwise reset before initiation
        else {
            reportReset1();
        }
    });
    
    /* Main Run Button (Fourth Option):
    ----------------------------------*/
    $("#run14").click(function () {
        
         // Set the flag
        flag1 = 4;
        
        // Check if already initiated
        if (!run) {
            initiate1();
        }
        
        // Otherwise reset before initiation
        else {
            reportReset1();
        }
    });
    
    /* Main Run Button (Fifth Option):
    --------------------------------*/
    $("#run15").click(function () {
        
         // Set the flag
        flag1 = 5;
        
        // Check if already initiated
        if (!run) {
            initiate1();
        }
        
        // Otherwise reset before initiation
        else {
            reportReset1();
        }
    });
    
    /* Graph Selection:
    -----------------*/
    
    // Toggling Graph 1 (gross values)
    $("#gr11").click( function () {
        
        // visibility variable
        var vis11 = $("#reportGraph11").is(":visible");
        
        // Toggle visibility
        $("#reportGraph11").slideToggle(dur);
        
        // Change label to hide and activate graph
        if (!vis11 && run) {
            $("#gr11").html('Hide Revenue');
            graph11active = 1;
        }
        
        // Change label to show and de-activate graph
        else if ( vis11 && run) {
            $("#gr11").html('Show Revenue');
            graph11active = 0;
        }
       
    });
    
   // Toggling Graph 2 (net values)
    $("#gr12").click( function () {
        
        // visibility variable
        var vis12 = $("#reportGraph12").is(":visible");
        
        // Toggle visibility
        $("#reportGraph12").slideToggle(dur);
        
        // Change label to hide
        if (!vis12 && run) {
            $("#gr12").html('Hide Profit');
            graph12active = 1;
        }
        
        // Change label to show
        else if ( vis12 && run) {
            $("#gr12").html('Show Profit');
            graph12active = 0;
        }
       
    });
    
    // Toggling Graph 3 (target achiement)
    $("#gr13").click( function () {
        
        // visibility variable
        var vis13 = $("#reportGraph13").is(":visible");
        
        if (flag1 > 2){
           
           // Toggle visibility
            $("#reportGraph13").slideToggle(dur);
        
            // Change label to hide and activate
            if (!vis13 && run) {
                $("#gr13").html('Hide Targets');
                graph13active = 1;
            }
            
            // Change label to show and de-activate
            else if ( vis13 && run) {
                $("#gr13").html('Show Targets');
                graph13active = 0;
            } 
        }
        
       
    });
    
    
    /* Forecast Inclusion Animation:
    --------------------------------*/
    
    // Toggle the "With Forecast" button
    $("#fore1").click( function () {
        
        // Transition of graph if forecast is not included
        if (!fore) {
            fore  = true;
            animeInclude1();
            $("#fore1").html("No Forecast");
        }
        
        else {
           fore = false; 
           animeExclude1();
           $("#fore1").html("Add Forecast");
        }
        
    });
   
    
    /* Limiting the scroll of the forecast selector:
    ----------------------------------------------*/
    
    // Stop scrolling for Forecast inclusion 
    $("#track1").scroll(travel_stop1);
   
    travel_stop1();
    
    
    /* Report Reset:
    ----------------*/
    
    $("#reset1").click( function (){
        
        run = false;
        
        // Initiate the reset function
        reportReset1();
    });
    
});


    
/* Reset the report:
================= */

function reportReset1() {
    
/* Changes to the DOM:
---------------------*/

    // Hide the reset button
    $(".reset").slideUp(dur);
    
    // Hide the result table 
    $(".resultTable1").slideUp(dur); 
   
    $("#reportGraph12").slideUp(dur);
    
    $("#reportGraph11").slideUp(dur);
    
    $("#reportGraph13").slideUp(dur);
   
    $(".selectionControl").slideUp(dur);
    
/* Empty HTML elemnts:
---------------------*/
    
    // Empty first graph
    $(".graph11").empty();
    
    // Empty second graph
    $(".graph12").empty();
    
    // Empty third graph
    $(".graph13").empty();
    
    // Empty result table
    $(".resultTable1").empty();
    
/* Reset HTML and flags:
-----------------------*/

    // Reconstruct the table inner HTML
    $(".resultTable1").html('<table id="result1" class="display" width="90%"></table>');
    
    // Reset the graph 1 empty
    graph11active = 0;
    $("#gr11").html('Hide Revenue');
    
    // Reset the graph 2 empty flag  
    graph12active = 0;
    $("#gr12").html('Hide Profit');
    
    // Reset the graph 2 empty flag  
    graph13active = 0;
    $("#gr13").html('Hide Targets');
    
    // Reset the forecasrt inclusion 
    fore = false;
    $("#fore1").html("Add Forecast");
    

/* Re-run or reset if no run is clicked:
-----------------------------------------*/

    /* Run if the run button is clicked - parameters could be changed
    ----------------------------------------------------------------*/
    
    if (run) {
        
        // restart the report initiation
        initiate1();
    }
    
    /* Reset if the reset button is clicked - restore default parameters
    -------------------------------------------------------------------*/
    
    if (!run) {
        
        // Reset selected month to default value
        $("#month1 option").prop("selected" , function (){
            return this.defaultSelected;
        });
        
        // reset selected quarter to default value
        $("#quart1 option").prop("selected" , function (){
            return this.defaultSelected;
        });
    
        // Reset Selection of month frequency
        document.getElementById("mon1").checked = true;
    }
}