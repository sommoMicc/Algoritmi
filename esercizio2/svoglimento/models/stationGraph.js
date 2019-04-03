const Station = require("./station");
const Segment = require("./segment");

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

    /**
     * Riordina gli orari degli archi in ordine di departureDate crescente
     * per facilitare la ricerca
     * @param {{setTotal: function,update: function(number)}} progressWatcher
     * observer per il progresso
     * @returns {Promise<boolean>} true quando ha finito
     */
    sortEdges(progressWatcher) {
        return new Promise((resolve)=>{
            const stationsFrom = Object.keys(this.stationEdges);
            progressWatcher.setTotal(stationsFrom.length);
            for(let i=0;i<stationsFrom.length;i++) {
                const stationsTo = Object.keys(this.stationEdges[stationsFrom[i]]);
                for(let j=0;j<stationsTo.length;j++) {
                    this.stationEdges[stationsFrom[i]][stationsTo[j]].sort();
                }
                progressWatcher.update(i+1);
            }
            console.log("Totale: "+this.stationEdges["200415016"]["200415009"].length);
            resolve(true);
        });
    }


    getEligibleSegments(from,to,departureTime) {
        const availableSegments = this.stationEdges[from][to];

        let i = Math.floor(availableSegments.length / 2);
        let found = false;
        //Variabile che, se impostata a 1, indica che all'iterazione precedente
        //ho trovato un valore di i per cui
        //availableSegments[i].isDepartureTimeFollowing è true, quindi valido
        //ma potenzialmente non ottimo
        let previousState = null;

        while(i>=0 && i<availableSegments.length && !found) {
            if(availableSegments[i].isDepartureTimeFollowing(departureTime)) {
                previousState = 1;
                i--;
                continue;
            }
            if(!availableSegments[i].isDepartureTimeFollowing(departureTime)
                && previousState != null && previousState === 1) {
                i++;
                found = true;
                continue;
            }
            if(!availableSegments[i].isDepartureTimeFollowing(departureTime)) {
                i++;
                previousState = -1;
            }
        }

        if(!found && !(previousState != null && previousState === 1 && i<0)) {
            i = 0;
            found = true;
        }

        if(!found) {
            return null;
        }
        return availableSegments.slice(i,availableSegments.length);
    }
};