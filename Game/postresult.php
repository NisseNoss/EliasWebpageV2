<?php
$value = $_POST['sender'];

if ($value=="send")
    {


        // Tilkoblingsinformasjon
        $tjener = "51.174.64.25:3306";
        $brukernavn = "game";
        $passord = "Passord123";
        $database = "highscore";

        // Opprette en kobling
        $kobling = new mysqli($tjener, $brukernavn, $passord, $database);
        // Sjekk om koblingen virker
        if ($kobling->connect_error) {
            die("Noe gikk galt: " . $kobling->connect_error);
        }
        // Angi UTF-8 som tegnsett
        $kobling->set_charset("utf8");
        // Lagrer skjemafeltene i enklere navn

        $GT = $_POST["GamerTag"];
        $S = $_POST["Score"];

        $sql = "INSERT INTO highscore (name, score) VALUES ('$GT', '$S')";

        //Viser om spørringen ble gjennomført
        ($kobling->query($sql)); //{
        //    echo "Highscore spørring ble gjennomført.";
        //} else {
        //    echo "Noe gikk galt med spørringen $sql ($kobling->error).";
        //}

        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);

    }
?>
