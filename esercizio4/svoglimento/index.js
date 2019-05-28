const ProgressBar = require("progress");
const FileUtils = require("./utils/fileUtils");
const Dataset = require("./models/dataset");

const datasets = [];
let pngMap = "";

async function main() {
    let progressBar = null;
    let progress = 0;


    FileUtils.readAllFiles(async (tot,name,extension,content)=>{
        if(progressBar == null) {
            progressBar = new ProgressBar("Lettura file [:bar] :percent",{total: tot});
        }
        progressBar.tick();
        if(extension === "csv") {
            datasets.push(new Dataset(content));
        }
        else if(extension === "png") {
            pngMap = content;
            console.log("Letto png");
        }
        progress++;
        if(progress >= tot) {
            await progressBar.terminate();

            beginAlgorithm();
        }
    });
}

async function beginAlgorithm() {

}

function logSeparator() {
    console.log("-+-+-+-+--+-+-+-+-+-+-+-+-+-+-+-+-+");
}


main();