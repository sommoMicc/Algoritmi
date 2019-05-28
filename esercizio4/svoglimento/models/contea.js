const Punto = require("./point");

module.exports = class Contea extends Punto{
    constructor(codice,x,y,rischio,popolazione) {
        super(x,y);
        this.codice = codice;
        this.rischio = parseFloat(rischio);
        this.popolazione = parseFloat(popolazione);
    }

    static fromCSV(row) {
        const rowData = row.split(",");
        return new Contea(
            rowData[0],
            rowData[1],
            rowData[2],
            rowData[3],
            rowData[4]
        )
    }

}