module.exports = class Punto {
    constructor(x,y) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
    }

    distance(b) {
        const a = this;
        return Math.sqrt((Math.pow((a.x - b.x),2)) + (Math.pow((a.y - b.y),2)))
    }
}