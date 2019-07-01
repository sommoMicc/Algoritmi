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
import java.util.function.Consumer;

public class DIvideEtImperaPKMeans extends ParallelAlgorithm {
    private List<City> cities;
    private int k, q;

    public static int CUTOFF = 26;
    /**
     *
     * @param cities lista di città di cui computare
     *               il cluster
     * @param k numero di cluster richiesti
     * @param q numero di iterazioni
     */
    public DIvideEtImperaPKMeans(List<City> cities, int k, int q) {
        super(new ArrayList<>());
        this.cities = new ArrayList<>(cities);
        this.k = k;
        this.q = q;
    }

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

        List<Cluster> clusters = DIvideEtImperaPKMeans.emptyCluster(k);
        for(int i=0;i<q;i++) {
            int start = 0;
            int end = cities.size() -1;

            KMeansTask kMeansTask = new KMeansTask(clusters,start,end);
            kMeansTask.fork();
            kMeansTask.join();

            UpdateCentroidsTask updateCentroids = new UpdateCentroidsTask(clusters,0,k);

            updateCentroids.fork();
            updateCentroids.join();

            if(iterationCallback != null) {
                iterationCallback.accept(new IterationData(
                    i,
                    1,
                    System.currentTimeMillis() - startTime
                ));
            }
        }

        endTime = System.currentTimeMillis();
        return clusters;
    }

    private class KMeansTask extends RecursiveTask<Void> {
        private final int start, end;
        private final List<Cluster> privateClusters;

        public KMeansTask(List<Cluster> clusters, int start, int end) {
            this.start = start;
            this.end = end;
            this.privateClusters = clusters;
        }

        @Override
        public Void compute() {
            if(end-start+1 <= CUTOFF) {
                kMeansBody(privateClusters, start, end);
            }
            else {

                int m = Math.floorDiv(end + start, 2);

                KMeansTask kMeansTask1 = new KMeansTask(privateClusters, start, m);
                kMeansTask1.fork();
                KMeansTask kMeansTask2 = new KMeansTask(privateClusters, m + 1, end);
                kMeansTask2.fork();

                kMeansTask1.join();
                kMeansTask2.join();
            }
            return null;
        }
    }

    private List<Cluster> kMeansBody(List<Cluster> clusters, int start, int end) {
        for (int j = start; j <= end; j++) {
            int l = findNearestCentroidParallel(cities.get(j), 0, centroids.size() - 1);
            updateCluster(clusters, l, j);
        }
        return clusters;
    }

    private synchronized void updateCluster(List<Cluster> listToUpdate, int l, int j) {
        listToUpdate.get(l).add(cities.get(j));
    }

    protected static List<Cluster> emptyCluster(int number) {
        Cluster[] clusters = new Cluster[number];
        ParallelFor pf = new ParallelFor(0,number,(i)->clusters[i]=new Cluster());
        pf.fork();
        pf.join();

        return Arrays.asList(clusters);
    }


    private class UpdateCentroidsTask extends RecursiveTask<Void> {
        private final int start, end;
        private final List<Cluster> privateClusters;

        public UpdateCentroidsTask(List<Cluster> clusters, int start, int end) {
            this.start = start;
            this.end = end;
            this.privateClusters = clusters;
        }

        @Override
        public Void compute() {
            if(end-start+1 <= CUTOFF) {
                updateCentroidsBody(privateClusters, start, end);
            }
            else {

                int m = Math.floorDiv(end + start, 2);

                UpdateCentroidsTask task1 = new UpdateCentroidsTask(privateClusters, start, m);
                task1.fork();
                UpdateCentroidsTask task2 = new UpdateCentroidsTask(privateClusters, m + 1, end);
                task2.fork();

                task1.join();
                task2.join();
            }
            return null;
        }
    }

    private void updateCentroidsBody(List<Cluster> clusters, int start, int end) {
        for(int i=start;i<end; i++) {
            this.centroids.set(i,clusters.get(i).center());
        }
    }
}
