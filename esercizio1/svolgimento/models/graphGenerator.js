const UndirectedGraph = require("./undirectedGraph");

module.exports = class GraphGenerator {
    /**
     * @param {Array<Number>} nodes array di nodi, ad esempio [1,2,3,4,5,...6581]
     * @param {Number} p probabilità di creare un arco
     */
    static ER(nodes,p) {
        const graph = new UndirectedGraph();
        
        for(let u=0;u<nodes.length;u++) {
            for(let v=0;v<nodes.length;v++) {
                if(nodes[u] !== nodes[v]) {
                    let a = Math.random() * (nodes.length);

                    if(a <= p) {
                        //console.log("Aggiungo arco da "+ nodes[u]+" a "+nodes[v]);
                        graph.addEdge(nodes[u],nodes[v]);
                    }
                }
            }
        }
        return graph;
    }

    /**
     * @param {Number} n numero di nodi del grafo finale 
     * @param {Number} m numero di nodi del sottoinsieme a cui vengono connessi i nuovi nodi
     */
    static async UPA(n,m) {
        console.time("Full Connect: ");
        const graph = new UndirectedGraph();
        graph.fullConnect(n);
        console.timeEnd("Full Connect: ");

        let parameters = {
            nodeNumbers: [],
            numNodes: 0
        }
        GraphGenerator._UPATrial(m,parameters);
        console.time("checkpoint");
        let edgesAdded = 0;
        for(let u=m;u<n;u++) {
            let V1 = GraphGenerator._UPARUNTrial(m,parameters);
            edgesAdded += V1.length;
            for(let i=0;i<V1.length;i++) {
                await graph.addEdge(u,V1[i]);
            }
            if((n-u) % 50 == 0) {
                console.log("Checkpoint, ne mancano "+(n-u)+", archi aggiunti: "+edgesAdded);
                console.timeEnd("checkpoint");
                edgesAdded = 0;
                console.time("checkpoint");
            }
        }
        console.timeEnd("checkpoint");

        return graph;
    }
    /**
     * @param {Number} m numero di nodi del sottoinsieme a cui vengono connessi i nuovi nodi
     * @param {Object} parameters oggetto contenente parametri passati per riferimento 
     */
    static _UPATrial(m, parameters) {
        parameters.nodeNumbers = [];
        parameters.numNodes = m;
        for(let i=0;i<m;i++) {
            for(let j=0;j<m;j++)
                parameters.nodeNumbers.push(i);
        }
    }
    /**
     * @param {Number} m numero di nodi del sottoinsieme a cui vengono connessi i nuovi nodi
     * @param {Object} parameters oggetto contenente parametri passati per riferimento 
     */
    static _UPARUNTrial(m,parameters) {
        const V1 = [];
        for(let i=1;i<=m;i++) {
            let u = GraphGenerator.pickRandom(parameters.nodeNumbers);
            V1.push(u);
        }
        parameters.nodeNumbers.push(V1);
        parameters.numNodes++;

        return V1;
    }

    /**
     * @param {Array} a array dal cui si vuole prelevare un elemento random
     */
    static pickRandom(a) {
        return a[Math.floor(Math.random() * a.length)]
    }
}