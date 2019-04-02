module.exports = class Segment {
    constructor(strokeId,departureTime,arrivalTime) {
        this.strokeId = strokeId;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
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
        const departureTime = row.substring(39,43).trim();

        return {
            station: row.substring(0,9),
            arrivalTime: arrivalTime.length > 0 ? arrivalTime : null,
            departureTime: departureTime.length > 0 ? departureTime : null
        }
    }
}
;