/**
 * Classe che implementa i vari algoritmi di solzione del problema TSP
 * @type {module.GraphWalker}
 */
const HeldKarp = require("../algorithms/held_karp");
const NearestNeighbour = require("../algorithms/nearest_neighbour");
const TwoApprox = require("../algorithms/2_approx");


module.exports = class GraphWalker {
    static async HeldKarp(graph) {
        return new Promise((resolve,reject) => {
            try {
                const startTime = (new Date());
                const algorithm = new HeldKarp(graph.graph);
                const results = {
                    value: algorithm.start(),
                    time: (new Date()).getTime() - startTime.getTime(),
                    d: algorithm.d,
                    p: algorithm.p
                };
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
                const startTime = (new Date());

                const algorithm = new NearestNeighbour(graph.graph);
                const results = {
                    value: algorithm.start(),
                    time: (new Date()).getTime() - startTime.getTime(),
                    path: algorithm.path
                };

                resolve(results);

            }
            catch(e) {
                reject(e);
            }
        });
    }

    static async TwoApprox(graph) {
        return new Promise((resolve,reject) => {
            try {
                const startTime = (new Date());

                const algorithm = new TwoApprox(graph.graph);

                const results = {
                    value: algorithm.start(),
                    time: (new Date()).getTime() - startTime.getTime(),
                };

                resolve(results);
            }
            catch (e) {
                reject(e);
            }
        });
    }
};