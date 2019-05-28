const ProgressBar = require("progress");
const FileUtils = require("./utils/fileUtils");
const Dataset = require("./models/dataset");

const datasets = [];

async function main() {
    let progressBar = null;
    let progress = 0;


    FileUtils.readAllFiles(async (tot,name,extension,content)=>{
        if(progressBar == null) {
            progressBar = new ProgressBar("Lettura file [:bar] :percent",{total: tot});
        }
        progressBar.tick();
        datasets.push(new Dataset(content));

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