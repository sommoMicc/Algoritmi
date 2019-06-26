package it.homepc.tagliabuemichele.controller;


import it.homepc.tagliabuemichele.model.City;

import java.util.ArrayList;
import java.util.List;

public class CityController {
    private static CityController INSTANCE;
    public static CityController getInstance() {
        if(INSTANCE == null)
            INSTANCE = new CityController();
        return INSTANCE;
    }

    private FileHelper fileHelper;
    private CityController() {
        fileHelper = FileHelper.getInstance();
    }

    public List<City> readCitiesWithFilter(int filter) {
        List<City> cities = new ArrayList<>();
        FileHelper.getInstance().load((String row) -> {
            String[] cells = row.split(",");
            City cityRead = new City(
                Integer.parseInt(cells[0]),
                Integer.parseInt(cells[2]),
                cells[1],
                Double.parseDouble(cells[3]),
                Double.parseDouble(cells[4])
            );
            if(cityRead.getPopulation() > filter)
                cities.add(cityRead);
        });
        return cities;
    }

    public List<City> readCities() {
        return readCitiesWithFilter(0);
    }

}
