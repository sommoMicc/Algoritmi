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

public class NoobPKMeans extends ParallelAlgorithm {
    private List<City> cities;
    private int k, q;
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
}
