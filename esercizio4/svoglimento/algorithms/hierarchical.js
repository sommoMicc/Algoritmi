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
        const label = "100 cluster";
        console.time(label);
        while(this.clusters.length > this.k) {
            if(this.clusters.length % 100 === 0) {
                console.timeEnd(label);
                console.time(label);
            }
            const ij = this._argmin();

            if(ij[0] === -1 || ij[1] === -1) {
                console.error("Risultato errato");
            }

            try {
                this.clusters.push(Cluster.union(this.clusters[ij[0]],this.clusters[ij[1]]));
            }
            catch (e) {
                console.error(e);
                console.log(ij);
                process.exit(0);
            }
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
        this.clusters = this.clusters.sort((a,b)=> {
            return a.center().x - b.center().x;
        });

        let S = [];
        for(let i = 0;i<this.clusters.length;i++) {
            S.push(i);
        }

        S = S.sort((a,b)=> {
            return this.clusters[a].center().y - this.clusters[b].center().y;
        });

        const dijS = this._slowClosestPair(this.clusters);
        const dijF = this._fastClosestPair(this.clusters,S);
        if((dijS[1] !== dijF[1] || dijS[2] !== dijF[2]) &&
            (dijS[2] !== dijF[1] || dijS[1] !== dijF[2])) {
            console.log("ERRORE!!!");
            console.log("slow: " + dijS + " reale " + this.clusters[dijS[1]].distance(this.clusters[dijS[2]]));
            console.log(this.clusters[dijS[1]].toString());
            console.log(this.clusters[dijS[2]].toString());
            console.log("fast: " + dijF + " reale " + this.clusters[dijF[1]].distance(this.clusters[dijF[2]]));
            console.log(this.clusters[dijF[1]].toString());
            console.log(this.clusters[dijF[2]].toString());
            process.exit();
        }

        return [
            dijF[1],
            dijF[2]
        ];
    }

    /**
     * Implementa l'algoritmo di slow closest pair
     * @returns {Array<number>} la coppia di cluster più vicina, compresa la distanza
     * @private
     */
    _slowClosestPair(clusters) {
        let dij = [Infinity,-1,-1];
        for(let u=0;u<clusters.length;u++) {
            let pu = clusters[u];
            for(let v=u+1;v<clusters.length;v++) {
                let pv = clusters[v];
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

    /**
     *
     * @param {Array<number>}S vettore di indici di P ordinato
     * @param {Array<Cluster>}Pl partizione degli elementi in S
     * @param {Array<Cluster>}Pr partizione degli elementi in S
     * @returns {Array<Array<number>>} vettori Sl e Sr che contengono, nell'ordine in
     * cui compaiono in S, gli elementi di Pl e Pr rispettivamente
     * @private
     */
    _split(S,Pl,Pr) {
        const results = [[],[]];

        for(let i = 0;i<S.length; i++) {
            if(Pl.includes(this.clusters[S[i]])) {
                results[0].push(S[i]);
            }
            else if(Pr.includes((this.clusters[S[i]]))) {
                results[1].push(S[i]);
            }
            else
                throw "In split elemento non presente in nessuno dei due vettori"
        }
        return results;
    }

    /**
     *
     * @param {Array<number>}S vettore di indici di P ordinati per coordinata y crescente
     * @param {number}mid valore reale
     * @param {number}d valore reale positivo
     * @returns {Array<number>} dij: d è la distanza tra le coppie di punti in S che si trovano
     * nella fascia verticale [mid - d;mid + d] e i,j sono gli indici dei due punti la cui distanza è d
     * @private
     */
    _closestPairStrip(S,mid,d) {
        if(d < 0)
            throw "In closestPairStrip d è negativo: "+d;

        const S1 = [];
        for(let i=0;i<S.length;i++) {
            if(Math.abs(this.clusters[S[i]].center().x - mid) < d) {
                S1.push(S[i]);
            }
        }

        let dij = [Infinity,-1,-1];
        for(let u=0; u<(S1.length - 1); u++) {
            for(let v = u+1; v < Math.min(u+5,S.length,S1.length);v++) {
                const delta = this.clusters[S1[u]].distance(this.clusters[S1[v]]);
                if(delta < dij[0]) {
                    dij[0] = delta;
                    dij[1] = S1[u];
                    dij[2] = S1[v];
                }
            }
        }
        return dij;
    }

    /**
     *
     * @param {Array<Cluster>}P un array di cluster ordinati per coordinata x crescente (rispetto
     * al loro centro)
     * @param {Array<number>}S array di indici di P ordinati per coordinata y crescente
     * @returns {Array<number>} dij: d è la distanza tra le coppie di punti in S che si trovano
     * nella fascia verticale [mid - d;mid + d] e i,j sono gli indici dei due punti la cui distanza è d
     * @private
     */
    _fastClosestPair(P,S) {
        if(P.length <= 3) {
            const dijSlow =  this._slowClosestPair(P);
            return [
                dijSlow[0],
                this.clusters.indexOf(P[dijSlow[1]]),
                this.clusters.indexOf(P[dijSlow[2]])
            ];
        }

        const m = Math.floor(P.length / 2);
        const Pl = [], Pr = [];
        for(let i=0;i<m;i++) {
            Pl.push(P[i]);
        }
        for(let i=m;i<P.length;i++) {
            Pr.push(P[i]);
        }
        if((Pl.length + Pr.length) !== P.length) {
            console.log("ERRORE NELLA CATALOGAZIONE DI P IN PL E PR!");
        }
        const slr = this._split(S,Pl,Pr);
        const Sl = slr[0];
        const Sr = slr[1];

        if((Sl.length + Sr.length) !== S.length) {
            console.log("ERRORE NELLA CATALOGAZIONE DI S IN SL E SR!");
        }

        const dijL = this._fastClosestPair(Pl,Sl);
        const dijR = this._fastClosestPair(Pr,Sr);

        let dij = (dijL[0] < dijR[0]) ? dijL : dijR;
        const mid = (P[m-1].center().x + P[m].center().x) / 2;

        const cps = this._closestPairStrip(S,mid,dij[0]);
        dij = (dij[0] < cps[0]) ? dij : cps;

        return dij;
    }
};