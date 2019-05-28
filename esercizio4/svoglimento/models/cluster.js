const Punto = require("./point");

module.exports = class Cluster {
    constructor() {
        this.points = [];
    }

    /**
     * Aggiunte un punto al cluster
     * @param {Punto}point il punto da aggiungere
     */
    add(point) {
        this.points.push(point);
    }

    center() {
        const size = this.points.length;
        if(size < 1)
            return new Punto(Infinity,Infinity);

        let sumX = 0;
        let sumY = 0;

        for(let i=0;i<size;i++) {
            sumX+=this.points[i].x;
            sumY+=this.points[i].y;
        }

        return new Punto(sumX/size, sumY/size);
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
};