/**
 * Classe che implementa il parallelfor con fork/join
 */
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

    /**
     * Costruttore
     * @param initialization valore da cui far partire il contatore
     * @param ceiling valore a cui fare arrivare il contatore (compreso, ovvero corrisponde
     *                a for(int i=initialization; i<=ceiling; i++) )
     * @param function funzione da eseguire ad ogni iterazione
     */
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

    /**
     * Task per l'esecuzione parallela di un'iterazione del parallelfor
     */
    private class ParallelForTask extends RecursiveTask<Void> {
        private int counterValue;

        /**
         * Costruttore
         * @param counterValue numero dell'iterazione corrente
         */
        public ParallelForTask(int counterValue) {
            this.counterValue = counterValue;
        }

        /**
         * Esecuzione del corpo di un'iterazione
         * @return null
         */
        @Override
        protected Void compute() {
            function.accept(counterValue);
            return null;
        }
    }
}
