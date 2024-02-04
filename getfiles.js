const fs = require('fs');
const path = require('path');

function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const contentWithoutEmptyLines = data.replace(/^\s*[\r\n]/gm, '');
                resolve({ name: path.basename(filePath), content: contentWithoutEmptyLines });
            }
        });
    });
}

function readFilesInDirectory(directoryPath, outputFilePath) {
    let promises = [];

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);
            promises.push(readFile(filePath));
        });

        Promise.all(promises)
            .then(results => {
                const writeStream = fs.createWriteStream(outputFilePath);

                results.forEach(result => {
                    writeStream.write(`Filename: ${result.name}\n`);
                    writeStream.write('File Content:\n');
                    writeStream.write(`${result.content}\n`);
                    writeStream.write('---------------------------\n');
                });

                writeStream.end();
                console.log(`Files and content written to ${outputFilePath}`);
            })
            .catch(error => {
                console.error('Error reading files:', error);
            });
    });
}

const directoryPath = '/Users/harshrajput/Documents/code/Tickle/react-frontend/react-chatapp/src/components'; // Replace with the directory path you want to read
const outputFilePath = 'output.txt'; // Replace with the desired output file path

readFilesInDirectory(directoryPath, outputFilePath);
