<?php

    $server = "localhost";
    $username = "root";
    $password = "";
    $db = "elfi";
    $conn = mysqli_connect($server, $username,$password,$db);
    
    if($conn){
        $response["connectedToDb"] = TRUE;
        $response["DB"] = $db;
    }
    else{
        $response["connectedToDb"] = FALSE;
    }
    
?>