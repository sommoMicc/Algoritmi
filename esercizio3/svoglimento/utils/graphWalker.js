/**
 * Classe che implementa i vari algoritmi di solzione del problema TSP
 * @type {module.GraphWalker}
 */
const HeldKarp = require("../algorithms/held_karp");
module.exports = class GraphWalker {
    static HeldKarp(graph) {
        return new HeldKarp(graph).start();
    }
};