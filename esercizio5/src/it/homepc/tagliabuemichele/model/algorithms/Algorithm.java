/**
 * Classe base astratta che definisce le caratteristiche di
 * un algoritmo di clustering e contiene campi e metodi di interesse
 * comune alle varie implementazioni concrete
 */
package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.Point;

import java.util.List;
import java.util.function.Consumer;


public abstract class Algorithm {
    protected List<Point> centroids;
    protected long startTime, endTime;

    /**
     * Costruttore
     * @param centroids i centroidi con cui inizializzare l'algoritmo
     */
    protected Algorithm(List<Point> centroids) {
        this.centroids = centroids;
    }

    /**
     * Avvia l'esecuzione dell'algoritmo
     * @param iterationCallback callback che, se impostato, viene eseguito ad ogni
     *                          iterazione (serve per la risposta alla domanda 3)
     * @return lista contenente i cluster calcolati dall'algoritmo
     */
    public abstract List<Cluster> start(Consumer<IterationData> iterationCallback);

    /**
     * Calcola il tempo di esecuzione dell'algoritmo, in secondi
     * @return tempo di esecuzione
     */
    public double getElapsedTime() {
        return Math.round((endTime-startTime)/ 10.0) / 100.0;
    }

    /**
     * Cerca l'indice del centroide più vicino al punto passato come parametro,
     * rispettando i bound start ed end
     * @param point punto del quale cercare il centroide più vicino
     * @param start indice della lista di centroidi da cui partire per la ricerca
     * @param end indice di arrivo relativo alla lista dei centroidi
     * @return l'indice del centroide più vicino a point
     */
    protected int findNearestCentroidSerial(Point point, int start, int end) {
        double minDist = Double.POSITIVE_INFINITY;
        int l = -1;

        for(int i=start;i<=end;i++) {
            double actualDistance =
                    point.distance(centroids.get(i));
            if(actualDistance < minDist) {
                minDist = actualDistance;
                l = i;
            }
        }

        return l;
    }


}
