const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Queue for images and cancel
let processing = false;
let imageQueue = [];
let promises = [];

// Compression
const compressImages = (outputLocation) => {
    let compressValue = parseInt(document.getElementById('compressionRate').value);

    // Create Promises
    imageQueue.forEach((image) => {
        promises.push(new Promise((resolve, reject) => {
            document.getElementById('textArea').value += "\nProcessing image: " + path.basename(image) + ".";
            sharp(image).jpeg({
                quality: compressValue
            }).toBuffer().then((data) => {
                sharp(data).toFile(outputLocation + path.basename(image), (err, info) => {
                    if (err) {
                        document.getElementById('textArea').value += "\nError on image: " + path.basename(image) + ". " + err;
                    }
                });
            }).catch((err) => {
                document.getElementById('textArea').value += "\nError on image: " + path.basename(image) + ". " + err;
            });
        }));
    });

    // Do all promises
    processing = true;
    Promise.all(promises).then(() => console.log("Done"));
    //document.getElementById('textArea').value += "\nImage Processing complete.";
    //document.getElementById('start').innerText = "Start Compression";
    processing = false;
}

// Helper functions
const checkFolders = (importFolder, exportFolder) => {
    if (importFolder.length === 0 || exportFolder.length === 0) {
        document.getElementById('textArea').value += "Missing import/export folder!";
        return false;
    }
    return true;
}

// Event Listeners
document.getElementById('start').addEventListener('click', () => {
    // Images are being processed
    if (processing) {
        document.getElementById('textArea').value += "\nImages are already being processed!";
        return;
    }

    // Reset
    document.getElementById('textArea').value = "";
    imageQueue = [];

    // Import export folders
    let importFolderLocation = document.getElementById('importChooser').files;
    let exportFolderLocation = document.getElementById('exportChooser').files;
    if (!checkFolders(importFolderLocation, exportFolderLocation)) {
        return;
    }

    // Swap Button name
    document.getElementById('start').innerText = "Compressing Images";

    // Read All Files
    document.getElementById('textArea').value += "Reading directory files";
    fs.readdir(importFolderLocation[0].path, (err, files) => {

        // Stop if error when starting
        if (err) {
            document.getElementById('textArea').value += "\nError starting process";
            document.getElementById('textArea').value += "\n" + err;
            throw new Error(err);
        }

        files.forEach((file) => {
            // Only want JPEGS or PNG or GIF
            if (path.extname(file) === ".jpg" || path.extname(file) === ".JPEG" || path.extname(file) === ".png" || path.extname(file) === ".JPG") {
                let imageLocationPath = importFolderLocation[0].path + "/" + file;
                imageQueue.push(imageLocationPath);
            } else {
                document.getElementById('textArea').value += "\n" + file + " is not a jpeg, png or gif image.";
            }
        });
        // Reading done
        document.getElementById('textArea').value += "\nFinished reading directory.";
        document.getElementById('textArea').value += "\nStarting compression...";
        compressImages(exportFolderLocation[0].path + "/");
    });
});

// Slider
document.getElementById('compressionRate').oninput = () => {
    document.getElementById('compressionValue').innerText = document.getElementById('compressionRate').value;
}

// Div for buttons
document.getElementById('importButton').onclick = () => {
    document.getElementById('importChooser').click();
}

document.getElementById('exportButton').onclick = () => {
    document.getElementById('exportChooser').click();
}

// Name for Buttons
document.getElementById('importChooser').addEventListener('change', () => {
    if (document.getElementById('importChooser').files[0] != undefined) {
        document.getElementById('importText').innerText = "Import Folder " + document.getElementById('importChooser').files[0].name;
    } else {
        document.getElementById('importText').innerText = "Import Folder ";
    }
});

document.getElementById('exportChooser').addEventListener('change', () => {
    if (document.getElementById('exportChooser').files[0] != undefined) {
        document.getElementById('exportText').innerText = "Export Folder " + document.getElementById('exportChooser').files[0].name;
    } else {
        document.getElementById('exportText').innerText = "Export Folder ";
    }
});

// Clear Button
document.getElementById('clearButton').onclick = () => {
    document.getElementById('exportChooser').value = null;
    document.getElementById('importChooser').value = null;
    document.getElementById('exportText').innerText = "Export Folder ";
    document.getElementById('importText').innerText = "Import Folder ";
}