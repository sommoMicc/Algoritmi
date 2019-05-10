
module.exports = class NearestNeighbour {
    /**
     * Istanzio il risolutore del TSP con l'euristica Nearest Neightbour
     * @param {GeoGraph}graph il grafo a cui applicare l'euristica
     */
    constructor(graph) {
        this.graph = graph;
        this.unvisitedNodes = graph.getNodesList();

        this.pathLenght = 0;
        this.path = [];
    }

    /**
     * Avvia l'algoritmo
     * @returns {number} la soluzione TSP
     */
    start() {
        //Inserisco il primo nodo (nodo 0) nel percorso, come punto di partenza
        let currentVertex = this.unvisitedNodes[0];

        this.path.push(currentVertex);

        //Segno il primo nodo come visitato
        this.unvisitedNodes.reverse().pop();
        this.unvisitedNodes.reverse();

        //Itero finché non ho visitato tutti i nodi
        while(this.unvisitedNodes.length > 0) {
            let minDist = Infinity;
            let predecessorIndex = null;

            for(let i=0;i<this.unvisitedNodes.length;i++) {
                if(this.unvisitedNodes[i] === currentVertex)
                    continue;
                //Itero su tutti i nodi ancora da visitare
                let distance = this.graph.distanceBetween(this.unvisitedNodes[i],currentVertex);
                if(distance < minDist) {
                    minDist = distance;
                    predecessorIndex = i;
                }
            }

            //Nell'ultima iterazione, predecessor index è null
            if(predecessorIndex != null) {
                currentVertex = this.unvisitedNodes[predecessorIndex];
                this.path.push(currentVertex);
                this.pathLenght += minDist;
            }
            this.unvisitedNodes[predecessorIndex] = this.unvisitedNodes[this.unvisitedNodes.length - 1];
            this.unvisitedNodes.pop();
        }
        this.pathLenght += this.graph.distanceBetween(this.path[0],this.path[this.path.length -1]);
        return this.pathLenght;
    }
};