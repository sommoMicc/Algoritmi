const Routes = require("../models/routes");

module.exports = class HeldKarp {
    /**
     * Tempo di esecuzione massimo dell'algoritmo IN SECONDI
     * @returns {number}
     * @constructor
     */
    static get MAX_EXECUTION_TIME() {
        return 60*5; //5 minuti
    }
    /**
     * Implementa l'algoritmo di Held-Karp per la soluzione del TSP
     * @param {GeoGraph} graph il grafo al quale applicare l'algoritmo
     */
    constructor(graph) {
        this.graph = graph;

        this.nodeList = this.graph.getNodesList();
        this.w = {};
        this.d = {};
        this.p = {};

        for(let i=0;i<this.nodeList.length;i++) {
            this.w[this.nodeList[i]] = {};
            for(let j=0;j<this.nodeList.length;j++) {
                this.w[i][j] = this.graph.distanceBetween(i,j);
            }
            this.d[i] = {};
            this.p[i] = {};
        }

        this.routes = new Routes();
        this.timeout = null;

        this.running = false;
    }

    /**
     * Avvia l'algoritmo
     */
    start() {
        this.timeout = Math.floor(Date.now() / 1000) + HeldKarp.MAX_EXECUTION_TIME;
        this.running = true;
        return this._HK_Visit(0,this._listToString(this.nodeList));
    }

    /**
     * Applica l'algoritmo di Held Karp ricorsivamente
     * @param {number} v il nodo di partenza
     * @param {string} S una stringa che rappresenta il cammino da seguire.
     * @returns {number}
     * @private
     */
    _HK_Visit(v,S) {
        //console.log("v: "+v+", S: "+S);
        if(S === ""+v) {
            return this.w[v][0];
        }
        else if(this.d[v][S] != null) {
            return this.d[v][S];
        }
        else {
            let mindist = Infinity;
            let minprec = null;

            let nodes = [];
            let token = "";
            //Faccio lo split di S: S.split(",") mi fa stack overflow
            /* Il codice sottostante è l'equivalente di S.split(",").
            *  Ho dovuto far così per evitare/ridurre la probabilità di stack overflow
             */
            let j=0;
            //Itero sulla lunghezza dei caratteri della stringa
            for (let i = 0; i < S.length; i++) {
                if (S.charAt(i) === ",") {
                    j++;
                    nodes.push(token);
                    token = "";
                } else {
                    token += S.charAt(i);
                }
            }
            if(token !== "")
                nodes.push(token);

            const reducedNodes = [];

            let reducedNodesString = "";
            let sep = "";
            for(let i=0;i<nodes.length;i++) {
                if (nodes[i] !== v.toString()) {
                    reducedNodesString+=sep+nodes[i];
                    reducedNodes.push(nodes[i]);
                    sep = ",";
                }
            }

            for(let i=0;i<reducedNodes.length && !this._isTimeExpired();i++) {
                const u = reducedNodes[i];
                const dist = this._HK_Visit(u,reducedNodesString);
                if((dist + this.w[u][v]) < mindist) {
                    mindist = dist + this.w[u][v];
                    minprec = u;
                }
            }
            this.d[v][S] = mindist;
            this.p[v][S] = minprec;
            return mindist;
        }
    }

    _isTimeExpired() {
        const timeoutExpired = ((this.timeout - Math.floor(Date.now() / 1000)) < 0);
        if(timeoutExpired && this.running) {
            console.log("Timeout!");
            this.running = false;
        }
        return timeoutExpired;
    }

    _listToString(list) {
        return list.join(",");
    }

};