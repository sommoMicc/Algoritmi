const Cluster = require("../models/cluster");

module.exports = class KMeans {
    /**
     * @param {Dataset}dataset il dataset di riferimento
     * @param {number}k numero di cluster richiesti
     * @param {number}q numero di iterazioni
     * @constructor
     */
    constructor(dataset,k,q) {
        this.dataset = dataset;
        this.k = k;
        this.q = q;

        this.centroidi = [];
    }

    clustering() {
        // Secondo la consegna dell'esercizio, devo avere k centroidi rappresentanti le
        // 15 contee con popolazione maggiore
        const contee = this.dataset.getAll().sort((a,b)=>a.popolazione - b.popolazione);
        let n = contee.length;

        for(let i=0;i<this.k;i++) {
            // Creo i 15 centroidi richiesti
            this.centroidi.push({
                x:contee[i].x,
                y:contee[i].y
            });
        }
        let cluster = null;
        for(let i=0;i<this.q;i++) {
            cluster = KMeans.emptyCluster(this.k);
            for(let j=0;j<(n-1);j++) {
                let l = this.trovaCentroidePiuVicino(contee[j]);
                cluster[l].add(contee[j]);
            }
            for(let f=1;f<this.k;f++) {
                this.centroidi[f] = cluster[f].center();
            }
        }

        return cluster;
    }

    /**
     * Crea k cluster vuoti
     * @param {number}k il numero di cluster vuoti da creare
     * @returns {Array<Cluster>}
     */
    static emptyCluster(k) {
        const clusters = [];
        for(let i=0;i<k;i++) {
            clusters[i] = new Cluster();
        }

        return clusters;
    }

    /**
     * Trova il centroide più vicino alla contea considerata
     * @param {Contea}contea la contea di riferimento
     */
    trovaCentroidePiuVicino(contea) {
        let minDist = Infinity;
        let l = null;

        for(let i=0;i<this.k;i++) {
            const actualDistance = contea.distance(this.centroidi[i]);
            if(actualDistance < minDist) {
                minDist = actualDistance;
                l = i;
            }
        }

        return l;
    }
}
