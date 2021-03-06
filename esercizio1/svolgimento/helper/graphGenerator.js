const UndirectedGraph = require("../models/undirectedGraph");

module.exports = class GraphGenerator {
    /**
     * Genera un grafo secondo la procedura ER, con il significato del parametro "p" leggermente modificato
     * @param {Array<Number>} nodes array di nodi, ad esempio [1,2,3,4,5,...6581]
     * @param {Number} p probabilità di creare un arco espressa in base al numero di nodi totali
     */
    static ER(nodes,p) {
        const graph = new UndirectedGraph();
        
        for(let u=0;u<nodes.length;u++) {
            for(let v=0;v<nodes.length;v++) {
                if(nodes[u] !== nodes[v]) {
                    let a = Math.random() * (nodes.length);
                    graph.addNode(nodes[v]);
                    if(a <= p) {
                        graph.addEdge(nodes[u],nodes[v]);
                    }
                }
            }
        }
        return graph;
    }

    /**
     * Genera un grafo secondo la procedura UPA (DPA modificata per grafi non orientati)
     * @param {Number} n numero di nodi del grafo finale 
     * @param {Number} m numero di nodi del sottoinsieme a cui vengono connessi i nuovi nodi
     */
    static UPA(n,m = 1) {
        let graph = new UndirectedGraph();
        for(let i=0;i<n;i++) {
            for(let j=0; j<m; j++) {
                let currentNodes = graph.getNodes();
                if(currentNodes.length > 0) {
                    let nodeToConnect = GraphGenerator.pickRandom(currentNodes,i);
                    if(nodeToConnect != null) {
                        graph.addEdge(i,nodeToConnect);
                    }
                }
                else {
                    graph.addNode(i);
                }
            }
        }
        return graph;
    }

    /**
     * @param {Array} a array dal cui si vuole prelevare un elemento random
     * @param {Array} i valore a cui l'indice non deve equivalere
     */
    static pickRandom(a,i = -1) {
        let index = Math.floor(Math.random() * a.length);
        if(i == -1 || index != i)
            return a[index];
        else if(a.length == 1 && i == a.length - 1) {
            return null;
        }
        return GraphGenerator.pickRandom(a,i);
    }
}