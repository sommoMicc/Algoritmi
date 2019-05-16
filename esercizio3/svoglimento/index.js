const ProgressBar = require("progress");

const FileUtils = require("./utils/fileUtils");
const GeoGraph = require("./models/geoGraph");
const GraphWalker = require("./utils/graphWalker");

const geoGraphs = [];
const { fork } = require('child_process');

async function main() {
    let progressBar = null;
    let progress = 0;


    FileUtils.readAllFiles(async (tot,name,extension,content)=>{
        if(progressBar == null) {
            progressBar = new ProgressBar("Lettura file [:bar] :percent",{total: tot});
        }
        progressBar.tick();
        let rows = content.split("\n");

        const coordsType = FileUtils.getCoordsType(rows[4]);
        const geoGraph = new GeoGraph(coordsType);

        for(let i=6;i<rows.length;i++) {
            if (
                !rows[i].trim().match(/^\d/) || 
                rows[i].trim().length < 1 || 
                rows[i].trim() === "EOF") {
                //Se la riga non inizia con un numero, vado avanti (perché non è una riga di coordinata)
                continue;
            }
            geoGraph.parseRow(rows[i]);
        }
        geoGraphs.push({
            name: name,
            graph: geoGraph
        });
        progress++;
        if(progress >= tot) {
            await progressBar.terminate();

            beginAlgorithm();
        }
    });
}

async function beginAlgorithm() {
    //Ordino in ordine crescente di nodi, per ottenere i primi risultati più in fretta
    geoGraphs.sort((a,b)=> {
        return a.graph.getNodesList().length - b.graph.getNodesList().length;
    });

    let easyResults = 0;
    for(let i=0;i<geoGraphs.length;i++) {
        const easyTaskProcess = fork('./processes/easy_task.js');
        easyTaskProcess.send(geoGraphs[i]);

        easyTaskProcess.on("message",async (message) => {
            if(message.twoApprox != null) {
                logSeparator();
                console.log(geoGraphs[i].name+" 2-approssimato: "+message.twoApprox.value+"\n" +
                    "Tempo: "+message.twoApprox.time+" ms \n" +
                    "----------------------\n"+
                    geoGraphs[i].name+" Nearest Neighbour: "+message.nearestNeighbour.value+"\n" +
                    "Tempo: "+message.nearestNeighbour.time+" ms \n");
                easyResults++;
                if(easyResults === geoGraphs.length) {
                    for(let i=0;i<geoGraphs.length;i++) {
                        logSeparator();
                        global.gc();
                        const heldKarp = await GraphWalker.HeldKarp(geoGraphs[i]);
                        console.log(geoGraphs[i].name + " Held Karp: " + heldKarp.value + "\n" +
                            "Tempo: " + heldKarp.time + " ms");

                    }
                }
            }
        });
    }
}

function logSeparator() {
    console.log("-+-+-+-+--+-+-+-+-+-+-+-+-+-+-+-+-+");
}


main();