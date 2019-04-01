const fs = require("fs");
const path = require('path');

module.exports = class FileUtils {
    static get ASSETS_DIRECTORY() {
        return "./assets/"
    };

    static readAllFiles(onFileRead, ignore = []) {
        fs.readdir(FileUtils.ASSETS_DIRECTORY, function(err, filenames) {
            if (err) {
                throw err;
            }
            filenames.forEach(function(filename) {
                if(!ignore.includes(filename.toLowerCase()))
                    fs.readFile(FileUtils.ASSETS_DIRECTORY + filename, 'utf-8', function(err, content) {
                        if (err) {
                            throw err;
                        }
                        const extension = FileUtils.getExtension(filename);
                        onFileRead(
                            filename.substr(0,filename.length - extension.length - 1),
                            extension,
                            content
                        );
                    });
            });
        });
    }

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

    static getExtension(fileName) {
        return path.extname(fileName).substr(1).trim().toLowerCase();
    }
};