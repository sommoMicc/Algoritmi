const Contea = require("./contea");

module.exports = class Dataset {
    constructor(fileContent = null) {
        this.contee = [];
        if(fileContent != null)
            this.parseFile(fileContent)
    }

    add(contea) {
        this.contee.push(contea);
    }

    get(index) {
        return this.contee[index];
    }

    getAll() {
        return this.contee;
    }

    parseFile(fileContent) {
        const rows = fileContent.split("\n");
        for(let i=0;i<rows.length;i++) {
            this.add(Contea.fromCSV(rows[i]));
        }

        console.log("Aggiunte "+this.size()+" contee");
    }

    size() {
        return this.contee.length;
    }

    distance(a,b) {
        return Math.sqrt((Math.pow((a.x - b.x),2)) + (Math.pow((a.y - b.y),2)))
    }
};