# Instructies

Download deze Github repository en navigeer in de terminal naar de folder. Typ `npm install`, zorg ervoor dat Node.js geinstalleerd is. Om de server op starten typ je `nodemon app` in dezelfde folder. Je kan nu de site bezoeken op http://localhost:3000/. 

Sleep de stenen om ze te verplaatsen, na elke zet is de andere speler aan de beurt. Klik op 'View Rules' om de regels van het dammen te zien, klik ergens anders om de pop-up te sluiten. Het systeem geeft aan wanneer je een verkeerde zet maakt. Bijvoorbeeld wanneer je de steen niet diagonaal verplaatst, wanneer je niet aan de beurt bent, of wanneer je met een steen die mag slaan een normale zet probeert te maken. 

Het spel is voorbij als een van de spelers al hun stenen zijn verloren, of wanneer ze geen stenen meer hebben die naar voren kunnen bewegen.

# Features

Elk veld op het dambord heeft een id, genummerd van 0 tot 63. Van elke zet wordt de startpositie, de eindpositie en mogelijke zetten geregistreed. Na elke zet worden de id's op het dambord omgewisseld. Online multiplayer features staan tijdelijk uitgezet omdat dit niet af compleet is.
