const Station = require("./station");

module.exports = class StationGraph {
    constructor() {
        this.stations = {};
        this.stationEdges = {};
    }

    /**
     * Aggiunge una stazione al grafo
     * @param {Station} station la stazione
     */
    addStation(station) {
        this.stations[station.code] = station;
        this.stationEdges[station.code] = {};
    }

    /**
     * Ritorna la lista delle stazioni
     * @returns {Array<String>} la lista delle stazioni
     */
    getStations() {
        return Object.keys(this.stations);
    }

    /**
     * Ritorna il numero di stazioni caricate
     * @returns {number} il numero di stazioni caricate
     */
    getStationsNumber() {
        return this.getStations().length;
    }

    /**
     * Aggiunge un segmento (inteso come pezzo di linea di un bus/treno) al grafo
     * @param {string} from la stazione di partenza
     * @param {string} to la stazione di arrivo
     * @param {Segment} segment il segmento da aggiungere
     */
    addEdge(from,to,segment) {
        if(this.stationEdges[from][to] == null) {
            this.stationEdges[from][to] = [segment];
        }
        else {
            this.stationEdges[from][to].push(segment);
            //this.stationEdges[from][to].sort()
        }
    }
};