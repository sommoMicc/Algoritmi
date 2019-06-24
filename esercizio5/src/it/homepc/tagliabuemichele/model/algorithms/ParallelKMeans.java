package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.City;
import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.Point;
import it.homepc.tagliabuemichele.utils.ParallelFor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ParallelKMeans extends Algorithm {
    private List<City> cities;

    private int k, q;

    /**
     *
     * @param cities lista di città di cui computare
     *               il cluster
     * @param k numero di cluster richiesti
     * @param q numero di iterazioni
     */
    public ParallelKMeans(List<City> cities, int k, int q) {
        super(new ArrayList<>());
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

        int[] clusterAssignment = new int[cities.size()];

        ParallelFor parallelFor = new ParallelFor(
                0,
                10,
                (i)->{
                    System.out.println("I: "+i);
                }
        );
        parallelFor.start(()->{
            System.out.println("Esecuzione terminata");
        });

        return null;
    }
}
