const GraphAttacker = require("../helper/graphAttacker");
const UndirectedGraph = require("../models/undirectedGraph");


process.on("message",async (graph) => {
    try {
        let secondGraph = new UndirectedGraph();
        secondGraph  = secondGraph.castToGraph(graph.object);
        
        const cleverAttackResult = GraphAttacker.cleverFullDeactivation(secondGraph,{
            onProgress: (progress) => {
                process.send({progress: progress});
            }
        });
        
        process.send({clever: cleverAttackResult});
    }
    catch(e) {
        console.error(e);
    }    

    process.exit();
});