package it.homepc.tagliabuemichele.model;

import java.util.Objects;

public class Point {
    private double lat, lng;

    public Point(double lat, double lng) {
        this.lat = lat;
        this.lng = lng;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }


    public double distance(Point b) {
        return Point.geoDistance(lat,b.lat,lng,b.lng);
    }

    /**
     * Calcola la distanza tra due punti GEO
     * @returns distanza in chilometri tra i due punti
     */
    private static double geoDistance(double lat1, double lat2, double lon1,
                                  double lon2) {

        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            double theta = lon1 - lon2;
            double dist = Math.sin(Math.toRadians(lat1)) * Math.sin(Math.toRadians(lat2)) + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.cos(Math.toRadians(theta));
            dist = Math.acos(dist);
            dist = Math.toDegrees(dist);
            dist = dist * 60 * 1.1515;

            dist = dist * 1.609344; //in KM

            return dist;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Point point = (Point) o;
        return Double.compare(point.getLat(), getLat()) == 0 &&
                Double.compare(point.getLng(), getLng()) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(getLat(), getLng());
    }

    @Override
    public String toString() {
        return "Punto(lat: "+lat+", lng: "+lng+")";
    }
}
