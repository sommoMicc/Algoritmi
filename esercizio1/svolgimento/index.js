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
    console.log("[✓] Costruito grafo da file");
    graphs[0] = {
        index: 0,
        name: "Grafo file",
        object: graphFromFile
    };

    const erGraph = GraphGenerator.ER(graphFromFile.getNodes(),averageDegree);
    graphs[1] = {
        index: 1,
        name: "Grafo ER, p: "+(averageDegree/graphFromFile.getNodesNumber()),
        object: erGraph
    };
    console.log("[✓] Costruito grafo ER");

    const upaGraph = GraphGenerator.UPA(graphFromFile.getNodesNumber(),Math.ceil(averageDegree));
    graphs[2] = {
        index: 2,
        name: "Grafo UPA, n: "+graphFromFile.getNodesNumber()+", m: "+Math.ceil(averageDegree),
        object: upaGraph
    };
    console.log("[✓] Costruito grafo UPA");
    
    console.time("Elaborazione completata");
    processGraphs();
}

function processGraphs() {
    const randomResults = [];
    const cleverResults = [];

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
            if(message.random != null) {
                randomResults[i] = message.random;
                randomProgressBar.update(1);

                checkIfAttackFinished(cleverResults,randomResults,multiprogressBar);
            }
            if(message.progress != null) {
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
                //console.log("Ricevuto messaggio clever per indice: "+i);
                cleverResults[i] = message.clever;
                cleverProgressBar.update(1);

                checkIfAttackFinished(cleverResults,randomResults,multiprogressBar);
            }
            if(message.progress != null) {
                //console.log("Aggiornamento progresso");
                //console.log("Aggiornamento progresso "+i+": "+message.progress);
                cleverProgressBar.update(Math.min(message.progress/100,1));
            }
        });
    }
}

async function checkIfAttackFinished(cleverResults,randomResults, multiprogressBar) {
    await syncExecution(function (){
        let cleverFinished = true;
        for(let r = 0; r<cleverResults.length && cleverFinished; r++) {
            if(cleverResults[r] == null) {
                //console.log("Trovato risultato clever incompleto: "+r);
                cleverFinished = false;
            }
        }
    
        let randomFinished = true;
        for(let r = 0; r<randomResults.length && randomFinished; r++) {
            if(randomResults[r] == null) {
                //console.log("Trovato risultato random incompleto: "+r);
                randomFinished = false;
            }
        }
    
        if(cleverFinished && randomFinished) {
            multiprogressBar.terminate();
            console.timeEnd("Elaborazione completata");

            GraphPlotter.plotResilience(graphs,randomResults);
            GraphPlotter.plotResilience(graphs,cleverResults,"clever");        
        }
    });
}

let promise = null;
async function syncExecution(callback) {
    if(promise != null)
        promise.then(function(){
            promise = new Promise(function (resolve,reject){
                callback();
                resolve(true);
            });
        });
    else
        promise = new Promise(function (resolve,reject){
            callback();
            resolve(true);
        });
}

main();