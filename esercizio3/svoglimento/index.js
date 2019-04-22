const ProgressBar = require("progress");

const FileUtils = require("./utils/fileUtils");
const GeoGraph = require("./models/geoGraph");

async function main() {
    let progressBar = null;
    let progress = 0;

    const geoGraphs = [];

    FileUtils.readAllFiles(async (tot,extension,content)=>{
        if(progressBar == null) {
            progressBar = new ProgressBar("Lettura file [:bar] :percent",{total: tot});
        }
        progressBar.tick();
        let rows = content.split("\n");

        const coordsType = FileUtils.getCoordsType(rows[4]);
        const geoGraph = new GeoGraph(coordsType);

        for(let i=6;i<rows.length;i++) {
            if (
                !rows[i].trim().match(/^\d/) || 
                rows[i].trim().length < 1 || 
                rows[i].trim() === "EOF") {
                //Se la riga non inizia con un numero, vado avanti (perché non è una riga di coordinata)
                continue;
            }
            geoGraph.parseRow(rows[i]);
        }
        geoGraphs.push(geoGraph);

        progress++;
        if(progress >= tot) {
            await progressBar.terminate();

        }
    });
}

main();