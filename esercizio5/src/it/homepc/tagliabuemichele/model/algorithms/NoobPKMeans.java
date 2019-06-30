package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.City;
import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.Point;
import it.homepc.tagliabuemichele.utils.ParallelFor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.RecursiveTask;

public class NoobPKMeans extends Algorithm {
    private List<City> cities;
    private int k, q;

    public static int CUTOFF = 2;
    /**
     *
     * @param cities lista di città di cui computare
     *               il cluster
     * @param k numero di cluster richiesti
     * @param q numero di iterazioni
     */
    public NoobPKMeans(List<City> cities, int k, int q) {
        super(new ArrayList<>());
        this.cities = new ArrayList<>(cities);
        this.k = k;
        this.q = q;
    }

    @Override
    public List<Cluster> start() {
        this.startTime = System.currentTimeMillis();
        // Ordino l'array in modo decrescente rispetto
        // la popolazione
        Collections.sort(cities, (a, b)->
                b.getPopulation() - a.getPopulation()
        );
        for(int i=0; i<k;i++) {
            centroids.add(cities.get(i));
        }

        List<Cluster> clusters = NoobPKMeans.emptyCluster(k);
        for(int i=0;i<q;i++) {
            List<Cluster> privateClusters = NoobPKMeans.emptyCluster(k);

            ParallelFor pf = new ParallelFor(0,cities.size()-1,(j)->{
                //int l = new NearestCentroidTask(cities.get(j),0,centroids.size()-1).compute();
                //int l = findNearestCentroidSerial(cities.get(j),0,centroids.size()-1);
                int l = findNearestCentroidParallel(cities.get(j),0,centroids.size()-1);

                //privateClusters.get(l).add(cities.get(j));
                updateCluster(privateClusters,l,j);
            });
            pf.fork();
            pf.join();

            pf = new ParallelFor(0,k,(f)->{
                this.centroids.set(f,privateClusters.get(f).center());
            });

            pf.fork();
            pf.join();

            clusters = privateClusters;
        }

        endTime = System.currentTimeMillis();
        return clusters;
    }

    private synchronized void updateCluster(List<Cluster> listToUpdate,int l, int j) {
        listToUpdate.get(l).add(cities.get(j));
    }



    protected static List<Cluster> emptyCluster(int number) {
        Cluster[] clusters = new Cluster[number];
        ParallelFor pf = new ParallelFor(0,number,(i)->clusters[i]=new Cluster());
        pf.fork();
        pf.join();

        return Arrays.asList(clusters);
    }


    private class NearestCentroidTask extends RecursiveTask<Integer> {
        private final Point point;
        private final int start, end;

        public NearestCentroidTask(Point point, int start, int end) {
            this.point = point;
            this.start = start;
            this.end = Math.min(end,centroids.size() - 1);
        }

        @Override
        public Integer compute() {
            return findNearestCentroidParallel(point,start,end);
        }
    }

    private int findNearestCentroidParallel(Point point, int start, int end) {
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
        if(end-start < CUTOFF) {
            return findNearestCentroidSerial(point,start,end);
        }

        //Caso ricorsivo: più di due elementi
        int m = Math.floorDiv(start+end,2);

        //NearestCentroidTask multithreadTask = new NearestCentroidTask(point,start,m);
        //multithreadTask.fork();


        int recursiveResult = findNearestCentroidParallel(point,m+1,end);
        //int multithreadResult = multithreadTask.join();
        int multithreadResult = findNearestCentroidParallel(point,start,m);

        if(point.distance(centroids.get(recursiveResult)) < point.distance(centroids.get(multithreadResult)))
            return recursiveResult;
        return multithreadResult;
    }


}
