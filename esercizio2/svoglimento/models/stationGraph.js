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
};