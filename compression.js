const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Compression
const compressImages = (filePath, outputLocation) => {
    let compressValue = parseInt(document.getElementById('compressionRate').value);
     sharp(filePath).jpeg({
         quality: compressValue
     }).toFile(outputLocation + path.basename(filePath), (err, info) => {
         if (err) {
            console.log(err);
         }
        document.getElementById('textArea').value += "\nProcessing Image: " + path.basename(filePath);
     });
}


// Event Listeners
document.getElementById('start').addEventListener('click', () => {
    // Reset Console Area
    document.getElementById('textArea').value = "";

    // Import export folders
    let importFolderLocation = document.getElementById('importFolder').files;
    let exportFolderLocation = document.getElementById('exportFolder').files;
    
    if (importFolderLocation.length === 0 || exportFolderLocation.length === 0) {
        document.getElementById('textArea').value += "\nMissing import/export folder!";
        return;
    }

    // Read All Files
    document.getElementById('textArea').value += "Starting compression...";
    fs.readdir(importFolderLocation[0].path, (err, files) => {
        if (err){
            document.getElementById('textArea').value += "\nError starting process";
            document.getElementById('textArea').value += "\n" + err;
        }
        files.forEach((file) => {
            // Only want JPEGS or PNG or GIF
            if (path.extname(file) === ".jpg" || path.extname(file) === ".JPEG" || path.extname(file) === ".png" || path.extname(file) === ".JPG") {
                compressImages(importFolderLocation[0].path + "/" + file, exportFolderLocation[0].path + "/");
            }
        });
    });
});

// Slider
document.getElementById('compressionRate').oninput = () => {
    document.getElementById('compressionValue').innerText = document.getElementById('compressionRate').value;
}