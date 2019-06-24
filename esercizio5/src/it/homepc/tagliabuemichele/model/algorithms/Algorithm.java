package it.homepc.tagliabuemichele.model.algorithms;

import it.homepc.tagliabuemichele.model.Cluster;
import it.homepc.tagliabuemichele.model.Point;

import java.util.List;

public abstract class Algorithm {
    protected List<Point> centroids;

    protected Algorithm(List<Point> centroids) {
        this.centroids = centroids;
    }

    public abstract List<Cluster> start();

    private int findNearestCentroid(Point point) {
        double minDist = Double.POSITIVE_INFINITY;
        int l = -1;

        for(int i=0;i<centroids.size();i++) {
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
