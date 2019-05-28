module.exports = class Contea {
    constructor(codice,x,y,rischio,popolazione) {
        this.codice = codice;
        this.x = parseFloat(x);
        this.y = parseFloat(y);
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
};