module.exports = class HeldKarp {
    /**
     * Tempo di esecuzione massimo dell'algoritmo IN SECONDI
     * @returns {number}
     * @constructor
     */
    static get MAX_EXECUTION_TIME() {
        return 60;
    }
    /**
     * Implementa l'algoritmo di Held-Karp per la soluzione del TSP
     * @param {GeoGraph} graph il grafo al quale applicare l'algoritmo
     */
    constructor(graph) {
        this.graph = graph;
        this.distance = {};
        this.predecessor = {};

        this.run = false;
        this.timeout = null;
    }

    /**
     * Avvia l'algoritmo
     */
    start() {
        const nodeList = this.graph.getNodesList();
        this.run = true;

        this.timeout = Math.floor(Date.now() / 1000) + HeldKarp.MAX_EXECUTION_TIME;
        return this._HK_Visit(nodeList[0],nodeList);
    }

    _isTimeExpired() {
        return (this.timeout - Math.floor(Date.now() / 1000)) < 0;
    }

    _HK_Visit(v,S) {
        if(S.length === 1 && S[0] === v) {
            // Caso base: la soluzione è il peso dell’arco {v, 0}
            //console.log("ritorno distanza");
            //console.log("CASO BASE");
            return this.graph.distanceBetween(v, this.graph.getNodesList()[0]);
        }
        else if(this.distance[v] != null && this.distance[v][S.join(",")] != null) {
            // Distanza già calcolata, ritorna il valore memorizzato
            return this.distance[v][S.join(",")];
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
            for(let i=0;i<S.length && !this._isTimeExpired();i++) {
                let u = S[i];

                //NOTA: con S.slice(0) copio l'array S, in modo da non modificare quello della funzione
                //di invocazione
                let dist = this._HK_Visit(u,sReduced);
                //console.log("Fine invocazione ricorsiva");
                if((dist + this.graph.distanceBetween(u,v)) < mindist) {
                    mindist = dist + this.graph.distanceBetween(u,v);
                    minprec = u;
                }
            }
            if(this.distance[v] == null)
                this.distance[v] = {};
            if(this.predecessor[v] == null)
                this.predecessor[v] = {};

            this.distance[v][S.join(",")] = mindist;
            this.predecessor[v][S.join(",")] = minprec;


            //console.log(distance);
            return mindist;
        }
    }
};