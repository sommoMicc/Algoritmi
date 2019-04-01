const FileUtils = require("./utils/fileUtils");

function main() {
    FileUtils.readAllFiles("./public_transport_dataset/",
        (name,extension,content)=>{
            console.log("Letto file: "+name+
                ", estensione: "+extension+
                ", lunghezza: "+content.length);
    });
}

main();