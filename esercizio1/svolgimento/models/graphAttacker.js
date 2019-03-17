module.exports = class GraphAttacker {
    /**
     * @param {UndirectedGraph} graph il grafo da disattivare
     */
    static randomFullDeactivation(graph,progressWatcher) {
        const results = [];

        const nodesToDeactivate = GraphAttacker._shuffleArray(graph.getNodes());
        results[0] = graph.resilience();

        for(let i=0;i<nodesToDeactivate.length;i++) {
            graph.disconnectNode(nodesToDeactivate[i]);
            
            const residualResilience = graph.resilience();
            results[i+1] = residualResilience;
            
            
            let progress = Math.round(i*100/nodesToDeactivate.length);
            let progressInterval = i % (Math.round(nodesToDeactivate.length / 100));

            if(progressInterval == 0) {
                progressWatcher.onProgress(progress);
            }
        }

        return results;
    }

    static _shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};