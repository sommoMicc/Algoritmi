package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.Point;

import java.util.List;
import java.util.function.Consumer;

public abstract class Algorithm {
    protected List<Point> centroids;
    protected long startTime, endTime;

    protected Algorithm(List<Point> centroids) {
        this.centroids = centroids;
    }
    public abstract List<Cluster> start(Consumer<IterationData> iterationCallback);

    public double getElapsedTime() {
        return Math.round((endTime-startTime)/ 10.0) / 100.0;
    }

    protected int findNearestCentroidSerial(Point point, int start, int end) {
        double minDist = Double.POSITIVE_INFINITY;
        int l = -1;

        for(int i=start;i<=end;i++) {
            double actualDistance =
                    point.distance(centroids.get(i));
            if(actualDistance < minDist) {
                minDist = actualDistance;
                l = i;
            }
        }

        return l;
    }


}
