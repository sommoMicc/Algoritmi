package it.homepc.tagliabuemichele;

import it.homepc.tagliabuemichele.controller.CityController;
import it.homepc.tagliabuemichele.model.City;
import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.algorithms.KMeans;
import it.homepc.tagliabuemichele.model.algorithms.NoobPKMeans;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.List;
import java.util.Locale;

public class Main {
    private static DecimalFormat decimalFormat = new DecimalFormat("0.####E0",
            new DecimalFormatSymbols(Locale.US));

    private static int[] filters = new int[] {
        0, 250, 2000, 5000, 15000, 50000, 100000
    };

    private static boolean DOMANDA_1 = false;
    private static boolean DOMANDA_2 = true;

    private static boolean ESECUZIONE_SERIALE = true;
    private static boolean ESECUZIONE_PARALLELA = true;


    public static void main(String[] args) {
        KMeans kmeans = null;
        NoobPKMeans pkmeans = null;

        List<Cluster> kmeansResult = null;
        List<Cluster> pKmeansResult = null;

        if(DOMANDA_1)
        for(int i=0;i<filters.length;i++) {
            System.out.println("-----------------------------------");
            List<City> cities = CityController
                    .getInstance().readCitiesWithFilter(filters[i]);

            if(ESECUZIONE_SERIALE) {
                kmeans = new KMeans(cities, 50, 100);
                kmeansResult = kmeans.start();

                System.out.println("Distorsione con filtro " + filters[i] + ": " +
                        decimalFormat.format(Cluster.distortion(kmeansResult)) + " in " +
                        kmeans.getElapsedTime() + " secondi");

            }
            if(ESECUZIONE_PARALLELA) {
                pkmeans = new NoobPKMeans(cities, 50, 100);
                pKmeansResult = pkmeans.start();

                System.out.println("Distorsione parallela con filtro " + filters[i] + ": " +
                        decimalFormat.format(Cluster.distortion(pKmeansResult)) + " in " +
                        pkmeans.getElapsedTime() + " secondi");
            }
            if(ESECUZIONE_PARALLELA && ESECUZIONE_SERIALE) {
                double speedup = kmeans.getElapsedTime() * 1.0 / pkmeans.getElapsedTime();
                System.out.println("Speedup: " +speedup);
                System.out.println("Speedup per core: " +speedup /
                    Runtime.getRuntime().availableProcessors());
            }
        }

        if(DOMANDA_2)
        for(int cluster = 10; cluster <= 100; cluster++) {
            System.out.println("-----------------------------------");
            List<City> cities = CityController
                    .getInstance().readCities();


            if(ESECUZIONE_SERIALE) {
                kmeans = new KMeans(cities, cluster, 100);
                kmeansResult = kmeans.start();

                System.out.println("KMeans su "+cluster+" cluster ha concluso in " +
                        kmeans.getElapsedTime() + " secondi");

            }
            if(ESECUZIONE_PARALLELA) {
                pkmeans = new NoobPKMeans(cities, cluster, 100);
                pKmeansResult = pkmeans.start();

                System.out.println("P-KMeans su "+cluster+" cluster ha concluso in " +
                        pkmeans.getElapsedTime() + " secondi");
            }
            if(ESECUZIONE_PARALLELA && ESECUZIONE_SERIALE) {

                if(Cluster.distortion(kmeansResult) != Cluster.distortion(pKmeansResult)) {
                    System.out.println("Attenzione: DISTORSIONI DIVERSE!!!");
                }

                double speedup = kmeans.getElapsedTime() * 1.0 / pkmeans.getElapsedTime();
                System.out.println("Speedup: " +speedup);
                /*System.out.println("Speedup per core: " +speedup /
                        Runtime.getRuntime().availableProcessors());*/
            }
        }

    }
}
