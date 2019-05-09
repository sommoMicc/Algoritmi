const ProgressBar = require("progress");

const FileUtils = require("./utils/fileUtils");
const GeoGraph = require("./models/geoGraph");
const GraphWalker = require("./utils/graphWalker");

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

            const totalNodesToWalk = Math.pow(2,geoGraphs[0].getNodesList().length + 1) *
                3 * geoGraphs[0].getNodesList().length;

            const hkProgressBar = new ProgressBar("Held Karp [:bar] :percent",{
                total: totalNodesToWalk
            });
            let iterations = 0;
            let result = GraphWalker.HeldKarp(geoGraphs[0]);
            await hkProgressBar.terminate();
            console.log("Risultato: "+result+", iterazioni: "+iterations);

        }
    });
}

main();