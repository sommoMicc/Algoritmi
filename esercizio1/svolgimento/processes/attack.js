const GraphAttacker = require("../models/graphAttacker");
const UndirectedGraph = require("../models/undirectedGraph");


process.on("message",async (graph) => {
    const undirectedGraph = new UndirectedGraph();
    graph.object = undirectedGraph.castToGraph(graph.object);

    
    const randomAttackResult = GraphAttacker.randomFullDeactivation(graph.object.getCopy(),{
        onProgress: (progress) => {
            process.send({progress: progress});
        }
    });
   
    process.send({random: randomAttackResult});
    process.exit();
});