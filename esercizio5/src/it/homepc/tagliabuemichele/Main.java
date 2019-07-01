package it.homepc.tagliabuemichele;

import it.homepc.tagliabuemichele.controller.CityController;
import it.homepc.tagliabuemichele.model.City;
import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.algorithms.*;
import org.knowm.xchart.*;
import org.knowm.xchart.style.Styler;

import java.io.IOException;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.function.Consumer;

public class Main {
    private static DecimalFormat decimalFormat = new DecimalFormat("0.####E0",
            new DecimalFormatSymbols(Locale.US));

    private static int[] filters = new int[] {
        0, 250, 2000, 5000, 15000, 50000, 100000
    };

    private static boolean DOMANDA_1 = true;
    private static boolean DOMANDA_2 = true;
    private static boolean DOMANDA_3 = true;
    private static boolean DOMANDA_4 = true;

    private static boolean ESECUZIONE_SERIALE = true;
    private static boolean ESECUZIONE_PARALLELA = true;

    private static String OUTPUT_DIR = "./risposte/";
    private static int CHART_WIDTH = 800;
    private static int CHART_HEIGHT = 600;

    public static void main(String[] args) throws IOException {
        int optimalCutoffIndex = -1;
        double optimalCutoffTime = Double.POSITIVE_INFINITY;

        if(DOMANDA_4) {
            ESECUZIONE_SERIALE = false;
            ESECUZIONE_PARALLELA = true;

            final XYChart chart = new XYChartBuilder()
                    .width(CHART_WIDTH).height(CHART_HEIGHT)
                    .title("Variazione del tempo - soglia di cutoff")
                    .xAxisTitle("Dimensione minima del sottoproblema")
                    .yAxisTitle("Tempo di esecuzione (in secondi)")
                    .build();

            chart.getStyler().setLegendPosition(Styler.LegendPosition.OutsideE);
            chart.getStyler().setDefaultSeriesRenderStyle(XYSeries.XYSeriesRenderStyle.Line);
            chart.getStyler().setXAxisLogarithmic(true);

            List<Integer> x = new ArrayList<>();
            List<Double> y = new ArrayList<>();

            int clusters = 50;

            int cities = CityController.getInstance().readCities().size();

            for (int cutoff = cities; cutoff >= 1; cutoff/=2) {
                DivideEtImperaPKMeans.cutoff = cutoff;

                double[] executionResults = runClustering(0, clusters, 100, null);
                x.add(cutoff);
                y.add(executionResults[1]);

                if(executionResults[1] < optimalCutoffTime) {
                    optimalCutoffTime = executionResults[1];
                    optimalCutoffIndex = cutoff;
                }
            }
            ParallelAlgorithm.cutoff = optimalCutoffIndex;

            chart.addSeries("Parallelo", x, y);

            BitmapEncoder.saveBitmapWithDPI(chart, OUTPUT_DIR+"risposta_4", BitmapEncoder.BitmapFormat.PNG, 300);
        }

        if(DOMANDA_1) {
            ESECUZIONE_SERIALE = true;
            ESECUZIONE_PARALLELA = true;

            final XYChart chart = new XYChartBuilder()
                    .width(CHART_WIDTH).height(CHART_HEIGHT)
                    .title("Variazione del tempo - numero di punti")
                    .xAxisTitle("Numero di punti")
                    .yAxisTitle("Tempo di esecuzione (in secondi)")
                    .build();

            chart.getStyler().setLegendPosition(Styler.LegendPosition.OutsideE);
            chart.getStyler().setDefaultSeriesRenderStyle(XYSeries.XYSeriesRenderStyle.Line);

            double[] x = new double[filters.length];
            double[] serialY = new double[filters.length];
            double[] parallelY = new double[filters.length];

            for (int i = 0; i < filters.length; i++) {
                double[] executionResults = runClustering(filters[i], 50, 100, null);

                x[i] = executionResults[2];
                serialY[i] = executionResults[0];
                parallelY[i] = executionResults[1];
            }

            chart.addSeries("Seriale", x, serialY);
            chart.addSeries("Parallelo", x, parallelY);

            BitmapEncoder.saveBitmapWithDPI(chart, OUTPUT_DIR+"risposta_1", BitmapEncoder.BitmapFormat.PNG, 300);
        }

        if(DOMANDA_2) {
            final XYChart chart = new XYChartBuilder()
                    .width(CHART_WIDTH).height(CHART_HEIGHT)
                    .title("Variazione del tempo - numero di cluster")
                    .xAxisTitle("Numero di cluster")
                    .yAxisTitle("Tempo di esecuzione (in secondi)")
                    .build();

            chart.getStyler().setLegendPosition(Styler.LegendPosition.OutsideE);
            chart.getStyler().setDefaultSeriesRenderStyle(XYSeries.XYSeriesRenderStyle.Line);

            int minClusters = 10;
            int maxClusters = 100;

            int granularity = 5;

            double[] x = new double[((maxClusters-minClusters)/granularity)+1];
            double[] serialY = new double[x.length];
            double[] parallelY = new double[x.length];

            for (int i = minClusters; i <= maxClusters; i+=granularity) {
                double[] executionResults = runClustering(0, i, 100, null);

                int index  = (i-minClusters)/granularity;
                x[index] = i;
                serialY[index] = executionResults[0];
                parallelY[index] = executionResults[1];
            }

            chart.addSeries("Seriale", x, serialY);
            chart.addSeries("Parallelo", x, parallelY);

            BitmapEncoder.saveBitmapWithDPI(chart, OUTPUT_DIR+"risposta_2", BitmapEncoder.BitmapFormat.PNG, 300);

        }

        if(DOMANDA_3) {
            final XYChart chart = new XYChartBuilder()
                    .width(CHART_WIDTH).height(CHART_HEIGHT)
                    .title("Variazione del tempo - numero di iterazioni")
                    .xAxisTitle("Numero di iterazioni")
                    .yAxisTitle("Tempo di esecuzione (in secondi)")
                    .build();

            chart.getStyler().setLegendPosition(Styler.LegendPosition.OutsideE);
            chart.getStyler().setDefaultSeriesRenderStyle(XYSeries.XYSeriesRenderStyle.Line);

            int iterationNumber = 1000;
            int controlFloor = 10;

            int totalIterations = iterationNumber - controlFloor + 1;

            double[] x = new double[totalIterations];
            double[] serialY = new double[x.length];
            double[] parallelY = new double[x.length];

            runClustering(0, 50, iterationNumber, (id)->{
                int iteration = id.iteration;
                int index = iteration-controlFloor +1;

                if(index >=0) {
                    switch (id.algorithm) {
                        case 0:
                            serialY[index] = id.elapsedTime;
                            break;
                        case 1:
                            parallelY[index] = id.elapsedTime;
                    }
                    x[index] = iteration + 1;
                }
            });

            chart.addSeries("Seriale", x, serialY);
            chart.addSeries("Parallelo", x, parallelY);

            BitmapEncoder.saveBitmapWithDPI(chart, OUTPUT_DIR+"risposta_3", BitmapEncoder.BitmapFormat.PNG, 300);
        }
    }

