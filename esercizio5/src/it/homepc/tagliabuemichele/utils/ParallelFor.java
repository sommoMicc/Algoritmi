package it.homepc.tagliabuemichele.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.RecursiveTask;
import java.util.function.Consumer;

public class ParallelFor extends RecursiveTask<Void> {
    private final int initialization;
    private int counter;
    private final int ceiling;
    private Consumer<Integer> function;

    public ParallelFor(int initialization, int ceiling, Consumer<Integer> function) {
        this.initialization = initialization;
        this.ceiling = ceiling;
        this.function = function;

    }

    protected Void compute() {
        List<ParallelForTask> tasksList = new ArrayList<>();

        for(counter = initialization;counter<ceiling;counter++) {
            ParallelForTask t = new ParallelForTask(counter);
            tasksList.add(t);
            t.fork();
        }

        for(int i=0;i<tasksList.size();i++) {
            tasksList.get(i).join();
        }

        return null;
    }


    private class ParallelForTask extends RecursiveTask<Void> {
        private int counterValue;

        public ParallelForTask(int counterValue) {
            this.counterValue = counterValue;
        }

        @Override
        protected Void compute() {
            function.accept(counterValue);
            return null;
        }
    }
}
