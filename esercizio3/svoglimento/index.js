const ProgressBar = require("progress");

const FileUtils = require("./utils/fileUtils");

async function main() {
    let progressBar = null;
    let progress = 0;
    FileUtils.readAllFiles(async (tot,extension,content)=>{
        if(progressBar == null) {
            progressBar = new ProgressBar("Lettura file [:bar] :percent",{total: tot});
        }
        progressBar.tick();
        let rows = content.split("\n");

        const coordsType = FileUtils.getCoordsType(rows[4]);
        for(let i=6;i<rows.length;i++) {
            if (!rows[i].trim().match(/^\d/) || rows[i].trim().length < 1) {
                //Se la riga non inizia con un numero, vado avanti (perché non è una riga di coordinata)
                continue;
            }
            
        }
        progress++;
        if(progress >= tot) {
            await progressBar.terminate();

        }
    });
}

main();