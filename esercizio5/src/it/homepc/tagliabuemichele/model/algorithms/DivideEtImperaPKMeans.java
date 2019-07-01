/**
 * Implementa l'algoritmo KMeans utilizzando una tecnica divide-et-impera
 * multithread (parallela)
 */
package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.City;
import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.utils.ParallelFor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.RecursiveTask;
import java.util.function.Consumer;

public class DivideEtImperaPKMeans extends ParallelAlgorithm {
    private List<City> cities;
    private int k, q;
    /**
     * Costruttore
     * @param cities lista di città di cui computare
     *               il cluster
     * @param k numero di cluster richiesti
     * @param q numero di iterazioni
     */
    public DivideEtImperaPKMeans(List<City> cities, int k, int q) {
        super(new ArrayList<>());
        this.cities = new ArrayList<>(cities);
        this.k = k;
        this.q = q;
    }

    /**
     * Avvia l'algoritmo
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
        //Inizializzo i k centroidi con le città più popolate
        //Non ho implementato divide-et-impera poiché il tempo di
        //esecuzione di questo blocco di codice è trascurabile
        //(nella mia macchina meno di 1ms)
        for(int i=0; i<k;i++) {
            centroids.add(cities.get(i));
        }

        List<Cluster> clusters = null;
        for(int i=0;i<q;i++) {
            clusters = DivideEtImperaPKMeans.emptyCluster(k);

            int start = 0;
            int end = cities.size() -1;

            //Assegno i punti ai centroidi (con divide et impera)
            KMeansTask kMeansTask = new KMeansTask(clusters,start,end);
            kMeansTask.fork();
            kMeansTask.join();

            //Aggiorno i centroidi dei relativi cluster (con divide et impera)
            UpdateCentroidsTask updateCentroids = new UpdateCentroidsTask(clusters,0,k-1);

            updateCentroids.fork();
            updateCentroids.join();

            //Serve per la domanda 3
            if(iterationCallback != null) {
                iterationCallback.accept(new IterationData(
                    i,
                    1,
                    Math.round((System.currentTimeMillis() - startTime)/ 10.0) / 100.0
                ));
            }
        }

        endTime = System.currentTimeMillis();
        return clusters;
    }

    /**
     * Classe che implementa l'assegnazione dei punti ai cluster
     * con divide-et-impera parallelo
     */
    private class KMeansTask extends RecursiveTask<Void> {
        private final int start, end;
        private final List<Cluster> privateClusters;

        /**
         *
         * @param clusters lista di cluster a cui assegnare le città
         * @param start indice della lista di città da cui partire per l'assegnazione
         * @param end indice di arrivo relativo alla lista di città
         */
        public KMeansTask(List<Cluster> clusters, int start, int end) {
            this.start = start;
            this.end = end;
            this.privateClusters = clusters;
        }

        /**
         * Assegnazione divide-et-impera dei punti ai cluster
         * @return null
         */
        @Override
        public Void compute() {
            //Se la dimensione del problema è minore o uguale alla
            //soglia di cutoff, procedo al calcolo seriale
            if(end-start+1 <= cutoff) {
                kMeansBody(privateClusters, start, end);
            }
            else {
                //Divide et impera
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

    /**
     * Assegna in modo seriale a un sottoinsieme delle città (delimitato da start ed end)
     * i cluster più vicini
     * @param clusters
     * @param start
     * @param end
     * @return
     */
    private List<Cluster> kMeansBody(List<Cluster> clusters, int start, int end) {
        for (int j = start; j <= end; j++) {
            int l = findNearestCentroidParallel(cities.get(j), 0, centroids.size() - 1);
            updateCluster(clusters, l, j);
        }
        return clusters;
    }

    /**
     * Assegna ad un cluster una città in modo synchronized, ovvero thread-safe, ovvero
     * con accesso seriale
     * @param listToUpdate la lista di cluster da aggiornare
     * @param l l'indice del cluster a cui assegnare la città
     * @param j l'indice della città da assegnare al cluster
     */
    private synchronized void updateCluster(List<Cluster> listToUpdate, int l, int j) {
        listToUpdate.get(l).add(cities.get(j));
    }

    /**
     * Crea una lista di cluster vuoti in modo parallelo
     * @param number il numero di cluster da creare
     * @return la lista di cluster vuoti creati
     */
    protected static List<Cluster> emptyCluster(int number) {
        Cluster[] clusters = new Cluster[number];
        ParallelFor pf = new ParallelFor(0,number,(i)->clusters[i]=new Cluster());
        pf.fork();
        pf.join();

        return Arrays.asList(clusters);
    }

    /**
     * Classe che permette di aggiornare i centroidi dei relativi cluster
     * in modo divide-et-impera
     */
    private class UpdateCentroidsTask extends RecursiveTask<Void> {
        private final int start, end;
        private final List<Cluster> privateClusters;

        /**
         * Costruttore
         * @param clusters la lista di cluster da aggiornare
         * @param start indice di "clusters" di partenza per l'aggiornamento
         * @param end indice di "clusters" di arrivo per l'aggiornamento
         */
        public UpdateCentroidsTask(List<Cluster> clusters, int start, int end) {
            this.start = start;
            this.end = end;
            this.privateClusters = clusters;
        }

        /**
         * Calcolo e aggiornamento dei nuovi centrodi con divide-et-impera,
         * tenendo conto della soglia di cutoff
         * @return null
         */
        @Override
        public Void compute() {
            //Soglia di cutoff
            if(end-start+1 <= cutoff) {
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

    /**
     * Aggiorna in modo seriale i centroidi del sottoinsieme di cluster delimitato da
     * start ed end
     * @param clusters lista di cluster contenente il sottoinsieme da aggiornare
     * @param start indice di partenza
     * @param end indice di arrivo
     */
    private void updateCentroidsBody(List<Cluster> clusters, int start, int end) {
        for(int i=start;i<=end; i++) {
            this.centroids.set(i,clusters.get(i).center());
        }
    }
}
