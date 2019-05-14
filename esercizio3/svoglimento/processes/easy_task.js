const GraphWalker = require("../utils/graphWalker");
const GeoGraph = require("../models/geoGraph");

/**
 * Questo processo applica l'euristica Nearest Neighbour e 2-approssimata
 * al grafo passato come parametro
 */
process.on("message",async (graph) => {
    try {
        graph.graph  = GeoGraph.castToGraph(graph.graph);
        const nearestNeighbour = await GraphWalker.NearestNeighbour(graph);
        const twoApprox = await GraphWalker.TwoApprox(graph);

        process.send({
            nearestNeighbour: nearestNeighbour,
            twoApprox: twoApprox
        });


    }
    catch(e) {
        console.error(e);
    }

    process.exit();
});