package it.homepc.tagliabuemichele.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.Callable;

public class FileHelper {
    private static FileHelper INSTANCE = null;
    private FileHelper() {}
    public static FileHelper getInstance() {
        if(FileHelper.INSTANCE == null)
            INSTANCE = new FileHelper();

        return INSTANCE;
    }


    private static String FILE_PATH = "./assets/cities-and-towns-of-usa.csv";

    public void load(RowListener rowListener) {
        Path pathToFile = Paths.get(FILE_PATH);
        // create an instance of BufferedReader
        // using try with resource, Java 7 feature to close resources
        try (BufferedReader br = Files.newBufferedReader(pathToFile,
                StandardCharsets.US_ASCII)) {

            // Skip the first row (header)
            br.readLine();
            // read the first line from the text file
            String line = br.readLine();


            // loop until all lines are read
            while (line != null) {

                // use string.split to load a string array with the values from
                // each line of
                // the file, using a comma as the delimiter
                rowListener.rowRed(line);
                // read next line before looping
                // if end of file reached, line would be null
                line = br.readLine();
            }

        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }
}

interface RowListener {
    void rowRed(String rowContent);
}
