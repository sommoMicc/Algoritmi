package it.homepc.tagliabuemichele.model;

import java.util.Objects;

public class City extends Point {
    private int code, population;
    private String name;

    public City(int code, int population, String name, double lat, double lng) {
        super(lat,lng);
        this.code = code;
        this.population = population;
        this.name = name;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public int getPopulation() {
        return population;
    }

    public void setPopulation(int population) {
        this.population = population;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        City city = (City) o;
        return getCode() == city.getCode() &&
                getPopulation() == city.getPopulation() &&
                getName().equals(city.getName());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getCode(), getPopulation(), getName());
    }
}
