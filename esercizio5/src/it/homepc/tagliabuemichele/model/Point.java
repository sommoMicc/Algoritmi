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
        return Math.sqrt((Math.pow((lat - b.lat),2)) + (Math.pow((lng - b.lng),2)));

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
