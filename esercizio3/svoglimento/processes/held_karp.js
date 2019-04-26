const GraphWalker = require("../utils/graphWalker");
const GeoGraph = require("../models/geoGraph");


process.on("message",async (graph) => {
    try {
        let secondGraph = new GeoGraph(graph._type);
        secondGraph  = secondGraph.castToGraph(graph);

        const cleverAttackResult = GraphWalker.HeldKarp(secondGraph,{
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