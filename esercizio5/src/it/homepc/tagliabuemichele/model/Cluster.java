package it.homepc.tagliabuemichele.model;

import java.util.ArrayList;
import java.util.List;

public class Cluster {
    private List<City> points;
    private Point center;

    public Cluster() {
        points = new ArrayList<>();
        center = null;
    }

    public Point center() {
        if(this.center != null)
            return this.center;

        int size = this.points.size();
        if(size < 1)
            return new Point(Double.POSITIVE_INFINITY,
                Double.POSITIVE_INFINITY);

        double sumLat = 0;
        double sumLng = 0;

        for(int i=0;i<size;i++) {
            sumLat+=points.get(i).getLat();
            sumLng+=points.get(i).getLng();
        }

        center = new Point(sumLat/size, sumLng/size);
        return center;
    }

    public double error() {
        double totalError = 0;

        for(int i=0;i<points.size();i++) {
            City city = points.get(i);
            double delta = city.distance(center());
            totalError += city.getPopulation() * Math.pow(delta,2);
        }

        return totalError;
    }

    public double distance(Cluster other) {
        return other.center().distance(this.center());
    }

    public void add(City point) {
        points.add(point);
    }

    @Override
    public String toString() {
        return "Cluster(centro: "+center()+", size: "+points.size()+")";
    }

    public static double distortion(List<Cluster> clusters) {
        double totalDistortion = 0;
        for(int i=0;i<clusters.size();i++) {
            totalDistortion += clusters.get(i).error();
        }
        return totalDistortion;
    }
}
