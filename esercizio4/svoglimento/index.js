const FileUtils = require("./utils/fileUtils");
const Plotter = require("./utils/plotter");

const Dataset = require("./models/dataset");
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
    //Primo blocco di risposte
    logSeparator();
    //Risposta 1
    console.time("Risposta 1");
    const risposta1 = (new Hierarchical(datasets[3107],15)).clustering();
    console.timeEnd("Risposta 1");
    Plotter.disegnaCluster(risposta1,"risposta_1");
    //Risposta 2
    console.time("Risposta 2");
    const risposta2 = (new KMeans(datasets[3107],15,5)).clustering();
    console.timeEnd("Risposta 2");
    Plotter.disegnaCluster(risposta2,"risposta_2");
    //Secondo blocco di risposte
    logSeparator();
    //Risposta 4
    console.time("Risposta 4");
    const risposta4 = (new Hierarchical(datasets[212],9)).clustering();
    console.timeEnd("Risposta 4");
    Plotter.disegnaCluster(risposta4,"risposta_4");
    //Risposta 5
    console.time("Risposta 5");
    const risposta5 = (new KMeans(datasets[212],9,5)).clustering();
    console.timeEnd("Risposta 5");
    Plotter.disegnaCluster(risposta5,"risposta_5");
}

function logSeparator() {
    console.log("-+-+-+-+--+-+-+-+-+-+-+-+-+-+-+-+-+");
}


main();