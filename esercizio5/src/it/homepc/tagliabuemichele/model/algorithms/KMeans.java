/**
 * Implementazione seriale di KMeans
 */
package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.City;
import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.Point;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.function.Consumer;

public class KMeans extends Algorithm {
    private List<City> cities;
    private int k, q;

    /**
     * Costruttore
     * @param cities lista di città di cui computare
     *               il cluster
     * @param k numero di cluster richiesti
     * @param q numero di iterazioni
     */
    public KMeans(List<City> cities, int k, int q) {
        super(new ArrayList<>());
        this.cities = new ArrayList<>(cities);
        this.k = k;
        this.q = q;
    }

    /**
     * Avvia il calcolo dell'algoritmo
     * @param iterationCallback callback che, se impostato, viene eseguito ad ogni
     *                          iterazione (serve per la risposta alla domanda 3)
     * @return la lista dei cluster calcolati
     */
    @Override
    public List<Cluster> start(Consumer<IterationData> iterationCallback) {
        this.startTime = System.currentTimeMillis();
        // Ordino l'array in modo decrescente rispetto
        // la popolazione
        Collections.sort(cities, (a, b)->
                b.getPopulation() - a.getPopulation()
        );
        for(int i=0; i<k;i++) {
            centroids.add(cities.get(i));
        }

        List<Cluster> clusters = null;
        for(int i=0;i<q;i++) {
            clusters = KMeans.emptyCluster(k);

            for(int j=0;j<cities.size()-1;j++) {
                int l = findNearestCentroidSerial(cities.get(j),0,centroids.size()-1);
                clusters.get(l).add(cities.get(j));
            }
            for(int f=0;f<k;f++) {
                this.centroids.set(f,clusters.get(f).center());
            }
            if(iterationCallback != null) {
                iterationCallback.accept(new IterationData(
                        i,
                        0,
                        System.currentTimeMillis() - startTime
                ));
            }
        }
        endTime = System.currentTimeMillis();
        return clusters;
    }

    /**
     * Crea i cluster vuoti
     * @param number il numero di cluster vuoti da creare
     * @return i cluster vuoti appena creati
     */
    protected static List<Cluster> emptyCluster(int number) {
        List<Cluster> clusters = new ArrayList<>();
        for(int i=0;i<number;i++) {
            clusters.add(new Cluster());
        }

        return clusters;
    }


}
