const BinaryHeap = require("../models/binaryHeap");
const Segment = require("../models/segment");

module.exports = class GraphWalker {
    //Implementazione di Dijkstra

    /**
     * Inizializza tutti i parametri per poter poi applicare Dijistra
     * @param {StationGraph} graph il grafo che si vuole analizzare
     * @param {String} start chiave del nodo di partenza
     * @returns {{p: Array, d: Array}} vettori delle distanze (d) e dei predecessori (p)
     *          inizializzati a vuoto
     * @private
     */
    static _initSSSP(graph,start) {
        let p = [];
        let d = [];

        const s = graph.getStations();

        for(let i=0;i<s.length;i++) {
            let v = s[i];
            d[v] = Infinity;
            p[v] = null;
        }

        d[start] = 0;

        return {
            p: p,
            d: d
        };
    }

    /**
     * Salva un segmento trovato
     * @param {Array<String>} d vettore delle distanze
     * @param {Array<String>} p vettore dei predecessori
     * @param {number} D distanza che si vuole sommare, ovvero w(u,v)
     * @param {String} u nodo del grafo
     * @param {Segment} segment tratta da prendere per raggiungere v da u
     * @param {String} v nodo che si vuole aggiungere al cammino
     * @private
     */
    static _relax(d,p,D,u,segment,v) {
        if(u === v)
            return;

        d[v] = d[u] + D;
        p[v] = segment;
    }

    /**
     * Trova il cammino minimo dal nodo start al nodo di fine
     * @param {StationGraph} graph il grafo da elaborare
     * @param {String} startNode il nodo di partenza
     * @param {String} startTime l'orario di partenza desiderato
     * @returns {Array<number>} vettore delle distanze
     */
    static dijkstraSSSP(graph,startNode,startTime) {
        const initializedValues = GraphWalker._initSSSP(graph,startNode);
        let p = initializedValues.p;
        let d = initializedValues.d;

        /*let Q = new TinyQueue(graph.getStations(),(a,b)=>{
            if(d[a] === d[b] && d[a] === Infinity)
                return 0;
            return d[a] - d[b];
        });*/
        let Q = new BinaryHeap((a)=>{
            return d[a];
        },(a)=> a, d);

        graph.getStations().forEach((station) => {
            Q.push(station);
        });

        let currentArrivalTime = Segment.timeStringToInteger(startTime);
        while(Q.size() > 0) {
            let u = Q.pop();
            if(d[u] === Infinity)
                break;

            const neightboursList = graph.getNeighbours(u);
            if(neightboursList != null) {
                const neighbours = Object.keys(neightboursList);

                for (let i = 0; i < neighbours.length; i++) {
                    let v = neighbours[i];
                    if(u === v)
                        continue;

                    const bestSegment = graph.getBestSegment(u, v, currentArrivalTime + d[u]);
                    if(bestSegment != null) {
                        let alt = d[u] + bestSegment.weight;
                        //console.log("\nBest segment weight: "+Segment.numberToTime(bestSegment.weight));
                        if (alt < d[v]) {
                            GraphWalker._relax(d, p, bestSegment.weight, u, bestSegment.segment, v);
                            Q.decreaseKey(v, d[v]);
                        }
                    }
                }
            }
        }
        return {
            d: d,
            p: p
        };
    }
};