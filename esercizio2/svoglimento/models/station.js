module.exports = class Station {
    constructor(code,name) {
        this.code = code;
        this.name = name;
    }

    /**
     * Costruisce un oggetto Stazione a partire da una riga del file "bahnhof"
     * @param {String} row la riga da parsare
     * @returns {Station} un'istanza della classe Stazione
     */
    static fromFile(row) {
        const rowPieces = row.split(" ");

        const code = rowPieces[0];
        let name = "";

        for(let i=2;i<rowPieces.length;i++) {
            name += rowPieces[i];
        }
        name = name.replace(/(?:\\[rn])+/g, "");
        return new Station(code,name);
    }

    /**
     * Deduce le coordinate di una stazione presente nel file "bfkoords"
     * @param {String} row la riga da parsare
     * @returns {{lng: number, station: string, lat: number}} le coordinate corrispondenti
     */
    static parseCoords(row) {
        const rowPieces = row.split("   ");

        return {
            station: rowPieces[0],
            lat: parseFloat(rowPieces[2]),
            lng: parseFloat(rowPieces[1])
        };
    }
};