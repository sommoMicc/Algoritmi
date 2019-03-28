module.exports = class GraphWalker {
    static get Colors() {
        return {
            WHITE: "white",
            GRAY: "gray",
            BLACK: "black"
        }
    };

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
                CC.push({
                    v: v,
                    connectedComponent: GraphWalker._DFS_Visited(G,nodes[v],[],color)
                });
            }
        }
        return CC;
    }
    /**
     * Implementazione della procedura DFS_Visited
     * @param {*} G il grafo che si sta visitando
     * @param {*} u il nodo di partenza
     * @param {*} visited la lista dei nodi già visitati partendo da u
     * @param {*} color array che assegna ad ogni nodo del grafo il suo colore
     */
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
            if(i.connectedComponent.length > max) {
                max = i.connectedComponent.length;
            }
        });

        return max;
    }
}