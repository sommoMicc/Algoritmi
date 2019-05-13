const UnionByDepth = require("../models/union_depth");
const BinaryHeap = require("../models/binaryHeap");

module.exports = class TwoApprox {
    constructor(graph) {
        this.graph = graph;
    }

    start() {
        return TwoApprox.Prim(this.graph);
    }

    static Prim(graph) {
        const nodes = graph.getNodesList();
        const key = [];
        const p = [];

        const Q = new BinaryHeap((a)=>{
            return key[a];
        },(a)=> a, key);

        nodes.forEach((node)=> {
            key[node] = Infinity;
            p[node] = Infinity;

            Q.push(node);
        });

        //key[nodes[0]] = 0;
        Q.decreaseKey(nodes[0],0);

        const route = [];
        let cost = 0;

        while(Q.size() !== 0) {
            let u = Q.pop();
            if(route.length > 0) {
                cost += graph.distanceBetween(route[route.length - 1],u);
            }
            route.push(u);

            //Siccome il grafo è completo, la lista delle adiacenze
            //di "u" equivale a tutti i nodi tranne "u"
            for(let i=0;i<nodes.length;i++) {
                let v = nodes[i];
                if(v === u) {
                    continue;
                }

                let weight = graph.distanceBetween(v,u);
                if(Q.contains(v) && weight < key[v]) {
                    key[v] = weight;
                    p[v] = u;
                    Q.decreaseKey(v,weight);
                }
            }
        }

        return cost;
    }

    static Kruskal(graph) {
        const set = new UnionByDepth();

        const nodesList = graph.getNodesList();
        const edges = [];

        let A = [];

        for(let i=0;i<nodesList.length;i++) {
            set.makeSet(nodesList[i]);

            for(let j=0; j<nodesList.length; j++) {
                if(nodesList[i] === nodesList[j]) {
                    continue;
                }
                edges.push({
                    from: nodesList[i],
                    to: nodesList[j],
                    w: graph.distanceBetween(nodesList[i],nodesList[j])
                });
            }
        }

        edges.sort( (a, b) => {
            return a.w- b.w;
        });

        for(let i=0;i<nodesList.length;i++) {
            for (let j = 0; j < nodesList.length; j++) {
                const u = nodesList[i];
                const v = nodesList[j];

                if (u === v) {
                    continue;
                }

                if(set.findSet(u) !== set.findSet(v)) {
                    A.push([u,v]);
                    set.union(u,v);
                }
            }
        }
        return A;
    }

};