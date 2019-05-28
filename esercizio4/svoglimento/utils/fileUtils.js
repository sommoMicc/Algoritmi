const fs = require("fs");
const path = require('path');

module.exports = class FileUtils {
    static get ASSETS_DIRECTORY() {
        return "./assets/"
    };

    /**
     * Legge tutti i file all'interno della cartella assets e ne ritorna
     * il contenuto
     * @param {function(string)} onFileRead listener che viene invocato quando
     * un file è stato letto
     * @param {Array<string>} ignore lista di file da ignorare
     * @param {function} onFinished listener che viene invocato quando tutti
     * i file sono stati letti
     */
    static readAllFiles(onFileRead, ignore = [], onFinished = null) {
        fs.readdir(FileUtils.ASSETS_DIRECTORY, function(err, filenames) {
            if (err) {
                throw err;
            }
            for(let i=0;i<filenames.length;i++) {
                const filename = filenames[i];
                if (!ignore.includes(filename.toLowerCase()))
                    fs.readFile(FileUtils.ASSETS_DIRECTORY + filename, 'utf-8', function (err, content) {
                        if (err) {
                            throw err;
                        }
                        const extension = FileUtils.getExtension(filename);
                        onFileRead(
                            filenames.length - ignore.length,
                            filename.substr(0,filename.length - extension.length - 1),
                            extension,
                            content
                        );
                    });
            }
        });
    }

    /**
     * Legge il contenuto di un file all'interno della cartella assets
     * @param {String} fileName il nome del file che si vuole leggere
     * @returns {Promise<string>} il contenuto del file
     */
    static async readFile(fileName) {
        return new Promise((resolve)=> {
            fs.readFile(FileUtils.ASSETS_DIRECTORY + fileName, 'utf-8', function(err, content) {
                if (err) {
                    throw err;
                }
                resolve(content);
            });
        })
    }

    /**
     * Ritorna l'estensione del file passato come parametro
     * @param {string} fileName il nome del file di cui si vuole sapere l'estensione
     * @returns {string} l'estensione del file passato come parametro
     */
    static getExtension(fileName) {
        return path.extname(fileName).substr(1).trim().toLowerCase();
    }
};