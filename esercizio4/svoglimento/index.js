const FileUtils = require("./utils/fileUtils");
const Plotter = require("./utils/plotter");
const GraphPlotter = require("./utils/graphPlotter");

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
    console.log("Letti "+Object.keys(datasets).length+" file. Inizio calcolo..");
    const skipHeavy = false;
    if(!skipHeavy) {
        compute("Risposta 1 - (Hierarchical)", new Hierarchical(datasets[3107], 15));
        compute("Risposta 2 - (KMeans)", new KMeans(datasets[3107], 15, 5));
    }

    compute("Risposta 4 - (Hierarchical)", new Hierarchical(datasets[212], 9));
    compute("Risposta 5 - (KMeans)", new KMeans(datasets[212], 9, 5));

    const skipBenchmark = true;
    if(!skipBenchmark) {
        compute("Benchmark kmeans", new KMeans(datasets[562],16,5));
        compute("Benchmark hierarchical" ,new Hierarchical(datasets[562],16));
    }

    const skipPlot = false;
    if(!skipPlot) {
        [212,562,1041].forEach((key)=>{
            const plotData = {
                dataset: key,
                data: {}
            };
            const hierarchicalData = Hierarchical
                .cascadeClustering(key,datasets[key],6,20);
            plotData.data["Hierarchical"] = Cluster.cascadeDistortion(hierarchicalData);

            const kmeansData = KMeans
                .cascadeClustering(key,datasets[key],6,20);
            plotData.data["KMeans"] = Cluster.cascadeDistortion(kmeansData);

            GraphPlotter.distortion(plotData);
        });
    }
}

/**
 * Avvia e monitora un algoritmo di clustering, salvandone
 * i risultati
 * @param {String}desc la descrizione dell'algoritmo avviato
 * @param {Algorithm}algorithm l'istanza dell'algoritmo
 */
function compute(desc,algorithm) {
    console.time(desc);
    const results = algorithm.clustering();
    logSeparator();
    console.timeEnd(desc);
    console.log("Distorsione "+desc.toLocaleLowerCase()+": "+Cluster.getDistortion(results).toExponential(6));
    Plotter.disegnaCluster(results,desc.toLocaleLowerCase().replace(/ /g,"_"));
}

function logSeparator() {
    console.log("-+-+-+-+--+-+-+-+-+-+-+-+-+-+-+-+-+");
}


main();