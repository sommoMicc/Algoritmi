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
    const firstAnswer = (new Hierarchical(datasets[3107],15,5)).clustering();
    Plotter.disegnaCluster(firstAnswer,"risposta_1");

    //Risposta 2
    const secondAnswer = (new KMeans(datasets[3107],15,5)).clustering();
    Plotter.disegnaCluster(secondAnswer,"risposta_2");
}

function logSeparator() {
    console.log("-+-+-+-+--+-+-+-+-+-+-+-+-+-+-+-+-+");
}


main();