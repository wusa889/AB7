Um diese App zu nutzen, muss in der config.json Datei im SRC Ordner die prop apiWeatherKey mit dem API Key befüllt werden:

"apiWeatherKey": "YourKeyHere"

"YourKeyHere" muss mit dem persönlichen API-Schlüssel von OpenWeatherMap ersetzt werden.

In der Funktion getWeatherData muss ausserdem in der request variable die ipv4 eingetragen werden, welche webpack-dev-sever vergibt.
let request = new XMLHttpRequest();
      request.open("GET", http://{DeineIPV4Adresse}:{DeinPortHier}/config.json", false);
      request.send(null);
      if (request.status === 200) {
        configData = JSON.parse(request.responseText);
      }

{DeineIPV4Adresse} muss mit deiner IPV4 ersetzt werden.
{DeinPortHier} mit deinem Port für die APP.

**To get Weather Data:

Enter the Latitude and longitude coordinates seperated with a blank space inside the text box.

**Example:

53.551086 9.993682

The example coordinates are the coordinates for Hamburg germany.


