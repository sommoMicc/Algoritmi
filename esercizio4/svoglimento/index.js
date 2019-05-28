const FileUtils = require("./utils/fileUtils");
const Dataset = require("./models/dataset");
const KMeans = require("./algorithms/kmeans");

const datasets = {};
let pngMap = "";

async function main() {
    let progressBar = null;
    let progress = 0;


    FileUtils.readAllFiles(async (tot,name,extension,content)=>{
        if(extension === "csv") {
            const d = new Dataset(content);
            datasets[d.size()] = d;
        }
        else if(extension === "png") {
            pngMap = content;
            console.log("Letto png");
        }
        progress++;
        if(progress >= tot) {
            await beginAlgorithm();
        }
    });
}

async function beginAlgorithm() {
    console.log((new KMeans(datasets[3107],15,5)).clustering());
}

function logSeparator() {
    console.log("-+-+-+-+--+-+-+-+-+-+-+-+-+-+-+-+-+");
}


main();