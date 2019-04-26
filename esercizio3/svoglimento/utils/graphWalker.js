/**
 * Classe che implementa i vari algoritmi di solzione del problema TSP
 * @type {module.GraphWalker}
 */
module.exports = class GraphWalker {
    /**
     * Implementa l'algoritmo di Held-Karp per la soluzione del TSP
     * @param {GeoGraph} graph il grafo al quale applicare l'algoritmo
     */
    static HeldKarp(graph,progressWatcher) {
        const distance = {};
        const predecessor = {};

        const nodeList = graph.getNodesList();
        return this.HK_Visit(nodeList[0],nodeList,distance,predecessor,graph,progressWatcher);
    }

    static HK_Visit(v,S,distance,predecessor,graph,progressWatcher) {
        progressWatcher.tick();
        if(S.length === 1 && S[0] === v) {
            // Caso base: la soluzione è il peso dell’arco {v, 0}
            //console.log("ritorno distanza");
            //console.log("CASO BASE");
            return graph.distanceBetween(v, graph.getNodesList()[0]);
        }
        else if(distance[v] != null && distance[v][S.join(",")] != null) {
            // Distanza già calcolata, ritorna il valore memorizzato
            return distance[v][S.join(",")];
        }
        else {
            /*
            console.log("Caso ricorsivo di "+v+" affanno");
            if(distance[v] != null) {
                console.log(distance[v]);
            }*/
            // Caso ricorsivo: trova il minimo tra tutti i sottocammini
            let mindist = Infinity;
            let minprec = null;

            let vk = S.indexOf(v);
            //Copio S e tolgo il nodo v dalla copia di S (sReduced)
            let sReduced = S.slice(0);
            sReduced.splice(vk,1);

            //console.log(S.join(","));
            for(let i=0;i<S.length;i++) {
                let u = S[i];

                //NOTA: con S.slice(0) copio l'array S, in modo da non modificare quello della funzione
                //di invocazione
                let dist = GraphWalker.HK_Visit(u,sReduced,distance,predecessor,graph,progressWatcher);
                //console.log("Fine invocazione ricorsiva");
                if((dist + graph.distanceBetween(u,v)) < mindist) {
                    mindist = dist + graph.distanceBetween(u,v);
                    minprec = u;
                }
            }
            if(distance[v] == null)
                distance[v] = {};
            if(predecessor[v] == null)
                predecessor[v] = {};

            distance[v][S.join(",")] = mindist;
            predecessor[v][S.join(",")] = minprec;


            //console.log(distance);
            return mindist;
        }
    }
};