const Station = require("./station");
const Segment = require("./segment");

/**
 * Classe che gestisce il grafo i cui nodi sono le stazioni e i cui archi sono le varie
 * tratte che li collegano
 * @type {StationGraph}
 */
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

    /**
     * Ritorna la lista di segmenti che riesco a prendere, considerando il
     * departureTime, e date le stazioni di partenza e di arrivo
     * @param {string} from stazione di partenza
     * @param {string} to stazione di destinazione
     * @param {number|string} departureTime l'orario minimo di partenza
     * @returns {null|Array<Segment>} lista di tratte che soddisfano i criteri
     *          di ricerca
     */
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
        /**
         * Questa condizione merita un po' di approfondimento. Se found è false, significa che, partendo dal centro
         * dell'array non sono riuscito a determinare un valore ritenuto ottimo. Questo potrebbe succedere al verificarsi
         * di due casi particolari:
         * a) Partendo dal centro sono arrivato al primo elemento dell'array (i == 0), il quale aveva un departureTime
         *    ancora maggiore rispetto al mio departureTime, quindi ho decrementato ancora i (i == -1) e sono uscito dal
         *    ciclo. Questo caso lo distinguo perché i == -1 e previousState == 1 (ovvero l'ultimo elemento analizzato
         *    aveva departureDate > della mia departureDate passata come parametro della funzione)
         * b) Partendo dal centro sono arrivato alla fine dell'array, senza aver trovato una tratta possibile. In tal
         *    caso dovrò prendere il bus il giorno dopo.
         */
        if(!found && i === availableSegments.length) {
            return null;
        }
        else if(!found &&
            (!(previousState != null && previousState == 1 && i<0))) {

            console.log(i);
            i = 0;
            found = true;
        }

        if(!found) {
            return null;
        }
        return availableSegments.slice(i,availableSegments.length);
    }

    /**
     * Ritorna la lista delle adiacenze di un nodo
     * @param {string} node il nodo di cui si vuole ottenere la lista delle adiacenze
     * @returns {Array<Station>}
     */
    getNeighbours(node) {
        return this.stationEdges[node];
    }

    /**
     * Ritorna la tratta migliore per andare dalla stazione "from" alla stazione "to",
     * tenendo conto del vincolo dell'orario
     * @param {string} from la stazione di partenza
     * @param {string} to la stazione di destinazione
     * @param {numeric} departureTime il tempo di partenza, espresso come numero di minuti
     * passati dalla mezzanotte del primo giorno (giorno 0) di viaggio
     * @returns {{segment: Segment, weight: number}|null} la tratta migliore con il relativo peso,
     * se esite, oppure null
     */
    getBestSegment(from,to,departureTime) {
        const minutesInADay = 1440;


        //Devo ricavarmi il tempo relativo alla mezzanotte del giorno in cui mi trovo
        //Ovvero, per un viaggio di tre giorni, il mio "departureTime" (visto come stringa)
        //potrebbe essere qualcosa come 20630 per indicare le 6 e mezza del mattino del
        //terzo giorno di viaggio. Devo quindi ricavarmi i minuti dalla mezzanotte del terzo
        //giorno equivalenti alle ore 06:30 (ovvero 390) e usare questo dato per la ricerca della tratta
        let relativeTime = departureTime % minutesInADay;
        let eligibleSegments = this.getEligibleSegments(from,to,relativeTime);

        //Valore che serve per le tratte che necessitano di attraversare la mezzanotte in stazione
        let penality = 0;

        if(eligibleSegments == null && this.stationEdges[from][to] != null) {
            //Sono nel caso in cui è troppo tardi per prendere anche l'ultima corsa da from a to
            //devo quindi aspettare la prima del giorno dopo. Rifaccio la ricerca passando come
            //departureTime la mezzanotte (ovvero il numero 0) e setto la penalità al numero di
            //minuti che mancano per la mezzanotte del giorno successivo
            penality = minutesInADay - relativeTime;
            relativeTime = 0;
            eligibleSegments = this.getEligibleSegments(from,to,relativeTime);
        }

        if(eligibleSegments == null && this.stationEdges[from][to] == null ||
            eligibleSegments == null && penality > 0) {
            //Se non ho tratte che collegano i due nodi, ritorno null
            return null;
        }

        let fastestSegment = eligibleSegments[0];
        for(let i=1;i<eligibleSegments.length;i++) {
            //Semplice problema di ricerca del minimo
            if(eligibleSegments[i].numericArrivalTime < fastestSegment.numericArrivalTime) {
                fastestSegment = eligibleSegments[i];
            }
        }

        return {
            segment: fastestSegment,
            weight: fastestSegment.numericArrivalTime - relativeTime + penality
        };
    }

};