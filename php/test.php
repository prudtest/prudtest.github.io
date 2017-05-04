<?php

 
 require (__DIR__ . "/../../dbfiles/db.php");
 
 $val1 = "brian";
 $val2 = "month";
 require (__DIR__ . "/../../dbfiles/db.php");
 
 $querytext= "SELECT " . $val2 . " ," . $val1 . " FROM manager";
 
 $output = DB::sqlquery ($querytext);
 
 header("Content-type: application/json");
 print(json_encode($output, JSON_PRETTY_PRINT));
 
?>