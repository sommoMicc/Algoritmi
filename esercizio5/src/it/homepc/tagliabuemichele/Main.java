package it.homepc.tagliabuemichele;

import it.homepc.tagliabuemichele.controller.CityController;
import it.homepc.tagliabuemichele.model.City;
import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.algorithms.KMeans;
import it.homepc.tagliabuemichele.model.algorithms.ParallelKMeans;

import java.util.List;

public class Main {

    public static void main(String[] args) {
	// write your code here
        List<City> cities = CityController
            .getInstance().readCities();

        /*
        KMeans kmeans = new KMeans(cities,50,100);
        List<Cluster> kmeansResult = kmeans.start();

        System.out.println("KMeans ha ritornato "+kmeansResult.size()+" cluster");
        for(int i=0;i<kmeansResult.size();i++) {
            System.out.println(kmeansResult.get(i));
        }
         */

        ParallelKMeans parallelKMeans = new ParallelKMeans(cities,50,100);
        parallelKMeans.start();
    }
}
