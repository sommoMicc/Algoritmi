package it.homepc.tagliabuemichele.model.algorithms;

public class IterationData {
    public int iteration;
    public int algorithm;
    public double elapsedTime;

    public IterationData(int iteration, int algorithm, double elapsedTime) {
        this.iteration = iteration;
        this.algorithm = algorithm;
        this.elapsedTime = elapsedTime;
    }
}
