/**
 * Classe che implementa i vari algoritmi di solzione del problema TSP
 * @type {module.GraphWalker}
 */
const HeldKarp = require("../algorithms/held_karp");
module.exports = class GraphWalker {
    static HeldKarp(graph,progressWatcher) {
        const delayReport = deplayMs => new Promise((resolve) => {
            setTimeout(resolve, deplayMs);
        });
        const setIntervalAsync = (fn, ms) => {
            fn().then(() => {
                setTimeout(() => setIntervalAsync(fn, ms), ms);
            });
        };

        setIntervalAsync(async () => { progressWatcher.tick(); console.log("TICK"); await delayReport(1000); }, 1000);
        return new HeldKarp(graph).start();
    }

    static
};