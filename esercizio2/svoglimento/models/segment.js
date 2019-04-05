module.exports = class Segment {
    constructor(strokeId,departureTime,arrivalTime,departureStation,arrivalStation) {
        this.strokeId = strokeId;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.departureStation = departureStation;
        this.arrivalStation = arrivalStation;
    }

    /**
     * Getter per il departure time in formato numerico (minuti dalla mezzanotte)
     * @returns {number}
     */
    get numericDepartureTime() {
        return Segment.timeStringToInteger(this.departureTime);
    }

    /**
     * Getter per l'arrival time in formato numerico (minuti dalla mezzanotte)
     * @returns {number}
     */
    get numericArrivalTime() {
        return Segment.timeStringToInteger(this.arrivalTime);
    }
    /**
     * Ritorna il peso del segmento (tempo di percorrenza) in minuti
     * @returns {number} il tempo di percorrenza del segmento
     */
    getWeight() {
        return this.numericDepartureTime - this.numericArrivalTime;
    }

    /**
     * Ritorna true se il tempo passato come parametro è precedente al departure time.
     * In altre parole, ritorna true se riesco a prendere questa tratta, false altrimenti
     * @param {string} time il tempo da comparare con il departureTime
     * @returns {boolean} true se è fattibile prendere questa tratta, false altrimenti
     */
    isDepartureTimeFollowing(time) {
        const timeToCompare = typeof (time) === "string" ? Segment.timeStringToInteger(time) : time;
        return this.numericDepartureTime >= timeToCompare;
    }

    /**
     * Converte una stringa orario come 10324 nel numero di minuti passati dalla mezzanotte
     * @param {String} timeString la stringa orario da convertire
     * @returns {number} il numero di minuti passati dalla mezzanotte di timeString
     */
    static timeStringToInteger(timeString) {
        /*console.log(
            timeString.substring(0,1)+"*24*60+"+
            timeString.substring(1,3)+"*60+"+
            timeString.substring(3,5)
        );*/
        return parseInt(timeString.substring(0,1)) * 24 * 60 +
            parseInt(timeString.substring(1,3)) * 60 +
            parseInt(timeString.substring(3,5));
    }
    /**
     * Sovrascrivo il metodo toString per facilitare l'ordinamento in
     * ordine crescente di orario di partenza (departureTime) in modo da
     * semplificare la ricerca
     * @returns {string} l'equivalente in stringa del segmento
     */
    toString() {
        return this.departureTime+" "+this.arrivalTime+" "+this.strokeId;
    }

    /**
     * Parsa una riga del file
     * @param {String} row riga da parsare
     * @returns {{departureTime: string, arrivalTime: string, station: string}}
     */
    static parseRow(row) {
        const arrivalTime = row.substring(32,37).trim();
        const departureTime = row.substring(39,44).trim();


        return {
            station: row.substring(0,9),
            arrivalTime: arrivalTime.length > 0 ? arrivalTime : null,
            departureTime: departureTime.length > 0 ? departureTime : null
        }
    }

    /**
     * Rende un numero (espresso come distanza di minuti dalla mezzanotte
     * del primo giorno di viaggio) una stringa leggibile
     * @param {number|Infinity}number il numero che si vuole convertire
     * @returns {string} il tempo espresso in un formato leggibile
     */
    static numberToTime(number) {
        if(number === Infinity)
            return "Infinito";

        const minutesInADay = 1440;

        const days = Math.floor(number / minutesInADay);

        const remainingTime = number - days * minutesInADay;
        const hours = Math.floor(remainingTime / 60);
        const minutes = remainingTime % 60;

        return days+"g "+hours+"h "+minutes+"m";
    }
}
;