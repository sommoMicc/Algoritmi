const fs = require("fs");
const path = require('path');

module.exports = class FileUtils {
    static readAllFiles(directory, onFileRead) {
        fs.readdir(directory, function(err, filenames) {
            if (err) {
                throw err;
            }
            filenames.forEach(function(filename) {
                fs.readFile(directory + filename, 'utf-8', function(err, content) {
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

    static getExtension(fileName) {
        return path.extname(fileName).substr(1).trim().toLowerCase();
    }
};