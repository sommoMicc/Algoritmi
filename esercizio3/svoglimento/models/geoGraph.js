const Coord = require("./coords");
const ENUM = require("./enum");

module.exports = class GeoGraph {    /**
     * Costruttore per la classe GeoGraph
     * @param {"GEO","EUC_2D"} type il tipo del sistema di coordinate adottato nel grafo
     */
    constructor(type) {
        this._nodes = {};
        this._type = type === ENUM.COORD_TYPES.GEO ?
            ENUM.COORD_TYPES.GEO : ENUM.COORD_TYPES.EUC_2D;
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

    /**
     * Rimuove un nodo dal grafo
     * @param {number}index il nodo da rimuovere
     */
    removeNode(index) {
        delete this._nodes[index];
    }

    /**
     * Ritorna la lista dei nodi (indici) presenti nel grafo
     * @returns {string[]} la lista dei nodi presenti nel grafo
     */
    getNodesList() {
        return Object.keys(this._nodes);
    }

    /**
     * Carica un nodo parsando una riga del file.
     * @param {String} row la riga del file da parsare
     */
    parseRow(row) {
        let rowPieces = row.trim().split(/\s+/);
        let rowPiecesNumber = [];
        if(rowPieces.length !== 3) {
            //La riga passata non contiene le informazioni
            return false;
        }

        for(let i=0;i<rowPieces.length;i++) {
            rowPiecesNumber[i] = i === 0 ? parseInt(rowPieces[i].trim()) :
                parseFloat(rowPieces[i].trim());
        }
        this.addNode(rowPiecesNumber[0]-1,rowPiecesNumber[1],rowPiecesNumber[2]);
        return true;
    }

    /**
     * Calcola la distanza tra il primo nodo e il secondo
     * @param {number} first l'indice del primo nodo
     * @param {number} second l'indice del secondo nodo
     * @returns {number} la distanza tra il primo nodo e il secondo
     */
    distanceBetween(first,second) {
        return this._nodes[first].distance(this._nodes[second]);
    }

    /**
     * Converte un oggetto in un'istanza di GeoGraph
     * @param {GeoGraph} other l'altro grafo da convertire in oggetto
     */
    static castToGraph(other)  {
        const geo = new GeoGraph(other._type);
        const nodes = Object.keys(other._nodes);

        for(let i=0;i<nodes.length;i++) {
            const n = nodes[i];

            const nodeToAdd = new Coord(other._nodes[n]._type,false);
            nodeToAdd.lat = other._nodes[n]._lat;
            nodeToAdd.lng = other._nodes[n]._lng;

            geo._nodes[n] = nodeToAdd;
        }
        return geo;
    }
};