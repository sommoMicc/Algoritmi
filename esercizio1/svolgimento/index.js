const UndirectedGraph = require("./models/undirectedGraph");
const GraphGenerator = require("./models/graphGenerator");
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
    const upaGraph = await GraphGenerator.UPA(graphFromFile.getNodesNumber(),2);
    printInfo("Grafo UPA",upaGraph);
}
/**
 * @param {String} graphName nome del grafo
 * @param {UndirectedGraph} graphObject istanza del grafo
 */
function printInfo(graphName, graphObject) {
    console.log("---------------------------");
    console.log(graphName);
    console.log("Grado medio: "+graphObject.getAverageDegree());
    console.timeEnd(graphName);
    console.log("---------------------------");
}

main();