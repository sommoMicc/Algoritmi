const GraphAttacker = require("../helper/graphAttacker");
const UndirectedGraph = require("../models/undirectedGraph");


process.on("message",async (graph) => {
    try {
        let firstGraph = new UndirectedGraph();
        firstGraph = firstGraph.castToGraph(graph.object);
        
        const randomAttackResult = GraphAttacker.randomFullDeactivation(firstGraph,{
            onProgress: (progress) => {
                process.send({progress: progress});
            }
        });
    
        process.send({random: randomAttackResult});
    }
    catch(e) {
        console.error(e);
    }    

    process.exit();
});