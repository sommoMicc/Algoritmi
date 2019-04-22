const Coord = require("./coords");
const ENUM = require("./enum");

module.exports = class GeoGraph {    /**
     * Costruttore per la classe GeoGraph
     * @param {"GEO","EUC_2D"} type il tipo del sistema di coordinate adottato nel grafo
     */
    constructor(type) {
        this._nodes = {};
        this._type = type == ENUM.COORD_TYPES.GEO ? ENUM.COORD_TYPES.GEO : ENUM.COORD_TYPES.EUC_2D;
    }

    /**
     * Aggiunge un nodo
     * @param {number} index l'indice numerico del nodo da aggiungere
     * @param {Coords} coord le coordinate da aggiungere
     */
    addNodeWithCoords(index,coord) {
        this._nodes[index] = coord;
    }

    /**
     * Aggiunge un nodo dati latitudine e longitudine
     * @param {number} index l'indice del nodo da aggiungere
     * @param {number} lat la latitudine del nodo 
     * @param {number} lng la longitudine del nodo
     */
    addNode(index,lat,lng) {
        const coord = new Coord(this._type);
        coord.lat = lat;
        coord.lng = lng;

        this.addNodeWithCoords(index,coord);
    }

    static 
};