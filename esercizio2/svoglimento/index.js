const FileUtils = require("./utils/fileUtils");
const Station = require("./models/station");
const StationGraph = require("./models/stationGraph");

const STATION_NAMES_FILE = "bahnhof";
const STATIONS = new StationGraph();

async function main() {
    const stations = (await FileUtils.readFile(STATION_NAMES_FILE)).split("\n");
    //Itero su tutte le stazioni, ignorando la prima riga (perché è intestazione)
    for(let i=1; i<stations.length;i++) {
        if(stations[i].trim().length > 0) {
            STATIONS.addStation(Station.fromFile(stations[i]));
        }
    }
    console.log("Trovate "+STATIONS.getStationsNumber()+" STAZIONI");

    FileUtils.readAllFiles((name,extension,content)=>{
            /*console.log("Letto file: "+name+
                ", estensione: "+extension+
                ", lunghezza: "+content.length);*/

    }, [STATION_NAMES_FILE]);
}

main();