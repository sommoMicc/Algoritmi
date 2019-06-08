const Algorithm = require("./algorithm");

const Cluster = require("../models/cluster");
const Punto = require("../models/point");

module.exports = class KMeans extends Algorithm {
    /**
     * @param {Dataset}dataset il dataset di riferimento
     * @param {number}k numero di cluster richiesti
     * @param {number}q numero di iterazioni
     * @constructor
     */
    constructor(dataset,k,q) {
        super();
        this.dataset = dataset;
        this.k = k;
        this.q = q;

        this.centroidi = [];
    }

    clustering() {
        // Secondo la consegna dell'esercizio, devo avere k centroidi rappresentanti le
        // 15 contee con popolazione maggiore
        const contee = this.dataset.getAll().sort((a,b)=>b.popolazione - a.popolazione);
        let n = contee.length;

        for(let i=0;i<this.k;i++) {
            // Creo i 15 centroidi richiesti
            this.centroidi.push(new Punto(contee[i].x,contee[i].y));
        }
        let cluster = null;
        for(let i=0;i<this.q;i++) {
            cluster = KMeans.emptyCluster(this.k);

            for(let j=0;j<n-1;j++) {
                let l = this.trovaCentroidePiuVicino(contee[j]);
                cluster[l].add(contee[j]);
            }
            for(let f=0;f<this.k;f++) {
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

        for(let i=0;i<this.centroidi.length;i++) {
            const actualDistance = contea.distance(this.centroidi[i]);
            if(actualDistance < minDist) {
                minDist = actualDistance;
                l = i;
            }
        }

        return l;
    }

    static cascadeClustering(desc,dataset,minK,maxK) {
        const results = {};
        for(let i=maxK; i>=minK; i--) {
            const algorithm = new KMeans(dataset,i,5);
            results[i] = algorithm.clustering();
        }

        return results;
    }
};
