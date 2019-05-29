const Cluster = require("../models/cluster");

module.exports = class Hierarchical {
    constructor(dataset,k) {
        this.dataset = dataset;
        this.k = k;

        this.clusters = [];
    }

    clustering() {
        const contee = this.dataset.getAll();
        let n = contee.length;

        //Creo n cluster C tali che C[i] = {p[i]}
        for(let i=0;i<n;i++) {
            this.clusters[i] = new Cluster();
            this.clusters[i].add(contee[i]);
        }

        while(this.clusters.length > this.k) {
            console.log("Trovati "+this.clusters.length+" cluster");
            const ij = this._argmin();

            this.clusters.push(Cluster.union(this.clusters[ij[0]],this.clusters[ij[1]]));
            this.clusters.splice(ij[0],1);
            this.clusters.splice((ij[0] > ij[1]) ? ij[1] : ij[1] - 1, 1);
        }
        return this.clusters;
    }

    /**
     * Risolve il problema di cercare le coppie più vicine
     * @returns {Array<number>} gli indici dei cluster più vicini
     * @private
     */
    _argmin() {
        const dij = this._slowClosestPair();
        return [
            dij[1],
            dij[2]
        ];
    }

    /**
     * Implementa l'algoritmo di slow closest pair
     * @returns {Array<number>} la coppia di cluster più vicina, compresa la distanza
     * @private
     */
    _slowClosestPair() {
        let dij = [Infinity,-1,-1];
        for(let u=0;u<this.clusters.length;u++) {
            let pu = this.clusters[u];
            for(let v=u+1;v<this.clusters.length;v++) {
                let pv = this.clusters[v];
                if(dij[0] > pu.distance(pv)) {
                    dij = [
                        pu.distance(pv),
                        u,
                        v
                    ];
                }
            }
        }
        return dij;
    }
};