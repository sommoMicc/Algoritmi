package it.homepc.tagliabuemichele.model.algorithms;

public class IterationData {
    public int iteration;
    public int algorithm;
    public long elapsedTime;

    public IterationData(int iteration, int algorithm, long elapsedTime) {
        this.iteration = iteration;
        this.algorithm = algorithm;
        this.elapsedTime = elapsedTime;
    }
}
