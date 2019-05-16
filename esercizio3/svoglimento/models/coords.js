const ENUM = require("./enum");

module.exports = class Coord {
    /**
     * Costruttore per la classe coords
     * @param {Enum.Coords} type il tipo di sistema di coordinate da usare
     */
    constructor(type,conversion=true) {
        this._lat = 0;
        this._lng = 0;
        this._type = type;
        this.conversion = conversion;
    }

    set lat(lat) {
        this._lat = lat;
        if(this._type === ENUM.COORD_TYPES.GEO && this.conversion) {
            this._lat = this._toRadiants(this._lat);
        }
    }
    set lng(lng) {
        this._lng = lng;
        if(this._type === ENUM.COORD_TYPES.GEO && this.conversion) {
            this._lng = this._toRadiants(this._lng);
        }
    }

    get lat() {
        return this._lat;
    }

    get lng() {
        return this._lng;
    }

    /**
     * Converte in radianti una coordinata
     * @param {number} value la coordinata da convertire in radianti
     * @returns {number} la coordinata convertita in radianti
     */
    _toRadiants(value) {
        let deg = Math.floor(value);
        let min = value - deg; 
        return Math.PI * (deg + 5.0 * min/ 3.0) / 180.0; 
    }

    /**
     * Calcola la distanza tra questo nodo e un altro
     * @param {Coord} otherNode l'altro nodo coordinata
     * @returns {number} la distanza calcolata
     */
    distance(otherNode) {
        let distance = 0;
        if(this.lat === otherNode.lat && this.lng === otherNode.lng)
            return distance;

        if(this._type === ENUM.COORD_TYPES.GEO) {
            //Radianti


            const RRR = 6378.388;

            let q1 = Math.cos(this.lng - otherNode.lng); 
            let q2 = Math.cos(this.lat - otherNode.lat); 
            let q3 = Math.cos(this.lat + otherNode.lat); 
            distance = Math.trunc(RRR * Math.acos( 0.5*((1.0+q1)*q2 - (1.0-q1)*q3)) + 1.0);
        }
        else {
            //Distanza euclidea
            distance = Math.round(Math.sqrt(
                Math.pow(this.lat - otherNode.lat,2) +
                Math.pow(this.lng - otherNode.lng,2)));

        }
        return distance;
    }



};
