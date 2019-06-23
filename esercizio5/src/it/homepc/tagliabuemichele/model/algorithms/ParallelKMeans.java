package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.City;
import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.Point;

import java.util.Collections;
import java.util.List;

public class ParallelKMeans implements Algorithm {
    private List<City> cities;
    private List<Point> centroids;

    private int k, q;

    /**
     *
     * @param cities lista di città di cui computare
     *               il cluster
     * @param k numero di cluster richiesti
     * @param q numero di iterazioni
     */
    public ParallelKMeans(List<City> cities, int k, int q) {
        this.cities = cities;
        this.k = k;
        this.q = q;
    }

    @Override
    public List<Cluster> start() {
        // Ordino l'array in modo decrescente rispetto
        // la popolazione
        Collections.sort(cities, (a, b)->
                b.getPopulation() - a.getPopulation()
        );
        for(int i=0; i<k;i++) {
            centroids.add(cities.get(i));
        }

        List<Cluster> clusters = null;

        return clusters;
    }
}
