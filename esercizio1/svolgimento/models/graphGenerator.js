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
    static UPA(n,m) {
        const graph = new UndirectedGraph();
        graph.fullConnect(n);

        

        return graph;
    }
}