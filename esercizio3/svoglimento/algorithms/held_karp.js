const Routes = require("../models/routes");

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


    }

    /**
     * Avvia l'algoritmo
     */
    start() {
        this.timeout = Math.floor(Date.now() / 1000) + HeldKarp.MAX_EXECUTION_TIME;


        return this._HK_Visit(0,this._listToString(this.nodeList));
    }

    _HK_Visit(v,S) {
        if(S === ""+v) {
            return this.w[v][0];
        }
        else if(this.d[v][S] != null) {
            return this.d[v][S];
        }
        else {
            let mindist = Infinity;
            let minprec = null;

            const nodes = S.split(",");
            const reducedNodes = [];
            for(let i=0;i<nodes.length;i++) {
                if (nodes[i] !== "" + v) {
                    reducedNodes.push(v);
                }
            }
            const reducedNodesString = reducedNodes.join(",");
            for(let u=0;u<reducedNodes.length;u++) {
                const dist = this._HK_Visit(u,reducedNodesString);
                if((dist + this.w[u][v]) < mindist) {
                    mindist = dist + w[u][v];
                    minprec = u;
                }
            }
            this.d[v][S] = mindist;
            this.p[v][S] = minprec;
            return mindist;
        }
    }

    _isTimeExpired() {
        return (this.timeout - Math.floor(Date.now() / 1000)) < 0;
    }

    _listToString(list) {
        return list.join(",");
    }

};