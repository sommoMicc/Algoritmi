const { fork } = require('child_process');
const fs = require("fs");

const MultiProgress = require("multi-progress");

const GraphPlotter = require("./helper/graphPlotter");
const UndirectedGraph = require("./models/undirectedGraph");
const GraphGenerator = require("./helper/graphGenerator");
const GraphWalker = require("./helper/graphWalker");

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
        if(i > 0)
            manualGraph.addEdge(i,i-1);
        
        if(i>3) 
            manualGraph.addEdge(i,3);
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
    const cleverResults = [];

    const skipHeavy = false;

    const multiprogressBar = new MultiProgress();
    
    for(let i=0;i<graphs.length;i++) {
        randomResults[i] = null;
        cleverResults[i] = null;

        let randomProgressBar = multiprogressBar.newBar(
            'Random attack '+graphs[i].name+' [:bar] :percent', {
            total: 100
        });

        const randomAttackProcess = fork('./processes/random_attack.js');
        randomAttackProcess.send(graphs[i]);

        randomAttackProcess.on("message",async (message) => {
            //console.log("Ricevuto messaggio");
            if(message.random != null) {
                //console.log("Ricevuto risultato random per indice: "+i);
                randomResults[i] = message.random;

                let finished = true;
                for(let r = 0; r<randomResults.length && finished; r++) {
                    if(!skipHeavy && randomResults[r] == null) {
                        finished = false;
                    }
                }

                if(finished) {
                    //saveAttackResultToFile(randomResults);
                    //multiprogressBar.terminate();
                    GraphPlotter.plotResilience(graphs,randomResults);
                }
            }
            if(message.progress != null) {
                //console.log("Aggiornamento progresso");
                //console.log("Aggiornamento progresso "+i+": "+message.progress);
                randomProgressBar.update(Math.min(message.progress/100,1));
            }            
        });

        let cleverProgressBar = multiprogressBar.newBar(
            'Clever attack '+graphs[i].name+' [:bar] :percent', {
            total: 100
        });


        const cleverAttackProcess = fork('./processes/clever_attack.js');
        cleverAttackProcess.send(graphs[i]);

        cleverAttackProcess.on("message",async (message) => {

            if(message.clever != null) {
                //console.log("Ricevuto risultato random per indice: "+i);
                cleverResults[i] = message.clever;

                let finished = true;
                for(let r = 0; r<cleverResults.length && finished; r++) {
                    if(!skipHeavy && cleverResults[r] == null) {
                        finished = false;
                    }
                }

                console.log("Ricevuto risultato clever!");

                if(finished) {
                    //saveAttackResultToFile(randomResults);
                    //multiprogressBar.terminate();
                    GraphPlotter.plotResilience(graphs,cleverResults,"clever");
                }
            }
            if(message.progress != null) {
                //console.log("Aggiornamento progresso");
                //console.log("Aggiornamento progresso "+i+": "+message.progress);
                cleverProgressBar.update(Math.min(message.progress/100,2));
            }
        });
    }
}

function saveAttackResultToFile(results,fileName="output.csv") {
    let header = "Numero nodi disattivati";
    for(let graphIndex = 0; graphIndex<results.length; graphIndex++) {
        if(graphs[graphIndex] != null)
            header += ";"+graphs[graphIndex].name
    }

    const maxRows = GraphPlotter.findMaxRows(results);
    console.log("Max rows: "+maxRows);

    const stream = fs.createWriteStream("assets/"+fileName);
    stream.once('open', function(fd) {
        stream.write(header+"\n")
        for(let row = 0; row < maxRows; row++) {
            let rowContent = ""+row;
            let separator = ";";
    
            for(let graphIndex = 0; graphIndex < results.length; graphIndex++) {
                if(results[graphIndex] != null) {
                    if(results[graphIndex][row] != null) {
                        rowContent+=separator+results[graphIndex][row];
                    }
                    else {
                        rowContent+=separator+"0";
                    }
                    rowContent = rowContent.replace("\.",",");
                    rowContent+="\n";
                    stream.write(rowContent);
                }
            }   
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