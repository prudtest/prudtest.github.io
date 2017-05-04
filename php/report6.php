<?php

 
 /* Database Handling Module:
 ===========================*/
 
 require (__DIR__ . "/../../dbfiles/db.php");
 
 /* Parameters Construction:
 ===========================*/
 
 $val1 = $_POST["moth1"];
 $val2 = $_POST["moth2"];
 $val3 = $_POST["moth3"];
 
 
/* Database test module: 
-----------------------*/
 /*$val1 = "jan";
 $val2 = "feb";
 $val3 = "mar";*/

 
 /* Query Template (not necessary useful but included for documentation purpose):
 ===============================================================================
 
 $querytext= "SELECT forecast.product, forecast.qtytotal, inventory.inqty, SUM(forecast.qtytotal)
             FROM forecast
             INNER JOIN inventory
             ON forecast.product=inventory.product 
             WHERE forecast.month = ?   
             GROUP BY customer";
 */
             
 /* Actual Database query (customized and sanitized):
 ==================================================*/
 
 $output = DB::sqlquery ("SELECT product, SUM(invqty) AS invent, SUM(qty) AS sales, SUM(forecast) AS forqty,
                          (SUM(invqty) - SUM(qty)) AS diffsales, (SUM(invqty) - SUM(qty) - SUM(forecast)) AS diffforecast FROM (SELECT forecast.product, inventory.invqty, 
                          forecast.month, SUM( forecast.backlog ) AS qty, SUM(forecast.forecast_qty) AS forecast FROM forecast INNER JOIN inventory ON forecast.product = inventory.product 
                          AND forecast.month = inventory.month 
                          GROUP BY product, month) AS q1 WHERE q1.month = ? OR q1.month = ? OR q1.month = ? GROUP BY q1.product", $val1, $val2, $val3);
                          
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