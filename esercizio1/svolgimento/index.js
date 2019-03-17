const { fork } = require('child_process');
const fs = require("fs");
const MultiProgress = require("multi-progress");

const UndirectedGraph = require("./models/undirectedGraph");
const GraphGenerator = require("./models/graphGenerator");
const GraphWalker = require("./models/graphWalker");

const fileName = "./assets/file.txt"

let graphs = [];
function main() {
    const graphFromFile = new UndirectedGraph();
    graphFromFile.loadFromFile(fileName);

    const averageDegree = graphFromFile.getAverageDegree();
    console.log("Costruito grafo da file");
    graphs[0] = {
        index: 0,
        name: "Grafo file",
        object: graphFromFile
    };

    const erGraph = GraphGenerator.ER(graphFromFile.getNodes(),averageDegree);
    graphs[1] = {
        index: 1,
        name: "Grafo ER",
        object: erGraph
    };
    console.log("Costruito grafo ER");


    const upaGraph = GraphGenerator.UPA(graphFromFile.getNodesNumber(),Math.ceil(averageDegree));
    graphs[2] = {
        index: 2,
        name: "Grafo UPA",
        object: erGraph
    };
    console.log("Costruito grafo UPA");


    const manualGraph = new UndirectedGraph();
    for(let i=0;i<=10;i++) {
        manualGraph.addNode(i);
    }
    graphs[3] = {
        index: 3,
        name: "Grafo manuale",
        object: manualGraph
    };
    console.log("Costruito grafo manuale di debug");
    
    processGraphs();
}

function processGraphs() {
    const randomResults = [];

    const multiprogressBar = new MultiProgress();
    
    for(let i=0;i<graphs.length;i++) {
        randomResults[i] = null;

        let progressBar = multiprogressBar.newBar(
            'Random attack '+graphs[i].name+' [:bar] :percent', {
            total: 100
        });


        //printInfo(graphs[i].name,graphs[i].object);
        const process = fork('./processes/attack.js');
        process.send(graphs[i]);

        process.on("message",async (message) => {
            //console.log("Ricevuto messaggio");
            if(message.random != null) {
                progressBar.update(1);
                //console.log("Ricevuto risultato random per indice: "+i);
                randomResults[i] = message.random;

                let finished = true;
                for(let r = 0; r<randomResults.length && finished; r++) {
                    if(randomResults[r] == null) {
                        finished = false;
                    }
                }

                if(finished) {
                    saveAttackResultToFile(randomResults);
                    multiprogressBar.terminate();
                }
            }
            if(message.progress != null) {
                //console.log("Aggiornamento progresso");
                //console.log("Aggiornamento progresso "+i+": "+message.progress);
                progressBar.update(Math.min(message.progress/100,1));
            }
        });
    
    }
}

function saveAttackResultToFile(results,fileName="output.csv") {
    let header = "Numero nodi disattivati";
    for(let graphIndex = 0; graphIndex<results.length; graphIndex++) {
        header += ";"+graphs[graphIndex].name
    }

    const maxRows = Math.max(...results.map((r)=>{
        return r.length;
    }));


    const stream = fs.createWriteStream("assets/"+fileName);
    stream.once('open', function(fd) {
        stream.write(header+"\n")
        for(let row = 0; row < maxRows; row++) {
            let rowContent = ""+row;
            let separator = ";";
    
            for(let graphIndex = 0; graphIndex < results.length; graphIndex++) {
                if(results[graphIndex][row] != null) {
                    rowContent+=separator+results[graphIndex][row];
                }
                else {
                    rowContent+=separator+"0";
                }
            }
            rowContent = rowContent.replace("\.",",");
            rowContent+="\n";
            stream.write(rowContent);
        }
        stream.end();
        console.log("Risultati salvati su file");
    });
} 

/**
 * @param {String} graphName nome del grafo
 * @param {UndirectedGraph} graphObject istanza del grafo
 */
function printInfo(graphName, graphObject) {
    console.log("---------------------------");
    console.log(graphName);
    console.log("Nodi: "+graphObject.getNodesNumber());
    console.log("Grado medio: "+graphObject.getAverageDegree());

    console.log("Componente connessa: "+GraphWalker.maxConnectedComponents(graphObject));
    console.log("Resilienza: "+graphObject.resilience());

    //console.timeEnd(graphName);
    console.log("---------------------------");
}

main();