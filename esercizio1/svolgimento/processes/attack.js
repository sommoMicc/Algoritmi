const GraphAttacker = require("../models/graphAttacker");
const UndirectedGraph = require("../models/undirectedGraph");

process.on("message",async (graph) => {
    const undirectedGraph = new UndirectedGraph();
    graph.object = undirectedGraph.castToGraph(graph.object);

    console.log("Iniziata random deactivation "+graph.name);
    GraphAttacker.randomFullDeactivation(graph.object.getCopy(),graph.name);
    console.log("Finita random deactivation "+graph.name);

    process.exit();
});