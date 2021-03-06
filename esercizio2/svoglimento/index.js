const ProgressBar = require("progress");

const FileUtils = require("./utils/fileUtils");
const Station = require("./models/station");
const StationGraph = require("./models/stationGraph");
const Segment = require("./models/segment");
const GraphWalker = require("./utils/graphWalker");
const GraphPlotter = require("./utils/graphPlotter");

const STATION_NAMES_FILE = "bahnhof";
const STATION_COORDS_FILE = "bfkoord";

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

    const coords = (await FileUtils.readFile(STATION_COORDS_FILE)).split("\n");
    for(let i=2; i<coords.length;i++) {
        if(coords[i].trim().length > 0) {
            const foundCoords = Station.parseCoords(coords[i]);
            STATIONS.setCoords(foundCoords.station,foundCoords.lat,foundCoords.lng);
        }
    }

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
                    rowInfo.arrivalTime,
                    lastStation,
                    rowInfo.station
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

            const routesToFind = [{
                startNode: "200415016",
                startTime: "00930",
                destination: "200405005"
            },{
                startNode: "300000032",
                startTime: "00530",
                destination: "400000122"
            },{
                startNode: "210602003",
                startTime: "00630",
                destination: "300000030"
            },{
                startNode: "200417051",
                startTime: "01200",
                destination: "140701016"
            },{
                startNode: "200417051",
                startTime: "02355",
                destination: "140701016"
            }];

            routesToFind.forEach((route)=>{
                const results = GraphWalker.dijkstraSSSP(STATIONS,route.startNode,route.startTime);
                printResults(results.d,results.p,route.startNode,route.startTime,route.destination);
            });

            GraphPlotter.plotRoute(STATIONS,plotData);
        }
    }, [STATION_NAMES_FILE,"bfkoord"]);
}

const plotData = {};


/**
 * Stampa i risultati in console
 * @param {Array<number>}d array delle distanze
 * @param {Array<Segment | null>} p array dei predecessori
 * @param {string} startNode nodo di partenza
 * @param {string} startTime tempo di partenza
 * @param {string} destination nodo di destinazione
 */
function printResults(d,p,startNode,startTime,destination) {
    console.log("\n--------------------------------------------");
    console.log("Percorso da "+startNode+" a "+destination+" partendo non " +
        "prima delle ore "+timePrettyFormat(startTime));

    console.log("Durata totale: "+Segment.numberToTime(d[destination]));

    let index = destination;
    let stationsInvolved = [];

    let output = "";
    let firstEqualIndex = index;
    let predecessorIndex = null;

    while(index != null) {
        stationsInvolved.push(index);

        if (p[index] == null || firstEqualIndex !== index &&
            p[firstEqualIndex].strokeId !== p[index].strokeId) {
            output = formatSegmentData(
                p[firstEqualIndex].strokeId,
                p[predecessorIndex].departureStation,
                p[predecessorIndex].departureTime,
                p[firstEqualIndex].arrivalStation,
                p[firstEqualIndex].arrivalTime
            ) + "\n" + output;

            firstEqualIndex = index;
        }

        predecessorIndex = index;

        if(p[index] != null)
            index = p[index].departureStation;
        else
            index = null;
    }

    console.log(output);
    plotData[startNode+"-"+timePrettyFormat(startTime)+"-"+destination] = stationsInvolved;
}

/**
 * Formatta le informazioni per essere stampate in console
 * @param {string}strokeId l'id della linea
 * @param {string}departureStation la stazione di partenza
 * @param {string}departureTime l'orario di partenza
 * @param {string}arrivalStation la stazione di destinazione
 * @param {string}arrivalTime l'orario di arrivo
 * @returns {string} le informazioni formattatte
 */
function formatSegmentData(strokeId,departureStation,departureTime,arrivalStation,arrivalTime) {
    return "Ore " + timePrettyFormat(departureTime) + " - Linea " +
        strokeId + " da " + departureStation +
        " a " + arrivalStation + ", arrivo ore " +
        timePrettyFormat(arrivalTime);
}

/**
 * Formatta una stringa oraria come 00530 in 05:30
 * @param {string}time la stringa che si vuole formattare
 * @returns {string} la stringa formattata
 */
function timePrettyFormat(time) {
    return Segment.numberToTime(Segment.timeStringToInteger(time),":");
}

main();