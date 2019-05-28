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
}