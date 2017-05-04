<?php

 
 // require ("/home/ubuntu/workspace/project/dbfiles/db.php");
 
 require (__DIR__ . "/../../dbfiles/db.php");
 
 $querytext= "SELECT forecast.customer, q1_2015.q1_sales, SUM(forecast.totalreveneue)
             FROM forecast
             INNER JOIN q1_2015
             ON forecast.customer=q1_2015.customer 
             WHERE forecast.month = ?   
             GROUP BY customer";
 
 $output = DB::sqlquery ("SELECT forecast.customer, q1_2015.q1_sales, SUM(forecast.totalreveneue) FROM forecast
                          INNER JOIN q1_2015 ON forecast.customer = q1_2015.customer GROUP BY customer");
 
 header("Content-type: application/json");
 print(json_encode($output, JSON_PRETTY_PRINT));
 
?>