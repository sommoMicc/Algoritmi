package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.City;
import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.Point;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class KMeans extends Algorithm {
    private List<City> cities;
    private int k, q;

    /**
     *
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
        for(int i=0;i<q;i++) {
            clusters = KMeans.emptyCluster(k);

            for(int j=0;j<cities.size()-1;j++) {
                int l = findNearestCentroid(cities.get(j));
                clusters.get(l).add(cities.get(j));
            }
            for(int f=0;f<k;f++) {
                this.centroids.set(f,clusters.get(f).center());
            }
        }

        return clusters;
    }

    private int findNearestCentroid(Point point) {
        double minDist = Double.POSITIVE_INFINITY;
        int l = -1;

        for(int i=0;i<centroids.size();i++) {
            double actualDistance =
                point.distance(centroids.get(i));
            if(actualDistance < minDist) {
                minDist = actualDistance;
                l = i;
            }
        }

        return l;
    }

    private static List<Cluster> emptyCluster(int number) {
        List<Cluster> clusters = new ArrayList<>();
        for(int i=0;i<number;i++) {
            clusters.add(new Cluster());
        }

        return clusters;
    }
}
