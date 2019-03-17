module.exports = class GraphAttacker {
    /**
     * @param {UndirectedGraph} graph il grafo da disattivare
     */
    static randomFullDeactivation(graph) {
        const nodesToDeactivate = GraphAttacker.shuffleArray(graph.getNodes());

        for(let i=0;i<nodesToDeactivate.length;i++) {
            graph.disconnectNode(nodesToDeactivate[i]);
            console.log("Disattivato "+nodesToDeactivate[i]+", resilienza residua: "+graph.resilience()+
                ", mancano ancora "+(nodesToDeactivate.length-i-1)+" nodi");
        };
    }

    static shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
};