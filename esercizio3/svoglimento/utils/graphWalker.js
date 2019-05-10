/**
 * Classe che implementa i vari algoritmi di solzione del problema TSP
 * @type {module.GraphWalker}
 */
const HeldKarp = require("../algorithms/held_karp");
const NearestNeighbour = require("../algorithms/nearest_neighbour");

module.exports = class GraphWalker {
    static _logSeparator() {
        console.log("\n-+-+-+-+--+-+-+-+-+-+-+-+-+-+-+-+-+");
    }
    static async HeldKarp(graph) {
        return new Promise((resolve,reject) => {
            try {
                const label = graph.name+" Held Karp";

                const timeLabel = "Tempo "+label;
                console.time(timeLabel);
                const algorithm = new HeldKarp(graph.graph);
                const results = {
                    value: algorithm.start(),
                    d: algorithm.d,
                    p: algorithm.p
                };

                GraphWalker._logSeparator();
                console.timeEnd(timeLabel);
                console.log("Risultato "+ label + ": " + results.value);

                resolve(results);
            }
            catch(e) {
                reject(e);
            }
        });
    }

    static async NearestNeighbour(graph) {
        return new Promise((resolve,reject) => {
            try {
                const label = graph.name+" Nearest Neighbour";

                const timeLabel = "Tempo "+label;
                console.time(timeLabel);
                const algorithm = new NearestNeighbour(graph.graph);
                const results = {
                    value: algorithm.start(),
                    path: algorithm.path
                };

                GraphWalker._logSeparator();
                console.timeEnd(timeLabel);
                console.log("Risultato "+ label + ": " + results.value);
                //console.log("Path: "+results.path.join(","));

                resolve(results);

            }
            catch(e) {
                reject(e);
            }
        });
    }
};