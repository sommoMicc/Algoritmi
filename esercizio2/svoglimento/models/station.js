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
};