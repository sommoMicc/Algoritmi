/**
 * Classe che implementa i vari algoritmi di solzione del problema TSP
 * @type {module.GraphWalker}
 */
const HeldKarp = require("../algorithms/held_karp");
const NearestNeighbour = require("../algorithms/nearest_neighbour");

const UnionByDepth = require("../models/union_depth");

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

    /**
     *
     * @param {GeoGraph}graph il grafo
     */
    static Kruskal(graph) {
        const set = new UnionByDepth();

        const nodesList = graph.getNodesList();
        const edges = [];

        let A = [];

        for(let i=0;i<nodesList.length;i++) {
            set.makeSet(nodesList[i]);

            for(let j=0; j<nodesList.length; j++) {
                if(nodesList[i] === nodesList[j]) {
                    continue;
                }
                edges.push({
                    from: nodesList[i],
                    to: nodesList[j],
                    w: graph.distanceBetween(nodesList[i],nodesList[j])
                });
            }
        }

        edges.sort( (a, b) => {
            return a.w- b.w;
        });

        for(let i=0;i<nodesList.length;i++) {
            for (let j = 0; j < nodesList.length; j++) {
                const u = nodesList[i];
                const v = nodesList[j];

                if (u === v) {
                    continue;
                }

                if(set.findSet(u) !== set.findSet(v)) {
                    A.push([u,v]);
                    set.union(u,v);
                }
            }
        }
        return A;
    }
};