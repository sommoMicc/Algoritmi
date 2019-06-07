const FileUtils = require("./utils/fileUtils");
const Plotter = require("./utils/plotter");

const Dataset = require("./models/dataset");
const Cluster = require("./models/cluster");
const KMeans = require("./algorithms/kmeans");
const Hierarchical = require("./algorithms/hierarchical");

const datasets = {};

async function main() {
    let progress = 0;


    FileUtils.readAllFiles(async (tot,name,extension,content)=>{
        if(extension === "csv") {
            const d = new Dataset(content);
            datasets[d.size()] = d;
        }
        progress++;
        if(progress >= tot) {
            await beginAlgorithm();
        }
    },["map.png"]);
}

async function beginAlgorithm() {
    const skipHeavy = true;
    //Primo blocco di risposte
    logSeparator();
    if(!skipHeavy) {
        //Risposta 1
        console.time("Risposta 1");
        const risposta1 = (new Hierarchical(datasets[3107], 15)).clustering();
        console.timeEnd("Risposta 1");
        Plotter.disegnaCluster(risposta1, "risposta_1");
        //Risposta 2
        console.time("Risposta 2");
        const risposta2 = (new KMeans(datasets[3107], 15, 5)).clustering();
        console.timeEnd("Risposta 2");
        Plotter.disegnaCluster(risposta2, "risposta_2");
        //Secondo blocco di risposte
        logSeparator();
        //Risposta 4
        console.time("Risposta 4");
        const risposta4 = (new Hierarchical(datasets[212], 9)).clustering();
        console.timeEnd("Risposta 4");
        console.log("Distorsione Hierarchical: " + Cluster.getDistortion(risposta4));
        Plotter.disegnaCluster(risposta4, "risposta_4");
        //Risposta 5
        console.time("Risposta 5");
        const risposta5 = (new KMeans(datasets[212], 9, 5)).clustering();
        console.timeEnd("Risposta 5");
        console.log("Distorsione KMeans: " + Cluster.getDistortion(risposta5));
        Plotter.disegnaCluster(risposta5, "risposta_5");
    }
    //Benchmark
    console.time("Benchmark kmeans");
    const benchmarkK = (new KMeans(datasets[562],16,5)).clustering();
    console.timeEnd("Benchmark kmeans");
    console.log("Distorsione Benchmark k: "+Cluster.getDistortion(benchmarkK));
    Plotter.disegnaCluster(benchmarkK,"benchmarkK");

    console.time("Benchmark hierarchical");
    const benchmarkH = (new Hierarchical(datasets[562],16)).clustering();
    console.timeEnd("Benchmark hierarchical");
    console.log("Distorsione Benchmark H: "+Cluster.getDistortion(benchmarkH));
    Plotter.disegnaCluster(benchmarkH,"benchmarkH");

}

function logSeparator() {
    console.log("-+-+-+-+--+-+-+-+-+-+-+-+-+-+-+-+-+");
}


main();