const { fork } = require('child_process');

const UndirectedGraph = require("./models/undirectedGraph");
const GraphGenerator = require("./models/graphGenerator");
const GraphWalker = require("./models/graphWalker");
const GraphAttacker = require("./models/graphAttacker");

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
        name: "Grafo manuale",
        object: manualGraph
    };
    console.log("Costruito grafo manuale di debug");
    
    processGraphs();
}

function processGraphs() {
    for(let i=0;i<graphs.length;i++) {
        printInfo(graphs[i].name,graphs[i].object);
        const process = fork('./processes/attack.js');
        process.send(graphs[i]);
    }


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