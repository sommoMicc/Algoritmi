package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.Point;

import java.util.List;
import java.util.concurrent.RecursiveTask;
import java.util.function.Consumer;

public abstract class ParallelAlgorithm extends Algorithm {
    public static int cutoff = 149;

    protected ParallelAlgorithm(List<Point> centroids) {
        super(centroids);
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

    protected int findNearestCentroidParallel(Point point, int start, int end) {
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
        if(end-start < cutoff) {
            return findNearestCentroidSerial(point,start,end);
        }

        //Caso ricorsivo: più di due elementi
        int m = Math.floorDiv(start+end,2);

        NearestCentroidTask multithreadTask = new NearestCentroidTask(point,start,m);
        multithreadTask.fork();


        int recursiveResult = findNearestCentroidParallel(point,m+1,end);
        int multithreadResult = multithreadTask.join();
        //int multithreadResult = findNearestCentroidParallel(point,start,m);

        if(point.distance(centroids.get(recursiveResult)) < point.distance(centroids.get(multithreadResult)))
            return recursiveResult;
        return multithreadResult;
    }

}
