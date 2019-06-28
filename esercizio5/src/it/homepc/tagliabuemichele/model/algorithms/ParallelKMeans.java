package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.City;
import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.Point;
import it.homepc.tagliabuemichele.utils.ParallelFor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.RecursiveTask;

public class ParallelKMeans extends Algorithm {
    private List<City> cities;
    private List<Cluster> clusters;

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
        clusters = new ArrayList<>();

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

    private Object[] pReduceCluster(int i, int j, int h) {
        if(i == j) {
            if(clusters.get(i).equals(clusters.get(h))) {
                return new Object[] {
                        clusters.get(i).center(),
                        1
                };
            }
            return new Object[] {
                    new Point(0,0),
                    0
            };
        }

        int mid = Math.floorDiv(i+j,2);

        ReduceClusterTask reduceClusterTask = new ReduceClusterTask(i,mid,h);
        reduceClusterTask.fork();

        Object[] results2 = pReduceCluster(mid+1,j,h);
        Object[] results1 = reduceClusterTask.join();

        return new Object[] {
                new Point(
                        ((Point)results1[0]).getLat() + ((Point)results2[0]).getLat(),
                        ((Point)results1[0]).getLng() + ((Point)results2[0]).getLng()
                ),
                ((double)results1[1]) + ((double)results2[1])
        };
    }

    private class ReduceClusterTask extends RecursiveTask<Object[]> {
        private final int i, j, h;

        public ReduceClusterTask(int i, int j, int h) {
            this.i = i;
            this.j = j;
            this.h = h;
        }

        @Override
        protected Object[] compute() {
            return pReduceCluster(i,j,h);
        }
    }
}
