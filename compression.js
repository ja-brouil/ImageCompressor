const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Queue for images and cancel
let processing = false;
let imageQueue = [];
let outputLocationpath;
let compressionValue;

// Compression
const compressImages = () => {
    setInterval(() => {
        if (imageQueue.length && processing) {
            processing = true;
            sharp(imageQueue[0]).jpeg({
                quality: compressionValue
            }).toFile(outputLocationpath + path.basename(imageQueue[0].toString()), (err, info) => {
                if (err) {
                    document.getElementById('textArea').value += "\nError on image: " + path.basename(imageQueue[0].toString()) + ". " + err;
                    document.getElementById('textArea').scrollTop = document.getElementById("textArea").scrollHeight;
                } else {
                    if (imageQueue[0] !== undefined){
                        document.getElementById('textArea').value += "\nCompressed Image: " + path.basename(imageQueue[0].toString());
                        document.getElementById('textArea').scrollTop = document.getElementById("textArea").scrollHeight;
                    }
                }
            });

            // Shift Queue
            imageQueue.shift();
        }

        // Queue is done
        if (imageQueue.length == 0 && processing) {
            processing = false;
            document.getElementById('start').innerText = "Start Compression";
            document.getElementById('textArea').scrollTop = document.getElementById("textArea").scrollHeight;
            document.getElementById('textArea').value += "\nCompression finished!";
            document.getElementById('textArea').scrollTop = document.getElementById("textArea").scrollHeight;
        }
    }, 500);
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
        clearQueue();
        return;
    }

    // Reset
    document.getElementById('textArea').value = "";
    imageQueue = [];
    clearInterval(compressImages);

    // Import export folders
    let importFolderLocation = document.getElementById('importChooser').files;
    let exportFolderLocation = document.getElementById('exportChooser').files;
    if (!checkFolders(importFolderLocation, exportFolderLocation)) {
        return;
    }

    // Swap Button name
    document.getElementById('start').innerText = "Cancel process...";

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
            if (path.extname(file) === ".jpg" || path.extname(file) === ".JPEG" || path.extname(file) === ".png" || path.extname(file) === ".JPG" || path.extname(file) === ".jpeg" || path.extname(file) === ".PNG" || path.extname(file) === ".GIF") {
                let imageLocationPath = importFolderLocation[0].path + "/" + file;
                imageQueue.push(imageLocationPath);
            } else {
                document.getElementById('textArea').value += "\n" + file + " is not a jpeg, png or gif image.";
                document.getElementById('textArea').scrollTop = document.getElementById("textArea").scrollHeight;
            }
        });
        // Reading done
        document.getElementById('textArea').value += "\nFinished reading directory.";
        document.getElementById('textArea').value += "\nStarting compression...";
        document.getElementById('textArea').scrollTop = document.getElementById("textArea").scrollHeight;

        // Start Compression
        outputLocationpath = exportFolderLocation[0].path + "/";
        compressionValue = 100 - parseInt(document.getElementById('compressionRate').value);
        processing = true;
        compressImages();
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
// Import
document.getElementById('importChooser').addEventListener('change', () => {
    if (document.getElementById('importChooser').files[0] != undefined) {
        document.getElementById('importText').innerText = "Import Folder " + document.getElementById('importChooser').files[0].name;
    } else {
        document.getElementById('importText').innerText = "Import Folder ";
    }
});

// Export
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

// Cancel Process
const clearQueue = () => {
    imageQueue = [];

    clearInterval(compressImages);

    // Cancel message
    document.getElementById('textArea').value += "\nComnpression cancelled by user.";


    // Allow compression again
    processing = false;
    document.getElementById('start').innerText = "Start Compression";
}