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

    private static boolean ESECUZIONE_SERIALE = true;
    private static boolean ESECUZIONE_PARALLELA = true;


    public static void main(String[] args) {

        for(int i=0;i<filters.length;i++) {
            System.out.println("-----------------------------------");
            List<City> cities = CityController
                    .getInstance().readCitiesWithFilter(filters[i]);

            KMeans kmeans = null;
            NoobPKMeans pkmeans = null;

            if(ESECUZIONE_SERIALE) {
                kmeans = new KMeans(cities, 50, 100);
                List<Cluster> kmeansResult = kmeans.start();

                System.out.println("Distorsione con filtro " + filters[i] + ": " +
                        decimalFormat.format(Cluster.distortion(kmeansResult)) + " in " +
                        kmeans.getElapsedTime() + " secondi");

            }
            if(ESECUZIONE_PARALLELA) {
                pkmeans = new NoobPKMeans(cities, 50, 100);
                List<Cluster> pKmeansResult = pkmeans.start();

                System.out.println("Distorsione parallela con filtro " + filters[i] + ": " +
                        decimalFormat.format(Cluster.distortion(pKmeansResult)) + " in " +
                        pkmeans.getElapsedTime() + " secondi");
            }
            if(ESECUZIONE_PARALLELA && ESECUZIONE_SERIALE)
                System.out.println("Speedup: "+kmeans.getElapsedTime()*1.0/pkmeans.getElapsedTime());
        }


    }
}
