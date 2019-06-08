const Punto = require("./point");

module.exports = class Cluster {
    /**
     * Costruttore
     * @param {Array<Punto> | null}points
     * @constructor
     */
    constructor(...points) {
        this.points = [];
        if(points != null)
            this.points.concat(points);

        this._center = null;
    }

    /**
     * Aggiunte un punto al cluster
     * @param {Punto}point il punto da aggiungere
     */
    add(point) {
        this.points.push(point);
        this._center = null;
    }

    center() {
        if(this._center != null)
            return this._center;

        const size = this.points.length;
        if(size < 1)
            return new Punto(Infinity,Infinity);

        let sumX = 0;
        let sumY = 0;

        for(let i=0;i<size;i++) {
            sumX+=this.points[i].x;
            sumY+=this.points[i].y;
        }

        const center = new Punto(sumX/size, sumY/size);
        this._center = center;

        return center;
    }

    distance(other) {
        return other.center().distance(this.center());
    }

   /**
     * Raggruppa due cluster in uno nuovo
     * @param {module.Cluster}a
     * @param {module.Cluster}b
     * @returns {module.Cluster}
     */
    static union(a,b) {
        const newCluster = new Cluster();
        for(let i=0;i<a.points.length;i++) {
            newCluster.add(a.points[i]);
        }
        for(let i=0;i<b.points.length;i++) {
            newCluster.add(b.points[i]);
        }
        return newCluster;
    }

    toString() {
        return "{ x: "+this.center().x+", y: "+this.center().y+" }";
    }

    /**
     * Ritorna l'errore del clusters
     * @returns {number}
     */
    get error() {
        let totalError = 0;
        for(let i=0;i<this.points.length;i++) {
            const contea = this.points[i];
            const delta = contea.distance(this.center());
            totalError += (contea.popolazione * Math.pow(delta,2));
        }

        return totalError;
    }

    /**
     * Ritorna la distorsione di un array di cluster
     * @param {Array<Cluster>}clusters il soggetto
     * @returns {number}
     */
    static getDistortion(clusters) {
        let totalDistortion = 0;
        for(let i=0;i<clusters.length;i++) {
            totalDistortion += clusters[i].error;
        }
        return totalDistortion;
    }

    static cascadeDistortion(cascadeData) {
        const keys = Object.keys(cascadeData);
        const results = {};
        for(let i=0;i<keys.length;i++) {
            results[keys[i]] = Cluster.getDistortion(cascadeData[keys[i]]);
        }

        return results;
    }
};