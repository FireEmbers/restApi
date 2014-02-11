var fs = require('fs');
var join = require('path').join;
module.exports = printKml;


function printKml (kml, filePath, outputPath, callback){

  fs.mkdir(outputPath, '777', onDirCreate);

  function onDirCreate(err){

    writeFile();

  }

  function writeFile(){
    fs.writeFile(join(outputPath, filePath), kml, {encoding:'utf8', mode: 0644}, onFileWrite);
  }

  function onFileWrite(err) {
    if (err) {
      callback (err);
    } else {
      callback(null);
    }
  }

}

