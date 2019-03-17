const fs = require("fs");
const GraphWalker = require("./graphWalker");

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
     * @param {Number} info payload (numero) del nodo
     */
    addNode(info) {
        if(this._edges[info] != null) {
            //Il nodo che tento di aggiungere esiste già
            return false;
        }
        
        this._edges[info]= {};
    }

   /**
     * @param {Number} number indice del nodo da disconnettere
     */
    disconnectNode(number) {
        let keys = this.getNodes();
        keys.forEach((node) => {
            if(this._edges[node][number] != null) {
                delete this._edges[node][number];
            }
        });
        this._edges[number] = {};
    }

    /**
     * @param {Number} number indice del nodo da rimuovere
     */
    removeNode(number) {
        this.disconnectNode(number);
        if(this._edges[number] != null) {
            delete this._edges[number];
        }
    }

    /**
     * @param {Number} from nodo da cui parte l'arco
     * @param {Number} to nodo a cui arriva l'arco
     */
    addEdge(from,to) {
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
            delete this._edges[from][to];
            delete this._edges[to][from];
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

    empty(nodesNumber = -1) {
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
                this.removeEdge(nodes[i],nodes[j])
            }
        }

    }

    /**
     * Ritorna la lista delle adiacenze di un nodo
     * @param {Number} node indice del nodo di cui si vuol conoscere la lista delle adiacenze
     */
    adjacence(node) {
        return this._edges[node];
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
                let realCellSeparator = "";

                nodes.forEach((to)=>{
                    row += realCellSeparator;
                    if(context.existsEdge(from,to))
                        row += "1";
                    else
                        row += "0";
                    realCellSeparator = cellSeparator
                });
                stream.write(row+"\n");
            });
            stream.end();
        });
    }

    resilience() {
        return GraphWalker.maxConnectedComponents(this) /
             this.getNodesNumber();
    }

    getCopy() {
        return Object.assign( Object.create( Object.getPrototypeOf(this)), this);
    }
    /**
     * 
     * @param {UndirectedGraph} other l'altro grafo da convertire in oggetto
     */
    castToGraph(other)  {
        return Object.assign( Object.create( Object.getPrototypeOf(this)), other);
    }
}