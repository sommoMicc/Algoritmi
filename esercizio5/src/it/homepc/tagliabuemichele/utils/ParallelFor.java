package it.homepc.tagliabuemichele.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.RecursiveTask;
import java.util.function.Consumer;

public class ParallelFor {
    private final int initialization;
    private int counter;
    private final int ceiling;
    private Consumer<Integer> function;

    public ParallelFor(int initialization, int ceiling, Consumer<Integer> function) {
        this.initialization = initialization;
        this.ceiling = ceiling;
        this.function = function;

    }

    public void start(Runnable then) {
        List<ParallelForTask> tasksList = new ArrayList<>();

        for(counter = initialization;counter<ceiling;counter++) {
            ParallelForTask t = new ParallelForTask(counter);
            t.fork();
            tasksList.add(t);
        }

        for(counter = initialization;counter<ceiling;counter++) {
            tasksList.get(counter).join();
        }
        then.run();
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
