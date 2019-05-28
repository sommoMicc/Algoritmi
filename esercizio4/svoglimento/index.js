const FileUtils = require("./utils/fileUtils");
const Plotter = require("./utils/plotter");

const Dataset = require("./models/dataset");
const KMeans = require("./algorithms/kmeans");

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
    const clusters = (new KMeans(datasets[3107],15,5)).clustering();
    Plotter.disegnaKMeans(clusters);
}

function logSeparator() {
    console.log("-+-+-+-+--+-+-+-+-+-+-+-+-+-+-+-+-+");
}


main();