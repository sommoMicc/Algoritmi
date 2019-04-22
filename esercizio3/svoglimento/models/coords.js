const ENUM = require("./enum");

module.exports = class Coord {
    /**
     * Costruttore per la classe coords
     * @param {Enum.Coords} type il tipo di sistema di coordinate da usare
     */
    constructor(type) {
        this.lat = 0;
        this.lng = 0;
        this._type = type;
    }


};
