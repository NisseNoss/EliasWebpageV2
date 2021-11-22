<?php

 //Lager tabellen

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
 else {
echo "Koblingen virker"; }


 //Angi UTF-8 som tegnsett
 $kobling->set_charset("utf8");
$sql = "SELECT name, score, timestamp FROM `highscore` WHERE 1
ORDER BY score DESC LIMIT 10";
$resultat = $kobling->query($sql);
echo "<table>"; // Starter tabellen
echo "<tr>"; // Lager en rad med overskrifter
 echo "<th>Name</th>";
 echo "<th>Score</th>";
 echo "<th>Time</th>";


echo "</tr>";

while($rad = $resultat->fetch_assoc()) {
    $NM= $rad["name"];
    $SC = $rad["score"];
    $TM = $rad["timestamp"];

    echo "<tr>";
    echo "<td>$NM</td>";
    echo "<td>$SC</td>";
    echo "<td>$TM</td>";

    echo "</tr>";
   }
   echo "</table>"; // Avslutter tabellen
   ?>