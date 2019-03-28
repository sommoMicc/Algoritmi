/**
 * Primo laboratorio di Algorimti Avanzati
 * Michele Tagliabue - Matricola 1206966
 */
const { fork } = require('child_process');

const MultiProgress = require("multi-progress");

const GraphPlotter = require("./helper/graphPlotter");
const UndirectedGraph = require("./models/undirectedGraph");
const GraphGenerator = require("./helper/graphGenerator");

const fileName = "./assets/file.txt"

let graphs = [];
function main() {
    const graphFromFile = new UndirectedGraph();
    //Parso il file
    graphFromFile.loadFromFile(fileName);

    //Calcolo il grado medio dei nodi del grafo file
    const averageDegree = graphFromFile.getAverageDegree();
    console.log("[✓] Costruito grafo da file");
    graphs.push({
        name: "Grafo file",
        object: graphFromFile
    });

    //Costruisco il grafo ER in modo che abbia gli stessi nodi e lo stesso grado medio
    //del grafo file (graphFromFile)
    const erGraph = GraphGenerator.ER(graphFromFile.getNodes(),averageDegree);
    graphs.push({
        name: "Grafo ER, p: "+(averageDegree/graphFromFile.getNodesNumber()),
        object: erGraph
    });
    console.log("[✓] Costruito grafo ER");

    //Costruisco il grafo UPA in modo che abbia lo stesso numero di nodi e lo stesso grado medio
    //del grafo file (graphFromFile)
    const upaGraph = GraphGenerator.UPA(graphFromFile.getNodesNumber(),Math.ceil(averageDegree));
    graphs.push({
        name: "Grafo UPA, n: "+graphFromFile.getNodesNumber()+", m: "+Math.ceil(averageDegree),
        object: upaGraph
    });
    console.log("[✓] Costruito grafo UPA");
    
    console.time("Elaborazione completata");
    processGraphs();
}

function processGraphs() {
    //Risultati dell'attacco random
    const randomResults = [];
    //Risultati dell'attacco clever
    const cleverResults = [];

    //Progressbar
    const multiprogressBar = new MultiProgress();
    
    for(let i=0;i<graphs.length;i++) {
        randomResults[i] = null;
        cleverResults[i] = null;

        //Creo la progress bar per l'attacco
        let randomProgressBar = multiprogressBar.newBar(
            'Random attack '+graphs[i].name+' [:bar] :percent', {
            total: 100
        });

        //Creo un processo che si occuperà dell'attacco random al grafo in oggetto
        //In questo modo parallelizzo l'esecuzione
        const randomAttackProcess = fork('./processes/random_attack.js');
        //Invio il grafo al processo figlio, in modo da iniziare l'attacco
        randomAttackProcess.send(graphs[i]);

        randomAttackProcess.on("message",async (message) => {
            if(message.random != null) {
                //Elaborazione conclusa, salvo il risultato
                randomResults[i] = message.random;

                //Aggiorno la progress bar corrispondente
                randomProgressBar.update(1);

                //Controllo se è possibile generare il grafico del risultato dell'attacco
                //e in caso affermativo lo genero
                checkIfAttackFinished(cleverResults,randomResults,multiprogressBar);
            }
            if(message.progress != null) {
                //Ho ricevuto un aggiornamento sul progresso
                randomProgressBar.update(Math.min(message.progress/100,1));
            }            
        });
        
        //Creo la progress bar per l'attacco
        let cleverProgressBar = multiprogressBar.newBar(
            'Clever attack '+graphs[i].name+' [:bar] :percent', {
            total: 100
        });

        //Creo un processo che si occuperà dell'attacco clever al grafo in oggetto
        //In questo modo parallelizzo l'esecuzione
        const cleverAttackProcess = fork('./processes/clever_attack.js');
        //Invio il grafo al processo figlio, in modo da iniziare l'attacco
        cleverAttackProcess.send(graphs[i]);

        cleverAttackProcess.on("message",async (message) => {

            if(message.clever != null) {
                //Elaborazione conclusa, salvo il risultato
                cleverResults[i] = message.clever;

                //Aggiorno la progress bar corrispondente
                cleverProgressBar.update(1);

                //Controllo se è possibile generare il grafico del risultato dell'attacco
                //e in caso affermativo lo genero
                checkIfAttackFinished(cleverResults,randomResults,multiprogressBar);
            }
            if(message.progress != null) {
                //Ho ricevuto un aggiornamento sul progresso
                cleverProgressBar.update(Math.min(message.progress/100,1));
            }
        });
    }
}

async function checkIfAttackFinished(cleverResults,randomResults, multiprogressBar) {
    await syncExecution(function (){
        //Controllo se ci sono risultati incompleti riguardanti l'attacco clever
        let cleverFinished = true;
        for(let r = 0; r<cleverResults.length && cleverFinished; r++) {
            if(cleverResults[r] == null) {
                //console.log("Trovato risultato clever incompleto: "+r);
                cleverFinished = false;
            }
        }
        //Controllo se ci sono risultati incompleti riguardanti l'attacco random
        let randomFinished = true;
        for(let r = 0; r<randomResults.length && randomFinished; r++) {
            if(randomResults[r] == null) {
                //console.log("Trovato risultato random incompleto: "+r);
                randomFinished = false;
            }
        }
    
        if(cleverFinished && randomFinished) {
            //Se non ho risultati incompleti, disegno i due grafici
            multiprogressBar.terminate();
            console.timeEnd("Elaborazione completata");

            GraphPlotter.plotResilience(graphs,randomResults);
            GraphPlotter.plotResilience(graphs,cleverResults,"clever");        
        }
    });
}

//Piccolo "hack" che mi permette di simulare la keyword "syncronized" di Java
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


//Lancio il metodo main
main();