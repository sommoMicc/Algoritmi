const Queue = require("../models/queue");
module.exports = class GraphWalker {
    static get Colors() {
        return {
            WHITE: "white",
            GRAY: "gray",
            BLACK: "black"
        }
    };

    /**
     * @param {UndirectedGraph} G il grafico 
     * @param {Number} s indice del nodo da cui iniziare il cammino
     */
    static BFS(G,s) {

        let d = [];
        let color = [];
        let predecessor = [];

        //console.log(G.getNodes());
        G.getNodes().forEach((v)=>{
            d[v] = Infinity;
            color[v] = GraphWalker.Colors.WHITE
            predecessor[v] = null;
        });

        console.log("D length: "+d.length);

        color[s] = GraphWalker.Colors.GRAY;
        d[s] = 0;

        let Q = new Queue();
        Q.enqueue(s);

        while(!Q.empty()) {
            let u = Q.dequeue();
            try {
                let adj = G.adjacence(u);
                if(adj != null)
                    Object.keys(adj).forEach((v)=>{
                        if(v > d.length) {
                            console.log("V: "+v+", d: "+d);
                        }
                        if(color[v] == GraphWalker.Colors.WHITE) {
                            color[v] = GraphWalker.Colors.GRAY;
                            d[v] = d[u] + 1;
                            predecessor[v] = u;
                            Q.enqueue(v);
                        }
                    });
            }
            catch(e) {
                console.error(e);
                console.log("U: "+u);
                console.log(G.adjacence(u));
            }
            color[u] = GraphWalker.Colors.BLACK;
        }
        return {
            d: d,
            predecessor: predecessor
        }
    }

    /**
     * Ritorna l'insieme delle componenti connesse di G
     * @param {UndirectedGraph} G il grafo da controllare
     */
    static connectedComponents(G) {
        let color = [];
        G.getNodes().forEach((v)=>{
            color[v] = GraphWalker.Colors.WHITE;
        });
        let CC = [];
        const nodes = G.getNodes();
        for(let v=0;v<nodes.length;v++) {
            if(color[nodes[v]] == GraphWalker.Colors.WHITE) {
                CC.push(GraphWalker._DFS_Visited(G,nodes[v],[],color))
            }
        }
        return CC;
    }

    static _DFS_Visited(G,u,visited,color) {
        color[u] = GraphWalker.Colors.GRAY;
        visited.push(u);

        let adj = G.adjacence(u);
        if(adj != null) {
            let keys = Object.keys(adj);
            for(let i=0;i<keys.length;i++) {
                if(color[keys[i]] == GraphWalker.Colors.WHITE) {
                    visited = GraphWalker._DFS_Visited(G,keys[i],visited,color);
                }
            }
        }
        color[u] = GraphWalker.Colors.BLACK;
        return visited;
    }
    /**
     * Ritorna il massimo numero di componenti connesse di G
     * @param {UndirectedGraph} G il grafo da controllare
     */
    static maxConnectedComponents(G) {
        const connectedComponents = GraphWalker.connectedComponents(G);
        let max = 0;
        connectedComponents.forEach((i) => {
            if(i.length > max) {
                max = i.length;
            }
        });

        return max;
    }
}