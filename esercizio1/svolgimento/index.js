const UndirectedGraph = require("./models/undirectedGraph");
const GraphGenerator = require("./models/graphGenerator");
const fileName = "./assets/file.txt"

const graphFromFile = new UndirectedGraph();
graphFromFile.loadFromFile(fileName);

const averageDegree = graphFromFile.getAverageDegree();
printInfo("Grafo file",graphFromFile);

const erGraph = GraphGenerator.ER(graphFromFile.getNodes(),averageDegree);
printInfo("Grafo ER",erGraph);
//erGraph.saveToFile("erOutput.csv",",");

const upaGraph = GraphGenerator.UPA(graphFromFile.getNodesNumber(),Math.ceil(averageDegree));
printInfo("Grafo UPA",upaGraph);

/**
 * @param {String} graphName nome del grafo
 * @param {UndirectedGraph} graphObject istanza del grafo
 */
function printInfo(graphName, graphObject) {
    console.log("---------------------------");
    console.log(graphName);
    console.log("Grado medio: "+graphObject.getAverageDegree());
}