const GraphWalker = require("./graphWalker");

module.exports = class GraphAttacker {
    /**
     * Esegue l'attacco random sui nodi del grafo "graph"
     * @param {UndirectedGraph} graph il grafo da attaccare
     * @param {Object} progressWatcher observer per l'avanzamento
     */
    static randomFullDeactivation(graph,progressWatcher) {
        const results = [];
        //Mescolo i nodi del grafo in modo tale da disattivarli in ordine casuale
        const nodesToDeactivate = GraphAttacker._shuffleArray(graph.getNodes());
        results[0] = GraphWalker.maxConnectedComponents(graph);

        for(let i=0;i<nodesToDeactivate.length;i++) {
            //Disconnetto il nodo attaccato da tutti i suoi archi
            graph.disconnectNode(nodesToDeactivate[i]);
            
            //Calcolo la nuova dimensione della componente connessa massima
            const maxConnectedComponent = GraphWalker.maxConnectedComponents(graph);
            results[i+1] = maxConnectedComponent;
            
            //Calcolo il nuovo progresso dell'elaborazione
            let progress = Math.round(i*100/nodesToDeactivate.length);
            let progressInterval = i % (Math.round(nodesToDeactivate.length / 100));
            //Se sono avanzato di una percentuale, lo notifico al processo principale
            //in modo da aggiornare la barra di avanzamento
            if(progressInterval == 0) {
                progressWatcher.onProgress(progress);
            }
        }

        return results;
    }

    /**
     * Mescola gli elementi di un array
     * @param {*} array l'array da mescolare
     */
    static _shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    /**
     * Attua l'attacco intelligente al grafo passato come parametro
     * @param {UndirectedGraph} graph il grafo da attaccare
     * @param {Object} progressWatcher observer per l'avanzamento
     */
    static cleverFullDeactivation(graph,progressWatcher) {
        const results = [];
        results[0] = GraphWalker.maxConnectedComponents(graph);
        
        //Ottengo la lista dei nodi del grafo ordinata per grado decrescente
        //in modo da disattivare prima i nodi con un grado elevato
        let nodesToDeactivate = graph.getNodesOrderedByGrade();

        for(let i=0;i<nodesToDeactivate.length;i++) {
            //Disconnetto il nodo attaccato da tutti i suoi archi
            graph.disconnectNode(nodesToDeactivate[i].node);

            //Calcolo la nuova dimensione della componente connessa massima
            const residualConnectedComponent = GraphWalker.maxConnectedComponents(graph);
            results[i+1] = residualConnectedComponent;

            //Calcolo il nuovo progresso dell'elaborazione
            let progress = Math.round(i*100/nodesToDeactivate.length);
            let progressInterval = i % (Math.round(nodesToDeactivate.length / 100));
            //Se sono avanzato di una percentuale, lo notifico al processo principale
            //in modo da aggiornare la barra di avanzamento
            if(progressInterval == 0) {
                progressWatcher.onProgress(progress);
            }
        }

        return results;
    }
};