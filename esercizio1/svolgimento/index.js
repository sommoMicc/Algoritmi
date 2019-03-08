const UndirectedGraph = require("./utils");
const fileName = "file.txt"

const graphFromFile = new UndirectedGraph();
graphFromFile.loadFromFile(fileName);

const averageDegree = graphFromFile.getAverageDegree();
console.log("Grado medio: "+averageDegree);