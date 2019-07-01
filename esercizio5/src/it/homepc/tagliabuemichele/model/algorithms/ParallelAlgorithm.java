/**
 * Classe astratta che definisce le caratteristiche di un
 * algoritmo parallelo, realizzata per permettere facilmente di
 * implementare più tipi di parallelismo (per fare qualche prova)
 */
package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.Point;

import java.util.List;
import java.util.concurrent.RecursiveTask;

public abstract class ParallelAlgorithm extends Algorithm {
    public static int cutoff = 149;

    /**
     * Costrtuttore
     * @param centroids lista di centroidi da cui iniziare
     */
    protected ParallelAlgorithm(List<Point> centroids) {
        super(centroids);
    }

    /**
     * Il codice che segue corrisponde all'implementazione parallela di
     * "findNearestCentroidSerial". La classe NearestCentroid implementa
     * la classe RecursiveTask, permettendo così di utilizzare fork/join
     */
    private class NearestCentroidTask extends RecursiveTask<Integer> {
        private final Point point;
        private final int start, end;

        /**
         * Costruttore del task parallelo
         * @param point punto del quale cercare il centroide più vicino
         * @param start indice della lista di centroidi da cui partire per la ricerca
         * @param end indice di arrivo relativo alla lista dei centroidi
         */
        public NearestCentroidTask(Point point, int start, int end) {
            this.point = point;
            this.start = start;
            this.end = Math.min(end,centroids.size() - 1);
        }

        /**
         * Avvia il calcolo dell'algoritmo
         * @return l'indice del centroide più vicino al punto "point"
         */
        @Override
        public Integer compute() {
            return findNearestCentroidParallel(point,start,end);
        }
    }

    /**
     * Implementa la ricerca del centroide più vicino ad un punto con una
     * strategia divide-et-impera parallela, tenendo conto della soglia globale
     * di cutoff
     * @param point punto del quale cercare il centroide più vicino
     * @param start indice della lista di centroidi da cui partire per la ricerca
     * @param end indice di arrivo relativo alla lista dei centroidi
     * @return l'indice del centroide più vicino al punto "point"
     */
    protected int findNearestCentroidParallel(Point point, int start, int end) {
        //Caso base: unico elemento
        if(end-start == 0)
            return start;


        //Caso base: due elementi
        if(end == start + 1) {
            if(point.distance(centroids.get(start)) < point.distance(centroids.get(end))) {
                return start;
            }
            return end;
        }

        //Caso base: elementi minori della soglia di cutoff
        if(end-start < cutoff) {
            return findNearestCentroidSerial(point,start,end);
        }

        //Caso ricorsivo: sopra la soglia di cutoff
        int m = Math.floorDiv(start+end,2);

        //Invocazione multithread (spawn)
        NearestCentroidTask multithreadTask = new NearestCentroidTask(point,start,m);
        multithreadTask.fork();


        int recursiveResult = findNearestCentroidParallel(point,m+1,end);
        //Recupero dei risultati asincroni (sync)
        int multithreadResult = multithreadTask.join();

        if(point.distance(centroids.get(recursiveResult)) < point.distance(centroids.get(multithreadResult)))
            return recursiveResult;
        return multithreadResult;
    }

}
