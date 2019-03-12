const UndirectedGraph = require("./models/undirectedGraph");
const GraphGenerator = require("./models/graphGenerator");
const GraphWalker = require("./models/graphWalker");
const fileName = "./assets/file.txt"

async function main() {
    console.time("Grafo file");
    const graphFromFile = new UndirectedGraph();
    graphFromFile.loadFromFile(fileName);

    const averageDegree = graphFromFile.getAverageDegree();
    printInfo("Grafo file",graphFromFile);

    console.time("Grafo ER");
    const erGraph = GraphGenerator.ER(graphFromFile.getNodes(),averageDegree);
    printInfo("Grafo ER",erGraph);
    //erGraph.saveToFile("erOutput.csv",",");

    console.time("Grafo UPA");
    const upaGraph = GraphGenerator.UPA(graphFromFile.getNodesNumber(),Math.ceil(averageDegree));
    printInfo("Grafo UPA",upaGraph);
    upaGraph.saveToFile("upaOutput.csv",",");
    

    console.time("Grafo manuale");
    const manualGraph = new UndirectedGraph();
    for(let i=0;i<=10;i++) {
        manualGraph.addNode(i);
        //manualGraph.addEdge(i,0);
    }
    manualGraph.saveToFile("manualOutput.csv",",");
    printInfo("Grafo manuale",manualGraph);

    manualGraph.removeNode(2);
    console.log("Resilienza residua: "+manualGraph.resilience());

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

    console.timeEnd(graphName);
    console.log("---------------------------");
}

main();