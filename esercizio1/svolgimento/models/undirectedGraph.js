const fs = require("fs");

module.exports = class UndirectedGraph {
    constructor() {
        this._edges = {};
        this.numberOfEdges = 0;
    }

    loadFromFile(fileName) {
        const fileContent = fs.readFileSync(fileName,"utf8");
        const rows = fileContent.split("\n");

        rows.forEach((row)=>{
            if(!row.startsWith("#") && row.trim().length > 0) {               
                const cells = row.split("\t");
                
                const from = parseInt(cells[0]);
                const to = parseInt(cells[1]);
        
                this.addEdge(from,to);
            }
        });       
    }
    /**
     * @param {Number} from nodo da cui parte l'arco
     * @param {Number} to nodo a cui arriva l'arco
     */
    async addEdge(from,to) {
        //ignoro i cappi
        if(from == to)
            return false;

        if(this._edges[from] == null) 
            this._edges[from] = {};

        if(this._edges[to] == null) 
            this._edges[to] = {};

        if(!(this._edges[from][to] == this._edges[to][from] && this._edges[from][to] == true)) {
            //Se non esiste già l'arco lo inserisco
            this._edges[from][to] = true;
            this._edges[to][from] = true;
            
            this.numberOfEdges++;
            return true;
        }
        return false;
    }

    removeEdge(from,to) {
        if(this._edges[from] != null) {
            delete this._edges[from][to]
        }
    }

    existsEdge(from,to) {
        return (this._edges[from] != null &&
            this._edges[from][to] != null &&
            this._edges[from][to]);
    }

    getEdges(from) {
        return Object.keys(this._edges[from])
    }

    getNodes() {
        return Object.keys(this._edges);
    }

    getNodesNumber() {
        return this.getNodes().length;
    }

    getAverageDegree() {
        return this.numberOfEdges / this.getNodes().length;
    }

    /**
     * @param {Number} nodesNumber numero di nodi che si vogliono aggiungere al grafo, -1 per usare quelli esistenti
     */
    fullConnect(nodesNumber = -1) {
        let nodes = null;
        if(nodesNumber == -1)
            nodes = this.getNodes();
        else {
            nodes = [];
            for(let i=1;i<=nodesNumber;i++) {
                nodes.push(i);
            }
        }
        for(let i=0;i<nodes.length;i++) {
            for(let j=nodes.length; j > i;j--) {
                this.addEdge(nodes[i],nodes[j])
            }
        }
    }

    print() {
        const nodes = Object.keys(this._edges);
        nodes.forEach((from)=>{
            let row = "";
            nodes.forEach((to)=>{
                if(this.existsEdge(from,to))
                    row += "1";
                else
                    row += "0";
                row += "\t";
            });
            console.log(row);
        })
    }
    /**
     * @param {String} fileName nome del file da creare
     * @param {String} cellSeparator separatore delle celle
     */
    saveToFile(fileName = "output.txt",cellSeparator = "\t") {
        const nodes = Object.keys(this._edges);
        const context = this;

        const stream = fs.createWriteStream("assets/"+fileName);
        stream.once('open', function(fd) {
            nodes.forEach((from)=>{
                let row = "";
                nodes.forEach((to)=>{
                    if(context.existsEdge(from,to))
                        row += "1";
                    else
                        row += "0";
                    row += cellSeparator;
                });
                stream.write(row+"\n");
            });
            stream.end();
        });
    }
}