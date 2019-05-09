const ENUM = require("./enum");

module.exports = class Coord {
    /**
     * Costruttore per la classe coords
     * @param {Enum.Coords} type il tipo di sistema di coordinate da usare
     */
    constructor(type) {
        this._lat = 0;
        this._lng = 0;
        this._type = type;
    }

    set lat(lat) {
        this._lat = lat;
        if(this._type === ENUM.COORD_TYPES.GEO) {
            this._lat = this._toRadiants(this._lat);
        }
    }
    set lng(lng) {
        this._lng = lng;
        if(this._type === ENUM.COORD_TYPES.GEO) {
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
        let deg = parseInt(value); 
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
            distance = parseInt(RRR * Math.acos( 0.5*((1.0+q1)*q2 - (1.0-q1)*q3)) + 1.0);


            const R = 6378.388;
            const pigreco = Math.PI;
            let lat_alfa, lat_beta;
            let lon_alfa, lon_beta;
            let fi;
            let p;

            lat_alfa = pigreco * this.lat / 180;
            lat_beta = pigreco * otherNode.lat / 180;
            lon_alfa = pigreco * this.lng / 180;
            lon_beta = pigreco * otherNode.lng / 180;

            fi = Math.abs(lon_alfa - lon_beta);

            p = Math.acos(Math.sin(lat_beta) * Math.sin(lat_alfa) +
                Math.cos(lat_beta) * Math.cos(lat_alfa) * Math.cos(fi));


            //distance = p * R;
            //return(d);
        }
        else {
            //Distanza euclidea
            distance = Math.sqrt(
                Math.pow(this.lat - otherNode.lat,2) +
                Math.pow(this.lng - otherNode.lng,2)
            )
        }
        return distance;
    }

};
