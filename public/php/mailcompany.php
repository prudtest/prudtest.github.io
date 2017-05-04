<?php

/* CS50 Spring 2016 final project
    Presented by: Hany Bassily*/
    
    
    // php mailer library
    require("libphp-phpmailer/class.phpmailer.php");

    //variable sent to server for the e-mail
    $name    = $_POST['name'];
    $address = $_POST['email'];
    $phone   = $_POST['phonenum'];
    $message = $_POST['message'];
	
    // PHPMailer setup
    $mail = new PHPMailer();
    $mail->IsSMTP();
    $mail->Host = "smtp.gmail.com";     // IMPORTANT!!!!! BE SURE TO DISABLE THE CAPTCHA SETTING ON GMAIL SMTP SERVER!!!!
    $mail->Password = "Hany1965";
    $mail->Port = 587;
    $mail->SMTPAuth = true;
    $mail->SMTPDebug = 1;
    $mail->SMTPSecure = "tls";
    $mail->Username = "hfbassily@gmail.com";
    
    // Compose the message Subject, Body and the addressee
    $mail->Subject = "Website Request";
    $mail->Body = "Message from: {$name} \ne-mail: {$address} \nphone: {$phone} \n\n\n {$message}";
    $mail->addAddress('hfbassily@yahoo.com');
    
    // Final return for js callbacks
    if ($mail->Send()){
        
        print("success");
    }
    else{
        
        print($mail->ErrorInfo);
    }

?>