    private static double[] runClustering(
            int filter,int k, int q,
            Consumer<IterationData> callback) {
        double[] results = new double[3];

        KMeans kmeans = null;
        ParallelAlgorithm pkmeans = null;


        List<Cluster> kmeansResult = null;
        List<Cluster> pKmeansResult = null;

        List<City> cities = CityController
                .getInstance().readCitiesWithFilter(filter);

        System.out.println("-----------------------------------");

        if(ESECUZIONE_SERIALE) {
            kmeans = new KMeans(cities, k, q);
            kmeansResult = kmeans.start(callback);

            System.out.println("KMeans  k="+k+", q="+q+", filtro="+filter+", ha concluso in " +
                    kmeans.getElapsedTime() + " secondi");

            results[0] = kmeans.getElapsedTime();

        }
        if(ESECUZIONE_PARALLELA) {
            pkmeans = new DivideEtImperaPKMeans(cities, k, q);
            pKmeansResult = pkmeans.start(callback);

            System.out.println("P-KMeans k="+k+", q="+q+", filtro="+filter+", " +
                    "cutoff="+ DivideEtImperaPKMeans.cutoff+" ha concluso in " +
                    pkmeans.getElapsedTime() + " secondi");

            results[1] = pkmeans.getElapsedTime();

            double parallelDistortion = Cluster.distortion(pKmeansResult);
                System.out.println("Distorsione parallela: "+parallelDistortion);

            }
        if(ESECUZIONE_PARALLELA && ESECUZIONE_SERIALE) {
            /*
            double serialDistortion = Cluster.distortion(kmeansResult);
            double parallelDistortion = Cluster.distortion(pKmeansResult);
            if(serialDistortion != parallelDistortion) {
                System.out.println("Attenzione: DISTORSIONI DIVERSE!!!");
                System.out.println("Seriale: "+serialDistortion+", parallela: "+parallelDistortion);
            }
             */

            double speedup = kmeans.getElapsedTime() * 1.0 / pkmeans.getElapsedTime();
            System.out.println("Speedup: " +speedup);
        }

        results[2] = cities.size();
        return results;
    }

}
