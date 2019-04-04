const ProgressBar = require("progress");

const FileUtils = require("./utils/fileUtils");
const Station = require("./models/station");
const StationGraph = require("./models/stationGraph");
const Segment = require("./models/segment");
const GraphWalker = require("./models/graphWalker");

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

    let progressBar = null;
    let progress = 0;
    FileUtils.readAllFiles(async (tot,extension,content)=>{
        if(progressBar == null) {
            progressBar = new ProgressBar("Lettura file [:bar] :percent",{total: tot});
        }
        progressBar.tick();
        let rows = content.split("\n");

        let lastStrokeId = null;
        let lastStation = null;
        let lastDepartureTime = null;

        for(let i=0;i<rows.length;i++) {
            //Ignoro i commenti e le righe vuote
            if((rows[i].startsWith("*") && !rows[i].startsWith("*Z"))
                || rows[i].trim().length < 1) {
                continue;
            }
            if(rows[i].startsWith("*Z")) {
                //lastStrokeId = rows[1].substr(3,5);
                lastStrokeId = rows[i].substr(3,9);
                lastStation = null;
                lastDepartureTime = null;
                continue;
            }
            //Arrivo qua solo se non sono in una riga di commento
            const rowInfo = Segment.parseRow(rows[i]);
            if(rowInfo.arrivalTime == null) {
                //Se il tempo di arrivo è nullo, sto leggendo una riga di un capolinea
                //di partenza!
                lastStation = rowInfo.station;
                lastDepartureTime = rowInfo.departureTime;
            }
            else {
                //Siccome il tempo di arrivo alla stazione non è nullo, sto leggendo
                //o una riga intermedia o una riga di arrivo al capolinea di destinazione.
                //Ai fini pratici, non mi interessa distinguerle.
                STATIONS.addEdge(lastStation,rowInfo.station,new Segment(
                    lastStrokeId,
                    lastDepartureTime,
                    rowInfo.arrivalTime
                ));
                lastDepartureTime = rowInfo.departureTime;
                lastStation = rowInfo.station;
            }
            //console.log(rows[i]);
        }
        progress++;
        if(progress >= tot) {
            await progressBar.terminate();

            await STATIONS.sortEdges({
                setTotal: (tot) => {
                    progressBar = new ProgressBar("Riordino archi: [:bar] :percent",{total: tot});
                },
                update: () => {
                    progressBar.tick();
                }
            });
            await progressBar.terminate();

            const routes = GraphWalker.dijkstraSSSP(STATIONS,"200417007","00600");
            console.log(routes["200417019"]);
        }
    }, [STATION_NAMES_FILE,"bfkoord"]);
}

/*console.log(Segment.timeStringToInteger("02037"));
console.log(Segment.timeStringToInteger("02034"));
*/
main();