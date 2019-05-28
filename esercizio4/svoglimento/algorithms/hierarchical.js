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

        }
    }
};