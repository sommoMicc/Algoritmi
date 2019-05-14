const GraphWalker = require("../utils/graphWalker");
const GeoGraph = require("../models/geoGraph");

/**
 * Questo processo applica l'algoritmo di Held Karp a tutti i grafi caricati
 * da file SEQUENZIALMENTE.
 */
process.on("message",async (graphs) => {
    try {
        for(let i=0;i<graphs.length;i++) {
            graphs[i].graph  = GeoGraph.castToGraph(graphs[i].graph);
        }


        for(let i=0;i<graphs.length;i++) {
            const heldKarp = await GraphWalker.HeldKarp(graphs[i]);
            process.send({
                name: graphs[i].name,
                index: i,
                value: heldKarp.value,
                time: heldKarp.time
            });
        }

    }
    catch(e) {
        console.error(e);
    }

    process.exit();
});