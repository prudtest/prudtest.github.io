<?php

 
 /* Database Handling Module:
 ===========================*/
 
 require (__DIR__ . "/../../dbfiles/db.php");
 
 /* Parameters Construction:
 ===========================*/
 
 $val1 = $_POST["month1"];
 $val2 = $_POST["month2"];
 $val3 = $_POST["month3"];
 $flag = $_POST["flag"];
 
 
/* Database test module: 
-----------------------*/
 /*$flag = 5;
 $val1 = "jan";
 $val2 = "feb";
 $val3 = "mar";*/

 
 /* Query Template (not necessary useful but included for documentation purpose):
 ===============================================================================
 
 $querytext=  "SELECT element, SUM(grossales) AS totalsales, 
                SUM(grosfrcst) AS totalforecast, SUM(groscost) AS costofsales, 
                SUM(forecost) AS costofforecast, SUM(grossales - grosfrcst) AS salesrevenue, 
                SUM(grossales + grosfrcst - groscost - forecost) AS forecastrevenue, 
                SUM(tottarget) AS objective FROM (
                    SELECT * FROM (
                        SELECT forecast.location AS element, SUM( forecast.backlog * forecast.unitprice ) AS grossales,
                        SUM( forecast.forecast_qty * forecast.unitprice ) AS grosfrcst, 
                        SUM( forecast.backlog * costs.cost ) AS groscost, 
                        SUM( forecast.forecast_qty * costs.cost ) AS forecost, 
                        forecast.month FROM forecast INNER JOIN costs ON forecast.product = costs.product 
                        GROUP BY element, month
                    ) AS q1 LEFT JOIN (
                        SELECT targets.location, SUM(targets.target) AS tottarget, targets.month AS period FROM targets GROUP BY
                        location, month
                    ) AS q2 ON q1.element = q2.location AND q1.month = q2.period
                ) AS q3
                WHERE q3.month = ?
                OR q3.month = ?
                OR q3.month = ?
                GROUP BY q3.element"; */
             
 /* Actual Database queries (customized and sanitized for every case):
 ====================================================================*/
 
 // For customer Element
 $querytext1 = "SELECT element , grossales, grosfrcst, groscost , forecost , (grossales - groscost) AS revenuesales , 
                (grossales + grosfrcst - groscost - forecost) AS revenueforcast 
                FROM (SELECT forecast.customer AS element , 
                SUM(forecast.backlog * forecast.unitprice) AS grossales , 
                SUM(forecast.forecast_qty * forecast.unitprice) AS grosfrcst ,
                SUM(forecast.backlog * costs.cost) AS groscost , 
                SUM(forecast.forecast_qty * costs.cost) AS forecost, forecast.month 
                FROM forecast INNER JOIN costs ON forecast.product = costs.product 
                WHERE forecast.month = ? 
                OR forecast.month = ?
                OR forecast.month = ?
                GROUP BY element) 
                AS q1";
                
 // For product Element
 $querytext2 = "SELECT element , grossales, grosfrcst, groscost , forecost , (grossales - groscost) AS revenuesales , 
                (grossales + grosfrcst - groscost - forecost) AS revenueforcast 
                FROM (SELECT forecast.product AS element , 
                SUM(forecast.backlog * forecast.unitprice) AS grossales , 
                SUM(forecast.forecast_qty * forecast.unitprice) AS grosfrcst ,
                SUM(forecast.backlog * costs.cost) AS groscost , 
                SUM(forecast.forecast_qty * costs.cost) AS forecost, forecast.month 
                FROM forecast INNER JOIN costs ON forecast.product = costs.product 
                WHERE forecast.month = ? 
                OR forecast.month = ?
                OR forecast.month = ?
                GROUP BY element) 
                AS q1";
                
 // For location Element
 $querytext3 = "SELECT element, SUM(grossales) AS totalsales, 
                SUM(grosfrcst) AS totalforecast, SUM(groscost) AS costofsales, 
                SUM(forecost) AS costofforecast, SUM(grossales - groscost) AS salesrevenue, 
                SUM(grossales + grosfrcst - groscost - forecost) AS forecastrevenue, 
                SUM(tottarget) AS objective, (100 * SUM(grossales)/SUM(tottarget)) AS actachieved FROM (
                    SELECT * FROM (
                        SELECT forecast.location AS element, SUM( forecast.backlog * forecast.unitprice ) AS grossales,
                        SUM( forecast.forecast_qty * forecast.unitprice ) AS grosfrcst, 
                        SUM( forecast.backlog * costs.cost ) AS groscost, 
                        SUM( forecast.forecast_qty * costs.cost ) AS forecost, 
                        forecast.month FROM forecast INNER JOIN costs ON forecast.product = costs.product 
                        GROUP BY element, month
                    ) AS q1 LEFT JOIN (
                        SELECT targets.location, SUM(targets.target) AS tottarget, targets.month AS period FROM targets GROUP BY
                        location, month
                    ) AS q2 ON q1.element = q2.location AND q1.month = q2.period
                ) AS q3
                WHERE q3.month = ?
                OR q3.month = ?
                OR q3.month = ?
                GROUP BY q3.element";
               
 // For salesperson Element
 $querytext4 = "SELECT element, SUM(grossales) AS totalsales, 
                SUM(grosfrcst) AS totalforecast, SUM(groscost) AS costofsales, 
                SUM(forecost) AS costofforecast, SUM(grossales - groscost) AS salesrevenue, 
                SUM(grossales + grosfrcst - groscost - forecost) AS forecastrevenue, 
                SUM(tottarget) AS objective, (100 * SUM(grossales)/SUM(tottarget)) AS actachieved FROM (
                    SELECT * FROM (
                        SELECT forecast.salesperson AS element, SUM( forecast.backlog * forecast.unitprice ) AS grossales,
                        SUM( forecast.forecast_qty * forecast.unitprice ) AS grosfrcst, 
                        SUM( forecast.backlog * costs.cost ) AS groscost, 
                        SUM( forecast.forecast_qty * costs.cost ) AS forecost, 
                        forecast.month FROM forecast INNER JOIN costs ON forecast.product = costs.product 
                        GROUP BY element, month
                    ) AS q1 LEFT JOIN (
                        SELECT targets.salesperson, SUM(targets.target) AS tottarget, targets.month AS period FROM targets GROUP BY
                        salesperson, month
                    ) AS q2 ON q1.element = q2.salesperson AND q1.month = q2.period
                ) AS q3
                WHERE q3.month = ? 
                OR q3.month = ?
                OR q3.month = ?
                GROUP BY q3.element";
               
 // For totals Element
 $querytext5 = "SELECT period, grossales, grosfrcst, groscost, forecost, (grossales - groscost) AS revenuesales, 
               (grossales + grosfrcst - groscost - forecost) AS revenueforcast, 
               SUM( targets.target ) AS objective , (100 * grossales/SUM(targets.target)) AS actachieved FROM (SELECT SUM( forecast.backlog * forecast.unitprice ) AS grossales, 
               SUM( forecast.forecast_qty * forecast.unitprice ) AS grosfrcst, SUM( forecast.backlog * costs.cost ) AS groscost, 
               SUM( forecast.forecast_qty * costs.cost ) AS forecost, forecast.month AS period
               FROM forecast
               INNER JOIN costs ON forecast.product = costs.product
               GROUP BY month) AS q1
               INNER JOIN targets ON q1.period = targets.month
               WHERE (q1.period =  ? AND targets.month =  ?)
               OR (q1.period =  ? AND targets.month =  ?)
               OR (q1.period =  ? AND targets.month =  ?)
               GROUP BY q1.period";
 
 /* Query Selection:
 ==================*/
 
 switch ($flag) {
  
        // For customer case
        case 1 :
              $output = DB::sqlquery ($querytext1, $val1, $val2, $val3); 
              break;
              
        // For product case      
        case 2 :
              $output = DB::sqlquery ($querytext2, $val1, $val2, $val3); 
              break;
              
        // For location case      
        case 3 :
              $output = DB::sqlquery ($querytext3, $val1, $val2, $val3);
              break;
               
        // For sales person case        
        case 4 :
              $output = DB::sqlquery ($querytext4, $val1, $val2, $val3);
              break;
              
        // For total case      
        case 5 :
              $output = DB::sqlquery ($querytext5, $val1, $val1, $val2, $val2, $val3, $val3);
              break;
              
        // A default case of totals for management      
        default :
              $output = DB::sqlquery ($querytext5, $val1, $val2, $val3);
              
 }
                          
 /* Data Analytics:
 =================*/
                          
/*******************************************************************************************************
*                                                                                                      *
*                                                                                                      *
*                                                                                                      *
*                                     P R U D A N    A R E A                                           *
*                                                                                                      *
*                                                                                                      *
*                                                                                                      *
********************************************************************************************************/
 
 /* Response to client including results:
 =======================================*/
 
 header("Content-type: application/json");
 print(json_encode($output, JSON_PRETTY_PRINT));
 
?>